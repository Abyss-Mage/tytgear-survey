import { SurveyAnswers } from "@/types/survey";

export const SURVEY_VERSION = "2.0";
export const TOTAL_STEPS = 14;
export const GUARANTEED_DISCOUNT_CODE = "TYTLAUNCH20";

export const SURVEY_STEPS = [
  { id: 1, title: "Welcome & Rewards", shortTitle: "Welcome" },
  { id: 2, title: "Section 1 — About You", shortTitle: "About You" },
  { id: 3, title: "Section 2 — Interests & Gaming", shortTitle: "Interests" },
  { id: 4, title: "Section 3 — What You Own & Buy", shortTitle: "Purchases" },
  { id: 5, title: "Section 4 — Product Interest", shortTitle: "Products" },
  { id: 6, title: "Section 5 — Design Preferences", shortTitle: "Designs" },
  { id: 7, title: "Section 6 — Budget: Small Mousepad", shortTitle: "Small Pad" },
  { id: 8, title: "Section 6 — Budget: Large Mousepad", shortTitle: "Large Pad" },
  { id: 9, title: "Section 6 — Budget: Posters", shortTitle: "Posters" },
  { id: 10, title: "Section 6 — Budget: Wall Tapestries", shortTitle: "Tapestries" },
  { id: 11, title: "Section 7 — TYTGEAR", shortTitle: "TYTGEAR" },
  { id: 12, title: "Section 8 — Marketing & Launch", shortTitle: "Marketing" },
  { id: 13, title: "Creator Partnership", shortTitle: "Collab" },
  { id: 14, title: "Completion & Rewards", shortTitle: "Finish" },
];

export const INDIAN_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const INITIAL_SURVEY_ANSWERS: SurveyAnswers = {
  // Section 1
  age: "",
  respondent_type: "",
  city: "",
  state: "",
  affiliation: "",

  // Section 2
  interests: [],
  gaming_frequency: "",
  platforms: [],
  setup_type: "",

  // Section 3
  owned_products: [],
  last_purchase: "",
  recent_purchase: "",
  recent_spend: "",
  purchase_location: [],
  purchase_drivers: [],

  // Section 4 (6 products)
  product_interests: {
    small_mousepad: "Neutral",
    large_mousepad: "Neutral",
    desk_accessories: "Neutral",
    tapestry: "Neutral",
    posters: "Neutral",
    mobile_covers: "Neutral",
  },
  top_products: [],

  // Section 5
  design_purchase_drivers: [],
  designs_appealing: [],
  design_most_likely_purchase: "",

  // Section 6 - Product Budget Ranges
  budget_small_mousepad_min: 249,
  budget_small_mousepad_max: 499,

  budget_large_mousepad_min: 699,
  budget_large_mousepad_max: 1299,

  budget_poster_min: 199,
  budget_poster_max: 449,

  budget_tapestry_min: 499,
  budget_tapestry_max: 999,

  // Legacy price values
  price_small_too_cheap: 199,
  price_small_good_deal: 349,
  price_small_expensive: 599,
  price_small_too_expensive: 899,

  price_large_too_cheap: 499,
  price_large_good_deal: 899,
  price_large_expensive: 1499,
  price_large_too_expensive: 2199,

  // Section 7
  tytgear_interest: "",

  // Section 8
  discovery_channels: [],
  content_preferences: [],
  launch_offer: "",
  purchase_intent: 5,

  // Section 9
  want_updates: "",
  email: "",
  contact_consent: true,

  // Section 10 - Creator Application
  is_creator: false,
  creator_platform: "",
  creator_handle: "",
  creator_audience: "",
  creator_collab_type: [],
};
