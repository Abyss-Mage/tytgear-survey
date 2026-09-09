const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load .env.local
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
        process.env[key] = val;
      }
    }
  }
}

async function testGoogleSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  console.log("Service Account:", email);
  console.log("Sheet ID:", sheetId);

  if (!email || !privateKey || !sheetId) {
    throw new Error("Missing Google credentials");
  }

  privateKey = privateKey.replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // 1. Append a test response row (45 columns)
  const testResponseId = `TYT-2026-${Date.now().toString(36).toUpperCase()}`;
  const testResponseRow = [
    testResponseId,
    new Date().toISOString(),
    new Date(Date.now() - 120000).toISOString(),
    120,
    "Indian Institute of Technology Delhi (IIT Delhi)",
    "21–23",
    "Undergraduate student",
    "New Delhi",
    "Delhi",
    "Gaming | PC Building",
    "Daily",
    "Gaming PC / Laptop",
    "Gaming setup",
    "Mousepad | Gaming mouse | Gaming keyboard",
    "Within the last month",
    "Gaming Mousepad",
    "₹1,000 – ₹1,999",
    "Amazon / Flipkart",
    "Build Quality | Aesthetic & Design",
    "High",
    "High",
    "Medium",
    "Medium",
    "High",
    "Low",
    "Large Desk Mat / Mousepad | Gaming Desk Accessories",
    "Anime / Manga Artwork | Cyberpunk / Sci-Fi / Tech",
    "₹299 – ₹499",
    "₹699 – ₹1,199",
    "₹249 – ₹449",
    "₹499 – ₹899",
    "Extremely interested — would love to try them",
    "Instagram / Reels | YouTube / Shorts",
    "Behind-the-scenes / desk setup content",
    "Flat launch discount (e.g. 20% off)",
    9,
    "Yes",
    "tester@tytgear.com",
    "TRUE",
    "FALSE",
    "",
    "",
    "",
    "",
    "FALSE"
  ];

  console.log("Appending test row to Responses tab...");
  const appendRes = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Responses!A:AS",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [testResponseRow],
    },
  });
  console.log("Responses append status:", appendRes.status, appendRes.data.updates.updatedRange);

  // 2. Append a test lead row
  const testLeadRow = [
    testResponseId,
    new Date().toISOString(),
    "Indian Institute of Technology Delhi (IIT Delhi)",
    "tester@tytgear.com",
    "TRUE",
    "FALSE",
    "",
    ""
  ];

  console.log("Appending test row to Leads tab...");
  const leadRes = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Leads!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [testLeadRow],
    },
  });
  console.log("Leads append status:", leadRes.status, leadRes.data.updates.updatedRange);

  console.log("SUCCESS! Both Responses and Leads successfully wrote to live Google Sheet!");
}

testGoogleSheets().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
