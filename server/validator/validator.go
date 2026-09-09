package validator

import (
	"fmt"
	"regexp"
	"strings"

	"tytgear-backend/models"
)

var (
	responseIDRegex = regexp.MustCompile(`^TYT-2026-[A-Z0-9]{8}$`)
	emailRegex      = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
)

// ValidateSubmission validates the entire incoming payload against business rules
func ValidateSubmission(p *models.SurveySubmissionPayload) []models.FieldError {
	var errs []models.FieldError

	addErr := func(field, msg string) {
		errs = append(errs, models.FieldError{Field: field, Message: msg})
	}

	// 1. Response ID format
	if !responseIDRegex.MatchString(p.ResponseID) {
		addErr("response_id", "Invalid response ID format (must be TYT-2026-XXXXXXXX)")
	}

	// 2. Survey Version (Accept 2.0 or 1.0)
	if p.SurveyVersion != "2.0" && p.SurveyVersion != "1.0" {
		addErr("survey_version", "Unsupported survey version (expected 2.0)")
	}

	// 3. Started At
	if strings.TrimSpace(p.StartedAt) == "" {
		addErr("started_at", "Started timestamp is required")
	}

	// Participant Identity
	if strings.TrimSpace(p.Name) == "" {
		addErr("name", "Name is required")
	}

	// Section 1 - Profile
	if strings.TrimSpace(p.Age) == "" {
		addErr("age", "Age group is required")
	}
	if strings.TrimSpace(p.RespondentType) == "" {
		addErr("respondent_type", "Respondent type is required")
	}
	if strings.TrimSpace(p.City) == "" {
		addErr("city", "City is required")
	}
	if strings.TrimSpace(p.State) == "" {
		addErr("state", "State is required")
	}
	if strings.TrimSpace(p.Affiliation) == "" && strings.TrimSpace(p.CollegeName) == "" {
		addErr("affiliation", "College, university, or company is required")
	}

	// Section 2 - Interests & Gaming
	if len(p.Interests) == 0 {
		addErr("interests", "Please select at least one interest")
	}
	if strings.TrimSpace(p.GamingFrequency) == "" {
		addErr("gaming_frequency", "Gaming frequency is required")
	}
	if len(p.Platforms) == 0 {
		addErr("platforms", "Please select at least one platform")
	}
	if strings.TrimSpace(p.SetupType) == "" {
		addErr("setup_type", "Setup description is required")
	}

	// Section 3 - Current Products & Purchasing Behavior
	if len(p.OwnedProducts) == 0 {
		addErr("owned_products", "Please select products you currently own")
	}
	if strings.TrimSpace(p.LastPurchase) == "" {
		addErr("last_purchase", "Last purchase timeframe is required")
	}
	if strings.TrimSpace(p.RecentPurchase) == "" {
		addErr("recent_purchase", "Recent purchase is required")
	}
	if strings.TrimSpace(p.RecentSpend) == "" {
		addErr("recent_spend", "Recent spend range is required")
	}
	if len(p.PurchaseLocation) == 0 {
		addErr("purchase_location", "Purchase location is required")
	}
	if len(p.PurchaseDrivers) == 0 {
		addErr("purchase_drivers", "Please select at least 1 factor influencing your purchase")
	} else if len(p.PurchaseDrivers) > 3 {
		addErr("purchase_drivers", "Please select no more than 3 purchase drivers")
	}

	// Section 4 - Product Interest
	if p.ProductInterests == nil || len(p.ProductInterests) < 6 {
		addErr("product_interests", "Please rate your interest in all product categories")
	}
	if len(p.TopProducts) == 0 {
		addErr("top_products", "Please select at least 1 prioritized product")
	} else if len(p.TopProducts) > 3 {
		addErr("top_products", "Please choose no more than 3 products")
	}

	// Section 5 - Design Preferences
	if len(p.DesignPurchaseDrivers) == 0 {
		addErr("design_purchase_drivers", "Please select what makes a design worth purchasing")
	} else if len(p.DesignPurchaseDrivers) > 3 {
		addErr("design_purchase_drivers", "Please select no more than 3 reasons")
	}

	// Section 6 - Product Budget Ranges
	if p.BudgetSmallMousepadMin != nil && p.BudgetSmallMousepadMax != nil && *p.BudgetSmallMousepadMin > *p.BudgetSmallMousepadMax {
		addErr("budget_small_mousepad_max", "Small mousepad max budget should be greater than or equal to min budget")
	}
	if p.BudgetLargeMousepadMin != nil && p.BudgetLargeMousepadMax != nil && *p.BudgetLargeMousepadMin > *p.BudgetLargeMousepadMax {
		addErr("budget_large_mousepad_max", "Large mousepad max budget should be greater than or equal to min budget")
	}
	if p.BudgetPosterMin != nil && p.BudgetPosterMax != nil && *p.BudgetPosterMin > *p.BudgetPosterMax {
		addErr("budget_poster_max", "Poster max budget should be greater than or equal to min budget")
	}
	if p.BudgetTapestryMin != nil && p.BudgetTapestryMax != nil && *p.BudgetTapestryMin > *p.BudgetTapestryMax {
		addErr("budget_tapestry_max", "Tapestry max budget should be greater than or equal to min budget")
	}

	// Section 6 - Price Sliders: Small Mousepad
	if p.PriceSmallTooCheap != nil && p.PriceSmallGoodDeal != nil && *p.PriceSmallTooCheap > *p.PriceSmallGoodDeal {
		addErr("price_small_good_deal", fmt.Sprintf("Good deal price (₹%.0f) should be greater than too-cheap price (₹%.0f)", *p.PriceSmallGoodDeal, *p.PriceSmallTooCheap))
	}
	if p.PriceSmallGoodDeal != nil && p.PriceSmallExpensive != nil && *p.PriceSmallGoodDeal > *p.PriceSmallExpensive {
		addErr("price_small_expensive", fmt.Sprintf("Expensive price (₹%.0f) should be greater than good deal price (₹%.0f)", *p.PriceSmallExpensive, *p.PriceSmallGoodDeal))
	}
	if p.PriceSmallExpensive != nil && p.PriceSmallTooExpensive != nil && *p.PriceSmallExpensive > *p.PriceSmallTooExpensive {
		addErr("price_small_too_expensive", fmt.Sprintf("Too expensive price (₹%.0f) should be greater than expensive price (₹%.0f)", *p.PriceSmallTooExpensive, *p.PriceSmallExpensive))
	}

	// Section 6 - Price Sliders: Large Mousepad
	if p.PriceLargeTooCheap != nil && p.PriceLargeGoodDeal != nil && *p.PriceLargeTooCheap > *p.PriceLargeGoodDeal {
		addErr("price_large_good_deal", fmt.Sprintf("Large pad good deal price (₹%.0f) should be greater than too-cheap price (₹%.0f)", *p.PriceLargeGoodDeal, *p.PriceLargeTooCheap))
	}
	if p.PriceLargeGoodDeal != nil && p.PriceLargeExpensive != nil && *p.PriceLargeGoodDeal > *p.PriceLargeExpensive {
		addErr("price_large_expensive", fmt.Sprintf("Large pad expensive price (₹%.0f) should be greater than good deal price (₹%.0f)", *p.PriceLargeExpensive, *p.PriceLargeGoodDeal))
	}
	if p.PriceLargeExpensive != nil && p.PriceLargeTooExpensive != nil && *p.PriceLargeExpensive > *p.PriceLargeTooExpensive {
		addErr("price_large_too_expensive", fmt.Sprintf("Large pad too expensive price (₹%.0f) should be greater than expensive price (₹%.0f)", *p.PriceLargeTooExpensive, *p.PriceLargeExpensive))
	}

	// Section 7 - TYTGEAR Concept
	if strings.TrimSpace(p.TYTGearInterest) == "" {
		addErr("tytgear_interest", "TYTGEAR interest rating is required")
	}

	// Section 8 - Marketing & Launch
	if len(p.DiscoveryChannels) == 0 {
		addErr("discovery_channels", "Please select at least 1 discovery channel")
	} else if len(p.DiscoveryChannels) > 3 {
		addErr("discovery_channels", "Please select no more than 3 channels")
	}
	if len(p.ContentPreferences) == 0 {
		addErr("content_preferences", "Please select at least 1 content type")
	} else if len(p.ContentPreferences) > 3 {
		addErr("content_preferences", "Please select no more than 3 content types")
	}
	if strings.TrimSpace(p.LaunchOffer) == "" {
		addErr("launch_offer", "Launch offer selection is required")
	}
	if p.PurchaseIntent == nil || *p.PurchaseIntent < 0 || *p.PurchaseIntent > 10 {
		addErr("purchase_intent", "Purchase intent must be a scale from 0 to 10")
	}

	// Section 9 - Optional Launch Updates & Giveaway Claim (Email ONLY)
	trimmedEmail := strings.TrimSpace(p.Email)
	if trimmedEmail != "" {
		if !emailRegex.MatchString(trimmedEmail) {
			addErr("email", "Please enter a valid email address")
		}
	}

	// Section 10 - Creator Application (Optional)
	if p.IsCreator != nil && *p.IsCreator {
		hasPlatform := strings.TrimSpace(p.CreatorPlatform) != "" || len(p.CreatorPlatforms) > 0
		if !hasPlatform {
			addErr("creator_platforms", "Primary platform is required for creator application")
		}
		if strings.TrimSpace(p.CreatorHandle) == "" {
			addErr("creator_handle", "Channel handle or link is required for creator application")
		}
		if strings.TrimSpace(p.CreatorAudience) == "" {
			addErr("creator_audience", "Audience size is required for creator application")
		}
		creatorEmail := strings.TrimSpace(p.CreatorEmail)
		if creatorEmail == "" && strings.TrimSpace(p.Email) != "" {
			creatorEmail = strings.TrimSpace(p.Email)
		}
		if creatorEmail == "" || !emailRegex.MatchString(creatorEmail) {
			addErr("creator_email", "Valid creator contact email is required")
		}
		if p.CreatorTermsAccepted == nil || !*p.CreatorTermsAccepted {
			addErr("creator_terms_accepted", "Please accept the partnership expectations")
		}
	}

	return errs
}
