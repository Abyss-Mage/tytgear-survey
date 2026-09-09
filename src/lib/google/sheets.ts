import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { SurveySubmissionInput } from "@/lib/validation/surveySchema";

export const RESPONSES_HEADERS = [
  "Response ID",
  "Submission Date & Time",
  "Survey Start Time",
  "Completion Time (Seconds)",
  "College / University / Affiliation",
  "Q1. Age Group",
  "Q2. Which Best Describes You",
  "Q3. City",
  "Q4. State / UT",
  "Q6. Interests",
  "Q7. Gaming Frequency",
  "Q8. Gaming Platforms",
  "Q9. Desk / Setup Type",
  "Q10. Products Currently Owned",
  "Q11. Last Purchase Timing",
  "Q12. Most Recent Product Purchased",
  "Q13. Recent Spend Amount (₹)",
  "Q14. Where Usually Purchased",
  "Q15. Factors Influencing Purchase",
  "Q16. Interest: Small Mousepad",
  "Q16. Interest: Large Mousepad / Desk Mat",
  "Q16. Interest: Gaming Desk Accessories",
  "Q16. Interest: Anime / Gaming Tapestry",
  "Q16. Interest: Posters & Prints",
  "Q16. Interest: Mobile Covers & Accessories",
  "Q17. Top Priority Products",
  "Q18. What Makes Design Worth Purchasing",
  "Q19. Small Mousepad Budget Range (₹)",
  "Q20. Large Mousepad Budget Range (₹)",
  "Q21. Poster Budget Range (₹)",
  "Q22. Tapestry Budget Range (₹)",
  "Q23. Interest in TYTGEAR Products",
  "Q24. Where You Discover New Brands",
  "Q25. Preferred Content Types",
  "Q26. Preferred Launch Offer",
  "Q27. Purchase Likelihood (0–10)",
  "Wants Launch Updates & Early Access",
  "Participant Email",
  "Contact Consent Given",
  "Is Content Creator / Streamer",
  "Creator Primary Platform",
  "Creator Handle / Channel Link",
  "Creator Audience Size",
  "Preferred Collaboration Types",
  "Suspicious / Speedrun Flag",
];

export const LEADS_HEADERS = [
  "Response ID",
  "Registered Date & Time",
  "College / University / Affiliation",
  "Email Address",
  "Consent Confirmed",
  "Is Content Creator?",
  "Creator Platform",
  "Creator Handle / Link",
];

export const COUPONS_HEADERS = [
  "coupon_code",
  "discount_type",
  "coupon_amount",
  "customer_email",
  "usage_limit",
  "usage_limit_per_user",
  "individual_use",
  "description",
  "date_created",
];

/**
 * Clean multi-select array into a pipe-delimited string
 */
function formatMulti(values?: string[]): string {
  if (!values || !Array.isArray(values) || values.length === 0) return "";
  return values.join(" | ");
}

/**
 * Format budget min/max into readable currency range
 */
function formatBudgetRange(min?: number, max?: number): string {
  if (min != null && max != null) return `₹${min} – ₹${max}`;
  if (min != null) return `Min ₹${min}`;
  if (max != null) return `Max ₹${max}`;
  return "";
}

/**
 * Build a row array for Google Sheets Responses tab
 */
export function buildResponseRow(
  data: SurveySubmissionInput,
  metadata: {
    completed_at: string;
    completion_seconds: number;
    suspicious: boolean;
  }
): (string | number | boolean)[] {
  const affiliation = data.affiliation || data.college_name || "";
  const pi = data.product_interests || {};

  return [
    data.response_id,
    metadata.completed_at,
    data.started_at,
    metadata.completion_seconds,
    affiliation,
    data.age,
    data.respondent_type,
    data.city,
    data.state,
    formatMulti(data.interests),
    data.gaming_frequency,
    formatMulti(data.platforms),
    data.setup_type,
    formatMulti(data.owned_products),
    data.last_purchase,
    data.recent_purchase,
    data.recent_spend,
    formatMulti(data.purchase_location),
    formatMulti(data.purchase_drivers),
    pi["small_mousepad"] || "",
    pi["large_mousepad"] || "",
    pi["desk_accessories"] || "",
    pi["tapestry"] || "",
    pi["posters"] || "",
    pi["mobile_covers"] || "",
    formatMulti(data.top_products),
    formatMulti(data.design_purchase_drivers),
    formatBudgetRange(data.budget_small_mousepad_min, data.budget_small_mousepad_max),
    formatBudgetRange(data.budget_large_mousepad_min, data.budget_large_mousepad_max),
    formatBudgetRange(data.budget_poster_min, data.budget_poster_max),
    formatBudgetRange(data.budget_tapestry_min, data.budget_tapestry_max),
    data.tytgear_interest,
    formatMulti(data.discovery_channels),
    formatMulti(data.content_preferences),
    data.launch_offer,
    data.purchase_intent ?? "",
    data.want_updates || "No",
    data.email || "",
    data.contact_consent ? "TRUE" : "FALSE",
    data.is_creator ? "TRUE" : "FALSE",
    data.creator_platform || "",
    data.creator_handle || "",
    data.creator_audience || "",
    formatMulti(data.creator_collab_type),
    metadata.suspicious ? "TRUE" : "FALSE",
  ];
}

/**
 * Build a row array for Google Sheets Leads tab
 */
