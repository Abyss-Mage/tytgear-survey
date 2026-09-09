package validator

import (
	"testing"
	"tytgear-backend/models"
)

func createValidPayload() *models.SurveySubmissionPayload {
	priceSmallTC := 199.0
	priceSmallGD := 349.0
	priceSmallExp := 599.0
	priceSmallTooExp := 899.0

	priceLargeTC := 499.0
	priceLargeGD := 899.0
	priceLargeExp := 1499.0
	priceLargeTooExp := 2199.0

	purchaseIntent := 9
	isCreator := true

	return &models.SurveySubmissionPayload{
		ResponseID:          "TYT-2026-A8C2D4E6",
		SurveyVersion:       "2.0",
		StartedAt:           "2026-09-08T14:00:00Z",
		Honeypot:            "",
		Name:                "Alex Sharma",
		Age:                 "18–20",
		RespondentType:      "Undergraduate student",
		City:                "New Delhi",
		State:               "Delhi",
		Affiliation:         "IIT Delhi",
		Interests:           []string{"Gaming", "Esports", "Room / Desk Setup"},
		GamingFrequency:     "Daily",
		Platforms:           []string{"Gaming PC / Laptop", "Mobile"},
		SetupType:           "Gaming setup",
		OwnedProducts:       []string{"Mousepad", "Gaming mouse"},
		LastPurchase:        "1–3 months ago",
		RecentPurchase:      "Mousepad / desk mat",
		RecentSpend:         "₹1,000–₹1,999",
		PurchaseLocation:    []string{"Amazon", "Brand website"},
		PurchaseDrivers:     []string{"Design / aesthetics", "Build quality", "Reviews / ratings"},
		ProductInterests: map[string]string{
			"small_mousepad":   "Very interested",
			"large_mousepad":   "Interested",
			"desk_accessories": "Neutral",
			"tapestry":         "Not very interested",
			"posters":          "Interested",
			"mobile_covers":    "Neutral",
		},
		TopProducts:              []string{"Small Mousepads", "Large Mousepads", "Posters"},
		DesignsAppealing:         []string{"Design A", "Design C", "Design F"},
		DesignMostLikelyPurchase: "Design C",
		DesignPurchaseDrivers:    []string{"Looks unique / Premium", "Matches my personality"},

		PriceSmallTooCheap:     &priceSmallTC,
		PriceSmallGoodDeal:     &priceSmallGD,
		PriceSmallExpensive:    &priceSmallExp,
		PriceSmallTooExpensive: &priceSmallTooExp,

		PriceLargeTooCheap:     &priceLargeTC,
		PriceLargeGoodDeal:     &priceLargeGD,
		PriceLargeExpensive:    &priceLargeExp,
		PriceLargeTooExpensive: &priceLargeTooExp,

		TYTGearInterest:     "Very interested",
		DiscoveryChannels:   []string{"Instagram / Reels", "YouTube / Shorts", "Discord Communities"},
		ContentPreferences:  []string{"Setup inspiration & desk tours", "Behind-the-scenes / manufacturing process"},
		LaunchOffer:         "Flat launch discount (e.g. 20% off)",
		PurchaseIntent:      &purchaseIntent,

		WantUpdates:    "Yes",
		Email:          "student@iitd.ac.in",
		ContactConsent: true,

		IsCreator:         &isCreator,
		CreatorPlatform:   "YouTube",
		CreatorHandle:     "@setupdiaries",
		CreatorAudience:   "5,000 – 25,000",
		CreatorCollabType: []string{"Free review units & seed gear"},
	}
}

func TestValidateSubmission_Valid(t *testing.T) {
	p := createValidPayload()
	errs := ValidateSubmission(p)
	if len(errs) != 0 {
		t.Fatalf("Expected 0 errors, got %d: %v", len(errs), errs)
	}
}

func TestValidateSubmission_InconsistentSmallPrices(t *testing.T) {
	p := createValidPayload()
	badGoodDeal := 150.0 // Less than PriceSmallTooCheap (199.0)
	p.PriceSmallGoodDeal = &badGoodDeal

	errs := ValidateSubmission(p)
	if len(errs) == 0 {
		t.Fatal("Expected error for inconsistent small pad prices, got none")
	}

	found := false
	for _, err := range errs {
		if err.Field == "price_small_good_deal" {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("Expected error on field 'price_small_good_deal', got: %v", errs)
	}
}

func TestValidateSubmission_InconsistentLargePrices(t *testing.T) {
	p := createValidPayload()
	badTooExp := 1000.0 // Less than PriceLargeExpensive (1499.0)
	p.PriceLargeTooExpensive = &badTooExp

	errs := ValidateSubmission(p)
	if len(errs) == 0 {
		t.Fatal("Expected error for inconsistent large pad prices, got none")
	}

	found := false
	for _, err := range errs {
		if err.Field == "price_large_too_expensive" {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("Expected error on field 'price_large_too_expensive', got: %v", errs)
	}
}

func TestValidateSubmission_InvalidEmail(t *testing.T) {
	p := createValidPayload()
	p.Email = "invalid-email-address"

	errs := ValidateSubmission(p)
	found := false
	for _, err := range errs {
		if err.Field == "email" {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("Expected error for invalid email address, got: %v", errs)
	}
}

func TestValidateSubmission_MissingAffiliation(t *testing.T) {
	p := createValidPayload()
	p.Affiliation = ""
	p.CollegeName = ""

	errs := ValidateSubmission(p)
	found := false
	for _, err := range errs {
		if err.Field == "affiliation" {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("Expected error for missing affiliation, got: %v", errs)
	}
}

func TestValidateSubmission_InvalidID(t *testing.T) {
	p := createValidPayload()
	p.ResponseID = "INVALID-123"

	errs := ValidateSubmission(p)
	found := false
	for _, err := range errs {
		if err.Field == "response_id" {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("Expected error for invalid response ID pattern, got: %v", errs)
	}
}
