import { SurveyAnswers } from "@/types/survey";

/**
 * Maps a field name to its corresponding survey step number (1 to 14)
 */
export function getFieldStep(field: string): number {
  if (field === "name") {
    return 1;
  }
  if (
    [
      "affiliation",
      "college_id",
      "college_name",
      "age",
      "respondent_type",
      "city",
      "state",
    ].includes(field)
  ) {
    return 2;
  }
  if (
    [
      "interests",
      "gaming_frequency",
      "platforms",
      "setup_type",
    ].includes(field)
  ) {
    return 3;
  }
  if (
    [
      "owned_products",
      "last_purchase",
      "recent_purchase",
      "recent_spend",
      "purchase_location",
      "purchase_drivers",
    ].includes(field)
  ) {
    return 4;
  }
  if (
    field.startsWith("product_interests") ||
    field === "top_products"
  ) {
    return 5;
  }
  if (
    [
      "design_purchase_drivers",
      "designs_appealing",
      "design_most_likely_purchase",
    ].includes(field)
  ) {
    return 6;
  }
  if (field.includes("small")) {
    return 7;
  }
  if (field.includes("large")) {
    return 8;
  }
  if (field.includes("framed_poster")) {
    return 9;
  }
  if (field.includes("metal_poster")) {
    return 10;
  }
  if (field.includes("poster")) {
    return 9;
  }
  if (field.includes("tapestry")) {
    return 11;
  }
  if (field === "tytgear_interest") {
    return 12;
  }
  if (
    [
      "discovery_channels",
      "content_preferences",
      "launch_offer",
      "purchase_intent",
    ].includes(field)
  ) {
    return 13;
  }
  return 14;
}

/**
 * Validates all survey sections in chronological order and returns the first
 * incomplete step, field, and user-friendly error message.
 */
export function findFirstIncompleteStep(
  answers: SurveyAnswers
): { step: number; field: string; message: string } | null {
  // Step 1: Welcome & Name
  if (!answers.name || answers.name.trim().length < 2) {
    return {
      step: 1,
      field: "name",
      message: "Please enter your name on the welcome page.",
    };
  }

  // Step 2: About You
  if (!answers.age) {
    return {
      step: 2,
      field: "age",
      message: "Please select your age bracket.",
    };
  }
  if (!answers.respondent_type) {
    return {
      step: 2,
      field: "respondent_type",
      message: "Please select the option that best describes you.",
    };
  }
  if (!answers.city || answers.city.trim().length < 2) {
    return {
      step: 2,
      field: "city",
      message: "Please enter your city.",
    };
  }
  if (!answers.state) {
    return {
      step: 2,
      field: "state",
      message: "Please select your state or UT.",
    };
  }
  if (!answers.affiliation || answers.affiliation.trim().length < 2) {
    return {
      step: 2,
      field: "affiliation",
      message: "Please enter your college, university, or company affiliation.",
    };
  }

  // Step 3: Interests & Gaming Habits
  if (!answers.interests || answers.interests.length === 0) {
    return {
      step: 3,
      field: "interests",
      message: "Please select your interests (or 'None of these').",
    };
  }
  if (!answers.gaming_frequency) {
    return {
      step: 3,
      field: "gaming_frequency",
      message: "Please indicate how often you play games.",
    };
  }
  if (!answers.platforms || answers.platforms.length === 0) {
    return {
      step: 3,
      field: "platforms",
      message: "Please select the gaming platforms you regularly use.",
    };
  }
  if (!answers.setup_type) {
    return {
      step: 3,
      field: "setup_type",
      message: "Please describe your current setup.",
    };
  }

  // Step 4: What You Own & Buy
  if (!answers.owned_products || answers.owned_products.length === 0) {
    return {
      step: 4,
      field: "owned_products",
      message: "Please select what gear you currently own (or 'None of these').",
    };
  }
  if (!answers.last_purchase) {
    return {
      step: 4,
      field: "last_purchase",
      message: "Please select when you last purchased gaming/desk gear.",
    };
  }
  if (!answers.recent_purchase) {
    return {
      step: 4,
      field: "recent_purchase",
      message: "Please select your most recent purchase category.",
    };
  }
  if (!answers.recent_spend) {
    return {
      step: 4,
      field: "recent_spend",
      message: "Please select your approximate spend range.",
    };
  }
  if (!answers.purchase_location || answers.purchase_location.length === 0) {
    return {
      step: 4,
      field: "purchase_location",
      message: "Please select where you usually purchase gear.",
    };
  }
  if (!answers.purchase_drivers || answers.purchase_drivers.length === 0) {
    return {
      step: 4,
      field: "purchase_drivers",
      message: "Please select what factors influence your purchase.",
    };
  }

  // Step 5: Product Interest (All 6 products)
  const requiredProducts = [
    "small_mousepad",
    "large_mousepad",
    "desk_accessories",
    "tapestry",
    "posters",
    "mobile_covers",
  ];
  const pi = answers.product_interests || {};
  for (const prod of requiredProducts) {
    if (!pi[prod]) {
      return {
        step: 5,
        field: "product_interests",
        message: "Please rate your interest in all 6 product categories.",
      };
    }
  }
  if (!answers.top_products || answers.top_products.length === 0) {
    return {
      step: 5,
      field: "top_products",
      message: "Please select the top products you would prioritize.",
    };
  }

  // Step 6: Design Preferences
  if (!answers.design_purchase_drivers || answers.design_purchase_drivers.length === 0) {
    return {
      step: 6,
      field: "design_purchase_drivers",
      message: "Please select what makes a design worth purchasing to you.",
    };
  }

  // Step 12: TYTGEAR Concept
  if (!answers.tytgear_interest) {
    return {
      step: 12,
      field: "tytgear_interest",
      message: "Please indicate your level of interest in TYTGEAR.",
    };
  }

  // Step 13: Marketing & Launch
  if (!answers.discovery_channels || answers.discovery_channels.length === 0) {
    return {
      step: 13,
      field: "discovery_channels",
      message: "Please select where you are most likely to discover TYTGEAR.",
    };
  }
  if (!answers.content_preferences || answers.content_preferences.length === 0) {
    return {
      step: 13,
      field: "content_preferences",
      message: "Please select what content types would make you follow TYTGEAR.",
    };
  }
  if (!answers.launch_offer) {
    return {
      step: 13,
      field: "launch_offer",
      message: "Please select your preferred launch offer.",
    };
  }
  if (answers.purchase_intent === undefined || answers.purchase_intent === null) {
    return {
      step: 13,
      field: "purchase_intent",
      message: "Please rate your likelihood of purchasing on the 0-10 scale.",
    };
  }

  // Step 14: Creator details if opted in
  if (answers.is_creator) {
    if (!answers.creator_platform) {
      return {
        step: 14,
        field: "creator_platform",
        message: "Please select your primary content platform.",
      };
    }
    if (!answers.creator_handle || answers.creator_handle.trim().length === 0) {
      return {
        step: 14,
        field: "creator_handle",
        message: "Please share your channel handle, profile URL, or society name.",
      };
    }
    if (!answers.creator_audience) {
      return {
        step: 14,
        field: "creator_audience",
        message: "Please select your estimated follower or club size.",
      };
    }
  }

  return null;
}