export function buildLeadRow(
  data: SurveySubmissionInput,
  timestamp: string
): (string | boolean)[] {
  const affiliation = data.affiliation || data.college_name || "";
  return [
    data.response_id,
    timestamp,
    affiliation,
    data.email || "",
    data.contact_consent ? "TRUE" : "FALSE",
    data.is_creator ? "TRUE" : "FALSE",
    data.creator_platform || "",
    data.creator_handle || "",
  ];
}

/**
 * Build a row array for Google Sheets WooCommerce Coupons tab (CSV import ready)
 */
export function buildCouponRow(
  responseId: string,
  email: string,
  timestamp: string
): (string | number)[] {
  return [
    responseId,
    "percent",
    20,
    email,
    1,
    1,
    "yes",
    "TYTGEAR Pre-Launch Survey 20% Off",
    timestamp,
  ];
}

/**
 * Initializes Google Sheets API authenticated client using service account credentials.
 */
export function getGoogleSheetsClient() {
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID || "108RXZlR75IIwP2rkKvJuKsLlnHdxKeuLuN48-XLiHTg";

  // If environment variables are not set, check for local service account JSON
  if (!email || !privateKey) {
    try {
      const files = fs.readdirSync(process.cwd());
      const keyFile = files.find((f) => f.startsWith("tytgear-survey") && f.endsWith(".json"));
      if (keyFile) {
        const creds = JSON.parse(fs.readFileSync(path.join(process.cwd(), keyFile), "utf-8"));
        email = creds.client_email;
        privateKey = creds.private_key;
      }
    } catch {
      // Ignore file reading errors and proceed to check
    }
  }

  if (!email || !privateKey || !sheetId) {
    return null;
  }

  privateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, sheetId };
}

/**
 * Appends a lead row directly to the Leads tab in Google Sheets
 */
export async function appendLeadRowToSheets(leadRow: (string | boolean)[]) {
  const clientInfo = getGoogleSheetsClient();
  if (!clientInfo) return false;

  const { sheets, sheetId } = clientInfo;
  return sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Leads!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [leadRow],
    },
  });
}

/**
 * Appends a coupon row directly to the WooCommerce Coupons tab in Google Sheets
 */
export async function appendCouponRowToSheets(couponRow: (string | number)[]) {
  const clientInfo = getGoogleSheetsClient();
  if (!clientInfo) return false;

  const { sheets, sheetId } = clientInfo;
  return sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "WooCommerce Coupons!A:I",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [couponRow],
    },
  });
}

/**
 * Appends a response row to Google Sheets (or fallback local JSON if credentials missing).
 */
export async function appendSurveyResponse(
  data: SurveySubmissionInput,
  metadata: {
    completed_at: string;
    completion_seconds: number;
    suspicious: boolean;
  }
): Promise<{ success: boolean; mode: "sheets" | "fallback"; error?: string }> {
  const clientInfo = getGoogleSheetsClient();

  if (!clientInfo) {
    const isLocalAllowed =
      process.env.ALLOW_LOCAL_SUBMISSION_FALLBACK === "true" ||
      process.env.NODE_ENV !== "production";

    if (isLocalAllowed) {
      try {
        const dataDir = path.join(process.cwd(), ".data");
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const filePath = path.join(dataDir, "submissions.json");
        const existing: unknown[] = fs.existsSync(filePath)
          ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
          : [];

        existing.push({
          data,
          metadata,
          received_at: new Date().toISOString(),
        });

        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

        if (data.want_updates === "Yes" && data.contact_consent && data.email) {
          const leadsPath = path.join(dataDir, "leads.json");
          const existingLeads: unknown[] = fs.existsSync(leadsPath)
            ? JSON.parse(fs.readFileSync(leadsPath, "utf-8"))
            : [];
          existingLeads.push(buildLeadRow(data, metadata.completed_at));
          fs.writeFileSync(leadsPath, JSON.stringify(existingLeads, null, 2));

          const couponsPath = path.join(dataDir, "coupons.json");
          const existingCoupons: unknown[] = fs.existsSync(couponsPath)
            ? JSON.parse(fs.readFileSync(couponsPath, "utf-8"))
            : [];
          existingCoupons.push(buildCouponRow(data.response_id, data.email, metadata.completed_at));
          fs.writeFileSync(couponsPath, JSON.stringify(existingCoupons, null, 2));
        }

        return { success: true, mode: "fallback" };
      } catch (err) {
        console.error("Local fallback saving error:", err);
        return {
          success: false,
          mode: "fallback",
          error: "Failed to persist survey response locally.",
        };
      }
    }

    return {
      success: false,
      mode: "sheets",
      error: "Google Sheets credentials are not configured on the server.",
    };
  }

  const { sheets, sheetId } = clientInfo;

  try {
    const responseRow = buildResponseRow(data, metadata);

    // 1. Append to Responses tab (A:AS covers all 45 columns)
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Responses!A:AS",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [responseRow],
      },
    });

    // 2. If user consented to updates/giveaway, append to Leads & WooCommerce Coupons tabs
    if (data.want_updates === "Yes" && data.contact_consent && data.email) {
      const leadRow = buildLeadRow(data, metadata.completed_at);
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "Leads!A:H",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [leadRow],
        },
      });

      const couponRow = buildCouponRow(data.response_id, data.email, metadata.completed_at);
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "WooCommerce Coupons!A:I",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [couponRow],
        },
      });
    }

    return { success: true, mode: "sheets" };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Google Sheets API error appending row:", err?.message || err);
    return {
      success: false,
      mode: "sheets",
      error: err?.message || "Error writing to Google Sheets.",
    };
  }
}
