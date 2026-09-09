package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"tytgear-backend/antispam"
	"tytgear-backend/config"
	"tytgear-backend/models"
	"tytgear-backend/sheets"
	"tytgear-backend/validator"
)

var colleges = []models.College{
	{ID: "ABC123", Name: "Delhi Technological University (DTU)", City: "New Delhi", State: "Delhi", Active: true},
	{ID: "DEF456", Name: "BITS Pilani", City: "Pilani", State: "Rajasthan", Active: true},
	{ID: "GHI789", Name: "IIT Bombay", City: "Mumbai", State: "Maharashtra", Active: true},
	{ID: "IITD01", Name: "IIT Delhi", City: "New Delhi", State: "Delhi", Active: true},
	{ID: "IITM01", Name: "IIT Madras", City: "Chennai", State: "Tamil Nadu", Active: true},
	{ID: "IITK01", Name: "IIT Kharagpur", City: "Kharagpur", State: "West Bengal", Active: true},
	{ID: "IITR01", Name: "IIT Roorkee", City: "Roorkee", State: "Uttarakhand", Active: true},
	{ID: "VIT01", Name: "VIT Vellore", City: "Vellore", State: "Tamil Nadu", Active: true},
	{ID: "SRM01", Name: "SRM Institute of Science and Technology", City: "Chennai", State: "Tamil Nadu", Active: true},
	{ID: "MANIPAL01", Name: "Manipal Academy of Higher Education (MAHE)", City: "Manipal", State: "Karnataka", Active: true},
	{ID: "DU01", Name: "University of Delhi (DU)", City: "New Delhi", State: "Delhi", Active: true},
	{ID: "PES01", Name: "PES University", City: "Bengaluru", State: "Karnataka", Active: true},
	{ID: "THAPAR01", Name: "Thapar Institute of Engineering and Technology", City: "Patiala", State: "Punjab", Active: true},
	{ID: "OTHER", Name: "Other / Not specified", City: "Not specified", State: "Not specified", Active: true},
}

func getListener(preferredPort string) (net.Listener, string, error) {
	// Try preferred port first
	l, err := net.Listen("tcp", ":"+preferredPort)
	if err == nil {
		return l, preferredPort, nil
	}

	// If preferred port is already bound (e.g. by Esports Dash or another app), try fallbacks
	fallbacks := []string{"8085", "8081", "8082", "8090", "8000"}
	for _, p := range fallbacks {
		if p == preferredPort {
			continue
		}
		l, err := net.Listen("tcp", ":"+p)
		if err == nil {
			log.Printf("Notice: Port :%s is busy by another application. Automatically switched to available port :%s", preferredPort, p)
			return l, p, nil
		}
	}
	return nil, "", fmt.Errorf("could not bind to port :%s or any fallback port (%v)", preferredPort, fallbacks)
}

func main() {
	cfg := config.Load()

	mux := http.NewServeMux()

	// 1. Health Probe
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "healthy",
			"service":   "tytgear-go-backend",
			"version":   "1.0",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	// 2. Colleges List
	mux.HandleFunc("GET /api/colleges", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":  true,
			"colleges": colleges,
		})
	})

	// 3. Survey Submit Endpoint
	mux.HandleFunc("POST /api/survey/submit", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var payload models.SurveySubmissionPayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(models.SubmissionResponse{
				Success: false,
				Message: "Invalid JSON request body format.",
			})
			return
		}

		// A. Validate Submission
		valErrors := validator.ValidateSubmission(&payload)
		if len(valErrors) > 0 {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(models.SubmissionResponse{
				Success: false,
				Message: "Please complete all required questions with valid answers.",
				Errors:  valErrors,
			})
			return
		}

		// B. Anti-Spam, Heuristics, & Idempotency
		security := antispam.Evaluate(payload.ResponseID, payload.StartedAt, payload.Honeypot)
		if security.IsDuplicate {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(models.SubmissionResponse{
				Success:    true,
				ResponseID: payload.ResponseID,
				Message:    "Response was already recorded successfully.",
				CouponCode: "TYTLAUNCH20",
			})
			return
		}

		// C. Google Sheets Submission
		completedAt := time.Now().UTC().Format(time.RFC3339)
		sheetsResult := sheets.AppendResponse(
			r.Context(),
			cfg,
			&payload,
			completedAt,
			security.CompletionSeconds,
			security.IsSuspicious,
		)

		if !sheetsResult.Success {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(models.SubmissionResponse{
				Success: false,
				Message: "We couldn't submit your response right now. Please try again.",
			})
			return
		}

		// D. Mark submission as recorded
		antispam.MarkComplete(payload.ResponseID)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(models.SubmissionResponse{
			Success:    true,
			ResponseID: payload.ResponseID,
			Mode:       sheetsResult.Mode,
			Suspicious: security.IsSuspicious,
			CouponCode: "TYTLAUNCH20",
		})
	})

	// 4. Claim Reward Endpoint (Optional email discount & giveaway entry)
	mux.HandleFunc("POST /api/survey/claim-reward", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var body struct {
			ResponseID     string `json:"response_id"`
			Email          string `json:"email"`
			ContactConsent bool   `json:"contact_consent"`
			Affiliation    string `json:"affiliation"`
		}

		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || strings.TrimSpace(body.Email) == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"success": false,
				"message": "Valid email address is required.",
			})
			return
		}

		completedAt := time.Now().UTC().Format(time.RFC3339)
		sheets.AppendLead(r.Context(), cfg, body.ResponseID, body.Email, body.Affiliation, completedAt)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":     true,
			"coupon_code": "TYTLAUNCH20",
			"message":     "Your 20% launch discount code has been sent to your email and your giveaway entry is confirmed!",
		})
	})

	// CORS and Logger Middleware
	handler := corsMiddleware(mux)

	listener, actualPort, err := getListener(cfg.Port)
	if err != nil {
		log.Fatalf("Fatal: %v", err)
	}
	defer listener.Close()

	server := &http.Server{
		Addr:         ":" + actualPort,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("TYTGEAR Go Backend listening on http://localhost:%s", actualPort)
		if err := server.Serve(listener); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server Listen error: %v", err)
		}
	}()

	<-stop
	log.Println("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced shutdown: %v", err)
	}

	log.Println("TYTGEAR Go server stopped.")
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("[%s] %s %s (%v)", r.Method, r.RequestURI, r.RemoteAddr, time.Since(start))
	})
}
