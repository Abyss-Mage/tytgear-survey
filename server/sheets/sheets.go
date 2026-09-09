package sheets

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/oauth2/jwt"
	"google.golang.org/api/option"
	sheetsAPI "google.golang.org/api/sheets/v4"
	"tytgear-backend/config"
	"tytgear-backend/models"
)

type AppendResult struct {
	Success bool
	Mode    string
	Error   string
}

// AppendResponse writes the response to Google Sheets, or uses local datastore fallback
func AppendResponse(ctx context.Context, cfg *config.Config, p *models.SurveySubmissionPayload, completedAt string, completionSeconds int, suspicious bool) AppendResult {
	// Check if Google credentials exist
	hasGoogleCreds := cfg.GoogleServiceAccountEmail != "" && cfg.GooglePrivateKey != "" && cfg.GoogleSheetID != ""

	if !hasGoogleCreds {
		if cfg.AllowLocalSubmissionFallback {
			return appendLocalFallback(p, completedAt, completionSeconds, suspicious)
		}
		return AppendResult{
			Success: false,
			Mode:    "sheets",
			Error:   "Google Sheets credentials are not configured on the server.",
		}
	}

	// Connect to Google Sheets API
	privateKey := strings.ReplaceAll(cfg.GooglePrivateKey, `\n`, "\n")
	jwtConf := &jwt.Config{
		Email:      cfg.GoogleServiceAccountEmail,
		PrivateKey: []byte(privateKey),
		Scopes:     []string{sheetsAPI.SpreadsheetsScope},
		TokenURL:   "https://oauth2.googleapis.com/token",
	}

	client := jwtConf.Client(ctx)
	srv, err := sheetsAPI.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Printf("Failed to initialize Google Sheets service: %v", err)
		return AppendResult{
			Success: false,
			Mode:    "sheets",
			Error:   fmt.Sprintf("Failed to initialize Google Sheets service: %v", err),
		}
	}

	// 1. Append to Responses tab
	responseRow := p.BuildResponseRow(completedAt, completionSeconds, suspicious)
	vr := &sheetsAPI.ValueRange{
		Values: [][]interface{}{responseRow},
	}

	_, err = srv.Spreadsheets.Values.Append(cfg.GoogleSheetID, "Responses!A:AS", vr).
		ValueInputOption("USER_ENTERED").
		Context(ctx).
		Do()

	if err != nil {
		log.Printf("Google Sheets API Append error: %v", err)
		return AppendResult{
			Success: false,
			Mode:    "sheets",
			Error:   fmt.Sprintf("Error appending to Google Sheets: %v", err),
		}
	}

	// 2. Append to Leads & WooCommerce Coupons tabs if user consented to updates
	if p.WantUpdates == "Yes" && p.ContactConsent && strings.TrimSpace(p.Email) != "" {
		leadRow := p.BuildLeadRow(completedAt)
		leadVr := &sheetsAPI.ValueRange{
			Values: [][]interface{}{leadRow},
		}

		_, err = srv.Spreadsheets.Values.Append(cfg.GoogleSheetID, "Leads!A:H", leadVr).
			ValueInputOption("USER_ENTERED").
			Context(ctx).
			Do()

		if err != nil {
			log.Printf("Google Sheets Leads tab Append warning: %v", err)
		}

		couponRow := p.BuildCouponRow(completedAt)
		couponVr := &sheetsAPI.ValueRange{
			Values: [][]interface{}{couponRow},
		}

		_, err = srv.Spreadsheets.Values.Append(cfg.GoogleSheetID, "WooCommerce Coupons!A:I", couponVr).
			ValueInputOption("USER_ENTERED").
			Context(ctx).
			Do()

		if err != nil {
			log.Printf("Google Sheets WooCommerce Coupons tab Append warning: %v", err)
		}
	}

	return AppendResult{
		Success: true,
		Mode:    "sheets",
	}
}

