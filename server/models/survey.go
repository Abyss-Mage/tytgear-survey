package models

import (
	"fmt"
	"strings"
)

// SurveySubmissionPayload represents the incoming JSON request from the survey client
type SurveySubmissionPayload struct {
	ResponseID    string `json:"response_id"`
	SurveyVersion string `json:"survey_version"`
	StartedAt     string `json:"started_at"`
	Honeypot      string `json:"honeypot,omitempty"`

	// Participant Identity
	Name string `json:"name"`

	// Section 1 - Profile
	Age            string `json:"age"`
	RespondentType string `json:"respondent_type"`
	City           string `json:"city"`
	State          string `json:"state"`
	Affiliation    string `json:"affiliation"` // College / University / Company
	CollegeID      string `json:"college_id,omitempty"`
	CollegeName    string `json:"college_name,omitempty"`

	// Section 2 - Interests & Gaming
	Interests       []string `json:"interests"`
	GamingFrequency string   `json:"gaming_frequency"`
	Platforms       []string `json:"platforms"`
	SetupType       string   `json:"setup_type"`

	// Section 3 - Current Products & Purchasing Behavior
	OwnedProducts    []string `json:"owned_products"`
	LastPurchase     string   `json:"last_purchase"`
	RecentPurchase   string   `json:"recent_purchase"`
	RecentSpend      string   `json:"recent_spend"`
	PurchaseLocation []string `json:"purchase_location"`
	PurchaseDrivers  []string `json:"purchase_drivers"` // Max 3

	// Section 4 - Product Interest
	ProductInterests map[string]string `json:"product_interests"`
	TopProducts      []string          `json:"top_products"` // Max 3

	// Section 5 - Design Preferences
	DesignPurchaseDrivers    []string `json:"design_purchase_drivers"` // Max 3
	DesignsAppealing         []string `json:"designs_appealing"`        // Max 3
	DesignMostLikelyPurchase string   `json:"design_most_likely_purchase,omitempty"`

	// Section 6 - Product Budget Ranges
	BudgetSmallMousepadMin *float64 `json:"budget_small_mousepad_min,omitempty"`
	BudgetSmallMousepadMax *float64 `json:"budget_small_mousepad_max,omitempty"`
	BudgetLargeMousepadMin *float64 `json:"budget_large_mousepad_min,omitempty"`
	BudgetLargeMousepadMax *float64 `json:"budget_large_mousepad_max,omitempty"`
	BudgetFramedPosterMin  *float64 `json:"budget_framed_poster_min,omitempty"`
	BudgetFramedPosterMax  *float64 `json:"budget_framed_poster_max,omitempty"`
	BudgetMetalPosterMin   *float64 `json:"budget_metal_poster_min,omitempty"`
	BudgetMetalPosterMax   *float64 `json:"budget_metal_poster_max,omitempty"`
	BudgetPosterMin        *float64 `json:"budget_poster_min,omitempty"`
	BudgetPosterMax        *float64 `json:"budget_poster_max,omitempty"`
	BudgetTapestryMin      *float64 `json:"budget_tapestry_min,omitempty"`
	BudgetTapestryMax      *float64 `json:"budget_tapestry_max,omitempty"`

	// Section 6 - Price Sliders: Small Mousepad
	PriceSmallTooCheap     *float64 `json:"price_small_too_cheap,omitempty"`
	PriceSmallGoodDeal     *float64 `json:"price_small_good_deal,omitempty"`
	PriceSmallExpensive    *float64 `json:"price_small_expensive,omitempty"`
	PriceSmallTooExpensive *float64 `json:"price_small_too_expensive,omitempty"`

	// Section 6 - Price Sliders: 80x33 cm Large Hybrid Mousepad
	PriceLargeTooCheap     *float64 `json:"price_large_too_cheap,omitempty"`
	PriceLargeGoodDeal     *float64 `json:"price_large_good_deal,omitempty"`
	PriceLargeExpensive    *float64 `json:"price_large_expensive,omitempty"`
	PriceLargeTooExpensive *float64 `json:"price_large_too_expensive,omitempty"`

	// Legacy Pricing Fallback fields
	PriceTooCheap     *float64 `json:"price_too_cheap,omitempty"`
	PriceGoodDeal     *float64 `json:"price_good_deal,omitempty"`
	PriceExpensive    *float64 `json:"price_expensive,omitempty"`
	PriceTooExpensive *float64 `json:"price_too_expensive,omitempty"`

	// Section 7 - TYTGEAR Concept
	TYTGearInterest string `json:"tytgear_interest"`

	// Section 8 - Marketing & Launch
	DiscoveryChannels  []string `json:"discovery_channels"`  // Max 3
	ContentPreferences []string `json:"content_preferences"` // Max 3
	LaunchOffer        string   `json:"launch_offer"`
	PurchaseIntent     *int     `json:"purchase_intent"` // 0-10

	// Section 9 - Giveaway & Launch Updates (Email ONLY)
	WantUpdates    string `json:"want_updates,omitempty"`
	Email          string `json:"email,omitempty"`
	ContactConsent bool   `json:"contact_consent,omitempty"`

	// Section 10 - Creator / Ambassador Program (Optional)
	IsCreator        *bool    `json:"is_creator,omitempty"`
	CreatorPlatform  string   `json:"creator_platform,omitempty"`
	CreatorHandle    string   `json:"creator_handle,omitempty"`
	CreatorAudience  string   `json:"creator_audience,omitempty"`
	CreatorCollabType []string `json:"creator_collab_type,omitempty"`
}

