/**
 * Automated Test Suite for TYTGEAR Survey Validation & Submission
 * Run via: node scripts/test-submit.js
 */

const { SurveySubmissionSchema, PriceSensitivityRangeSchema } = require("./test-schema-helper");

console.log("=================================================");
console.log("TYTGEAR SURVEY v2.0: Automated Validation Tests");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

// Valid baseline submission payload
const validPayload = {
  response_id: "TYT-2026-A9C4E2B1",
  survey_version: "2.0",
  started_at: "2026-09-08T12:00:00.000Z",
  honeypot: "",
  age: "18–20",
  respondent_type: "Undergraduate student",
  city: "New Delhi",
  state: "Delhi",
  affiliation: "IIT Delhi",
  interests: ["Gaming", "Esports", "Room / Desk Setup"],
  gaming_frequency: "Daily",
  platforms: ["Gaming PC / Laptop", "Mobile"],
  setup_type: "Gaming setup",
  owned_products: ["Mousepad", "Gaming mouse", "Gaming headset"],
  last_purchase: "1–3 months ago",
  recent_purchase: "Mousepad / desk mat",
  recent_spend: "₹1,000–₹1,999",
  purchase_location: ["Amazon", "Brand website"],
  purchase_drivers: ["Design / aesthetics", "Build quality", "Reviews / ratings"],
  product_interests: {
    small_mousepad: "Very interested",
    large_mousepad: "Interested",
    desk_accessories: "Neutral",
    tapestry: "Not very interested",
    posters: "Interested",
    mobile_covers: "Neutral",
  },
  top_products: ["Small Mousepads", "Large Mousepads", "Posters"],
  designs_appealing: ["Design A", "Design C", "Design F"],
  design_most_likely_purchase: "Design C",
  design_purchase_drivers: ["Looks unique / Premium", "Matches my personality"],

  price_small_too_cheap: 199,
  price_small_good_deal: 349,
  price_small_expensive: 599,
  price_small_too_expensive: 899,

  price_large_too_cheap: 499,
  price_large_good_deal: 899,
  price_large_expensive: 1499,
  price_large_too_expensive: 2199,

  tytgear_interest: "Very interested",
  discovery_channels: ["Instagram / Reels", "YouTube / Shorts", "Discord Communities"],
  content_preferences: ["Setup inspiration & desk tours", "Behind-the-scenes / manufacturing process"],
  launch_offer: "Flat launch discount (e.g. 20% off)",
  purchase_intent: 9,

  want_updates: "Yes",
  email: "student@iitd.ac.in",
  contact_consent: true,

  is_creator: true,
  creator_platform: "YouTube",
  creator_handle: "@techandgaming",
  creator_audience: "5,000 – 25,000",
  creator_collab_type: ["Free review units & seed gear"],
};

// Test 1: Baseline valid payload
const t1 = SurveySubmissionSchema.safeParse(validPayload);
assert(t1.success === true, "Valid complete survey v2.0 payload passes Zod validation");

// Test 2: Valid payload without optional updates/giveaway
const anonymousPayload = {
  ...validPayload,
  response_id: "TYT-2026-X8M3K9P2",
  want_updates: "No",
  email: "",
  contact_consent: false,
};
const t2 = SurveySubmissionSchema.safeParse(anonymousPayload);
assert(t2.success === true, "Anonymous survey payload without email passes validation");

// Test 3: Price sensitivity hierarchy for Small Mousepad
const validSmallPrices = PriceSensitivityRangeSchema.safeParse({
  too_cheap: 199,
  good_deal: 349,
  expensive: 599,
  too_expensive: 899,
});
assert(validSmallPrices.success === true, "Small Mousepad pricing logical hierarchy is valid");

// Test 4: Inverted price hierarchy fails
const invertedPrices = PriceSensitivityRangeSchema.safeParse({
  too_cheap: 599,
  good_deal: 349,
  expensive: 499,
  too_expensive: 899,
});
assert(invertedPrices.success === false, "Inverted price hierarchy correctly fails validation");

// Test 5: Missing email when want_updates is Yes fails
const invalidEmailPayload = {
  ...validPayload,
  response_id: "TYT-2026-B8K2N4P9",
  want_updates: "Yes",
  email: "not-an-email",
};
const t5 = SurveySubmissionSchema.safeParse(invalidEmailPayload);
assert(t5.success === false, "Invalid email fails validation when opting in for updates");

// Test 6: Missing affiliation fails
const noAffiliation = {
  ...validPayload,
  response_id: "TYT-2026-N2L4K8P1",
  affiliation: "",
};
const t6 = SurveySubmissionSchema.safeParse(noAffiliation);
assert(t6.success === false, "Empty affiliation fails validation");

console.log(`\n=================================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`=================================================`);

if (failed > 0) process.exit(1);
