/**
 * Setup Script: Google Sheets Initializer for TYTGEAR Pre-Launch Survey
 * 
 * Usage:
 *   node scripts/setup-sheet-headers.js
 * 
 * Requirements:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID
 *   set in .env.local or environment.
 */

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load credentials from tytgear-survey-fbe67a6314b6.json or other json if present
const jsonFiles = fs.readdirSync(process.cwd()).filter(f => f.startsWith("tytgear-survey") && f.endsWith(".json"));
if (jsonFiles.length > 0) {
  try {
    const credPath = path.join(process.cwd(), jsonFiles[0]);
    const creds = JSON.parse(fs.readFileSync(credPath, "utf-8"));
    if (creds.client_email) process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = creds.client_email;
    if (creds.private_key) process.env.GOOGLE_PRIVATE_KEY = creds.private_key;
    console.log(`Loaded service account credentials from ${jsonFiles[0]}`);
  } catch (e) {
    console.warn("Could not read credentials from JSON:", e.message);
  }
}

// Load .env.local if present
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

if (!process.env.GOOGLE_SHEET_ID) {
  process.env.GOOGLE_SHEET_ID = "108RXZlR75IIwP2rkKvJuKsLlnHdxKeuLuN48-XLiHTg";
}

const RESPONSES_HEADERS = [
  "response_id",
  "survey_version",
  "timestamp_started",
  "timestamp_completed",
  "completion_time_seconds",
  "affiliation",
  "age",
  "respondent_type",
  "city",
  "state",
  "interests",
  "gaming_frequency",
  "platforms",
  "setup_type",
  "owned_products",
  "last_purchase",
  "recent_purchase",
  "recent_spend",
  "purchase_location",
  "purchase_drivers",
  "product_interest_small_mousepad",
  "product_interest_large_mousepad",
  "product_interest_desk_accessories",
  "product_interest_tapestry",
  "product_interest_posters",
  "product_interest_mobile_covers",
  "top_products",
  "design_purchase_drivers",
  "designs_appealing",
  "design_most_likely_purchase",
  "price_small_too_cheap",
  "price_small_good_deal",
  "price_small_expensive",
  "price_small_too_expensive",
  "price_large_too_cheap",
  "price_large_good_deal",
  "price_large_expensive",
  "price_large_too_expensive",
  "tytgear_interest",
  "discovery_channels",
  "content_preferences",
  "launch_offer",
  "purchase_intent",
  "want_updates",
  "email",
  "contact_consent",
  "is_creator",
  "creator_platform",
  "creator_handle",
  "creator_audience",
  "creator_collab_type",
  "suspicious_response",
];

const LEADS_HEADERS = [
  "response_id",
  "timestamp",
  "affiliation",
  "email",
  "consent",
  "is_creator",
  "creator_platform",
  "creator_handle",
];

const COLLEGES_HEADERS = [
  "college_id", "college_name", "city", "state", "active"
];

const DESIGNS_HEADERS = [
  "design_id", "design_name", "category", "image_url", "active", "display_order"
];

const PRODUCTS_HEADERS = [
  "product_id", "product_name", "category", "image_url", "active", "display_order"
];

const METADATA_HEADERS = [
  "survey_version", "deployment_date", "configuration_values"
];

async function initializeSheet() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !privateKey || !sheetId) {
    console.error("Missing Google service account credentials in environment or .env.local");
    process.exit(1);
  }

  privateKey = privateKey.replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  console.log("Fetching spreadsheet metadata...");
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const existingSheetTitles = spreadsheet.data.sheets.map((s) => s.properties.title);

  const targetTabs = [
    { title: "Responses", headers: RESPONSES_HEADERS },
    { title: "Leads", headers: LEADS_HEADERS },
    { title: "Colleges", headers: COLLEGES_HEADERS },
    { title: "Designs", headers: DESIGNS_HEADERS },
    { title: "Products", headers: PRODUCTS_HEADERS },
    { title: "Survey Metadata", headers: METADATA_HEADERS },
  ];

  // 1. Create missing tabs
  for (const tab of targetTabs) {
    if (!existingSheetTitles.includes(tab.title)) {
      console.log(`Creating tab: ${tab.title}...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: tab.title },
              },
            },
          ],
        },
      });
    }
  }

  // 2. Set headers for each tab
  for (const tab of targetTabs) {
    console.log(`Setting headers for ${tab.title}...`);
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${tab.title}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [tab.headers],
      },
    });
  }

  console.log("✅ Google Spreadsheet initialized successfully with all 6 tabs!");
}

initializeSheet().catch((err) => {
  console.error("Initialization failed:", err.message);
  process.exit(1);
});