func appendLocalFallback(p *models.SurveySubmissionPayload, completedAt string, completionSeconds int, suspicious bool) AppendResult {
	dataDir := ".data"
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		// try parent directory
		dataDir = filepath.Join("..", ".data")
		_ = os.MkdirAll(dataDir, 0755)
	}

	submissionsPath := filepath.Join(dataDir, "submissions.json")

	var existing []map[string]interface{}
	if fileBytes, err := os.ReadFile(submissionsPath); err == nil {
		_ = json.Unmarshal(fileBytes, &existing)
	}

	row := p.BuildResponseRow(completedAt, completionSeconds, suspicious)
	record := map[string]interface{}{
		"response_id":   p.ResponseID,
		"submitted_at":  completedAt,
		"payload":       p,
		"row_array":     row,
		"suspicious":    suspicious,
		"completion_sec": completionSeconds,
	}

	existing = append(existing, record)
	outBytes, err := json.MarshalIndent(existing, "", "  ")
	if err != nil {
		return AppendResult{Success: false, Mode: "fallback", Error: "Failed to marshal submission JSON"}
	}

	if err := os.WriteFile(submissionsPath, outBytes, 0644); err != nil {
		return AppendResult{Success: false, Mode: "fallback", Error: fmt.Sprintf("Failed to write to %s: %v", submissionsPath, err)}
	}

	// If lead consented, write to leads.json
	if p.WantUpdates == "Yes" && p.ContactConsent && strings.TrimSpace(p.Email) != "" {
		leadsPath := filepath.Join(dataDir, "leads.json")
		var existingLeads []interface{}
		if lBytes, err := os.ReadFile(leadsPath); err == nil {
			_ = json.Unmarshal(lBytes, &existingLeads)
		}
		existingLeads = append(existingLeads, p.BuildLeadRow(completedAt))
		outLeadBytes, _ := json.MarshalIndent(existingLeads, "", "  ")
		_ = os.WriteFile(leadsPath, outLeadBytes, 0644)
	}

	log.Printf("[LOCAL FALLBACK] Stored survey response %s in %s", p.ResponseID, submissionsPath)
	return AppendResult{
		Success: true,
		Mode:    "fallback",
	}
}

// AppendLead writes a lead entry directly to Google Sheets or local fallback
func AppendLead(ctx context.Context, cfg *config.Config, responseID, email, affiliation, completedAt string) AppendResult {
	hasGoogleCreds := cfg.GoogleServiceAccountEmail != "" && cfg.GooglePrivateKey != "" && cfg.GoogleSheetID != ""

	leadRow := []interface{}{
		responseID,
		completedAt,
		affiliation,
		email,
		"TRUE",
		"FALSE",
		"",
		"",
	}

	if !hasGoogleCreds {
		dataDir := ".data"
		if err := os.MkdirAll(dataDir, 0755); err != nil {
			dataDir = filepath.Join("..", ".data")
			_ = os.MkdirAll(dataDir, 0755)
		}
		leadsPath := filepath.Join(dataDir, "leads.json")
		var existingLeads []interface{}
		if lBytes, err := os.ReadFile(leadsPath); err == nil {
			_ = json.Unmarshal(lBytes, &existingLeads)
		}
		existingLeads = append(existingLeads, leadRow)
		outLeadBytes, _ := json.MarshalIndent(existingLeads, "", "  ")
		_ = os.WriteFile(leadsPath, outLeadBytes, 0644)
		return AppendResult{Success: true, Mode: "fallback"}
	}

	privateKey := strings.ReplaceAll(cfg.GooglePrivateKey, `\n`, "\n")
	jwtConf := &jwt.Config{
		Email:      cfg.GoogleServiceAccountEmail,
		PrivateKey: []byte(privateKey),
		Scopes:     []string{sheetsAPI.SpreadsheetsScope},
		TokenURL:   "https://oauth2.googleapis.com/token",
	}

	client := jwtConf.Client(ctx)
	srv, err := sheetsAPI.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return AppendResult{Success: false, Mode: "sheets", Error: err.Error()}
	}

	leadVr := &sheetsAPI.ValueRange{
		Values: [][]interface{}{leadRow},
	}
	_, err = srv.Spreadsheets.Values.Append(cfg.GoogleSheetID, "Leads!A:H", leadVr).
		ValueInputOption("USER_ENTERED").
		Context(ctx).
		Do()
	if err != nil {
		return AppendResult{Success: false, Mode: "sheets", Error: err.Error()}
	}

	return AppendResult{Success: true, Mode: "sheets"}
}