// SubmissionResponse represents the JSON response returned to the client
type SubmissionResponse struct {
	Success    bool         `json:"success"`
	ResponseID string       `json:"response_id,omitempty"`
	Message    string       `json:"message,omitempty"`
	Mode       string       `json:"mode,omitempty"`
	Suspicious bool         `json:"suspicious,omitempty"`
	CouponCode string       `json:"coupon_code,omitempty"`
	Errors     []FieldError `json:"errors,omitempty"`
}

// FieldError represents field-level validation errors
type FieldError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// College represents college metadata
type College struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	City   string `json:"city"`
	State  string `json:"state"`
	Active bool   `json:"active"`
}

// FormatMulti joins string slices with the pipe delimiter " | "
func FormatMulti(items []string) string {
	if len(items) == 0 {
		return ""
	}
	return strings.Join(items, " | ")
}

func formatBudgetRange(min, max *float64) string {
	if min != nil && max != nil {
		return fmt.Sprintf("₹%.0f – ₹%.0f", *min, *max)
	}
	if min != nil {
		return fmt.Sprintf("Min ₹%.0f", *min)
	}
	if max != nil {
		return fmt.Sprintf("Max ₹%.0f", *max)
	}
	return ""
}

// BuildResponseRow creates the structured row slice for the Responses sheet tab
func (p *SurveySubmissionPayload) BuildResponseRow(completedAt string, completionSeconds int, suspicious bool) []interface{} {
	var purchaseIntent interface{} = ""
	if p.PurchaseIntent != nil {
		purchaseIntent = *p.PurchaseIntent
	}

	contactConsentStr := "FALSE"
	if p.ContactConsent {
		contactConsentStr = "TRUE"
	}

	suspiciousStr := "FALSE"
	if suspicious {
		suspiciousStr = "TRUE"
	}

	isCreatorStr := "FALSE"
	if p.IsCreator != nil && *p.IsCreator {
		isCreatorStr = "TRUE"
	}

	pi := p.ProductInterests
	if pi == nil {
		pi = make(map[string]string)
	}

	affiliation := p.Affiliation
	if affiliation == "" {
		affiliation = p.CollegeName
	}

	framedPosterMin := p.BudgetFramedPosterMin
	if framedPosterMin == nil {
		framedPosterMin = p.BudgetPosterMin
	}
	framedPosterMax := p.BudgetFramedPosterMax
	if framedPosterMax == nil {
		framedPosterMax = p.BudgetPosterMax
	}

	return []interface{}{
		p.ResponseID,
		completedAt,
		p.StartedAt,
		completionSeconds,
		p.Name,
		affiliation,
		p.Age,
		p.RespondentType,
		p.City,
		p.State,
		FormatMulti(p.Interests),
		p.GamingFrequency,
		FormatMulti(p.Platforms),
		p.SetupType,
		FormatMulti(p.OwnedProducts),
		p.LastPurchase,
		p.RecentPurchase,
		p.RecentSpend,
		FormatMulti(p.PurchaseLocation),
		FormatMulti(p.PurchaseDrivers),
		pi["small_mousepad"],
		pi["large_mousepad"],
		pi["desk_accessories"],
		pi["tapestry"],
		pi["posters"],
		pi["mobile_covers"],
		FormatMulti(p.TopProducts),
		FormatMulti(p.DesignPurchaseDrivers),
		formatBudgetRange(p.BudgetSmallMousepadMin, p.BudgetSmallMousepadMax),
		formatBudgetRange(p.BudgetLargeMousepadMin, p.BudgetLargeMousepadMax),
		formatBudgetRange(framedPosterMin, framedPosterMax),
		formatBudgetRange(p.BudgetMetalPosterMin, p.BudgetMetalPosterMax),
		formatBudgetRange(p.BudgetTapestryMin, p.BudgetTapestryMax),
		p.TYTGearInterest,
		FormatMulti(p.DiscoveryChannels),
		FormatMulti(p.ContentPreferences),
		p.LaunchOffer,
		purchaseIntent,
		p.WantUpdates,
		p.Email,
		contactConsentStr,
		isCreatorStr,
		p.CreatorPlatform,
		p.CreatorHandle,
		p.CreatorAudience,
		FormatMulti(p.CreatorCollabType),
		suspiciousStr,
	}
}

// BuildLeadRow creates the lead/giveaway record
func (p *SurveySubmissionPayload) BuildLeadRow(completedAt string) []interface{} {
	consentStr := "FALSE"
	if p.ContactConsent {
		consentStr = "TRUE"
	}

	affiliation := p.Affiliation
	if affiliation == "" {
		affiliation = p.CollegeName
	}

	isCreatorStr := "FALSE"
	if p.IsCreator != nil && *p.IsCreator {
		isCreatorStr = "TRUE"
	}

	return []interface{}{
		p.ResponseID,
		completedAt,
		affiliation,
		p.Email,
		consentStr,
		isCreatorStr,
		p.CreatorPlatform,
		p.CreatorHandle,
	}
}

// BuildCouponRow creates the WooCommerce CSV import row
func (p *SurveySubmissionPayload) BuildCouponRow(completedAt string) []interface{} {
	return []interface{}{
		p.ResponseID,
		"percent",
		20,
		p.Email,
		1,
		1,
		"yes",
		"TYTGEAR Pre-Launch Survey 20% Off",
		completedAt,
	}
}
