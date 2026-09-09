import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { SurveySubmissionInput } from "@/lib/validation/surveySchema";

export const RESPONSES_HEADERS = [
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

export const LEADS_HEADERS = [
  "response_id",
  "timestamp",
  "affiliation",
  "email",
  "consent",
  "is_creator",
  "creator_platform",
  "creator_handle",
];

/**
 * Clean multi-select array into a pipe-delimited string
 */
function formatMulti(values?: string[]): string {
  if (!values || !Array.isArray(values) || values.length === 0) return "";
  return values.join(" | ");
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
    data.survey_version || "2.0",
    data.started_at,
    metadata.completed_at,
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
    formatMulti(data.designs_appealing),
    data.design_most_likely_purchase || "",
    data.price_small_too_cheap ?? "",
    data.price_small_good_deal ?? "",
    data.price_small_expensive ?? "",
    data.price_small_too_expensive ?? "",
    data.price_large_too_cheap ?? "",
    data.price_large_good_deal ?? "",
    data.price_large_expensive ?? "",
    data.price_large_too_expensive ?? "",
    data.tytgear_interest,
    formatMulti(data.discovery_channels),
    formatMulti(data.content_preferences),
    data.launch_offer,
    data.purchase_intent,
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
 * Initializes Google Sheets API authenticated client using service account credentials.
 */
function getGoogleSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

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

        const row = buildResponseRow(data, metadata);
        existing.push({
          response_id: data.response_id,
          submitted_at: metadata.completed_at,
          data,
          row_array: row,
        });

        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

        if (data.want_updates === "Yes" && data.contact_consent && data.email) {
          const leadsPath = path.join(dataDir, "leads.json");
          const existingLeads: unknown[] = fs.existsSync(leadsPath)
            ? JSON.parse(fs.readFileSync(leadsPath, "utf-8"))
            : [];
          existingLeads.push(buildLeadRow(data, metadata.completed_at));
          fs.writeFileSync(leadsPath, JSON.stringify(existingLeads, null, 2));
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

    // 1. Append to Responses tab
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Responses!A:AY",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [responseRow],
      },
    });

    // 2. If user consented to updates/giveaway, append to Leads tab
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
