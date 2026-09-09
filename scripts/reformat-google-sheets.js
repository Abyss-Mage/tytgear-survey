const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Read credentials
const credPath = path.join(process.cwd(), "tytgear-survey-fbe67a6314b6.json");
const creds = JSON.parse(fs.readFileSync(credPath, "utf-8"));
const sheetId = "108RXZlR75IIwP2rkKvJuKsLlnHdxKeuLuN48-XLiHTg";

const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const CLEAR_RESPONSES_HEADERS = [
  "Response ID",
  "Submission Date & Time",
  "Survey Start Time",
  "Completion Time (Seconds)",
  "Participant Name",
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
  "Q21. Framed Poster Budget Range (₹)",
  "Q22. Metal Poster Budget Range (₹)",
  "Q23. Tapestry Budget Range (₹)",
  "Q24. Interest in TYTGEAR Products",
  "Q25. Where You Discover New Brands",
  "Q26. Preferred Content Types",
  "Q27. Preferred Launch Offer",
  "Q28. Purchase Likelihood (0–10)",
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

const CLEAR_LEADS_HEADERS = [
  "Response ID",
  "Registered Date & Time",
  "College / University / Affiliation",
  "Email Address",
  "Consent Confirmed",
  "Is Content Creator?",
  "Creator Platform",
  "Creator Handle / Link",
];

async function reformatSheet() {
  console.log("Fetching spreadsheet...");
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheetList = spreadsheet.data.sheets;
  console.log("Current sheets:", sheetList.map(s => s.properties.title));

  // 1. Delete extra unnecessary tabs: Colleges, Designs, Products, Survey Metadata
  const tabsToDelete = ["Colleges", "Designs", "Products", "Survey Metadata"];
  const deleteRequests = [];

  for (const tabName of tabsToDelete) {
    const found = sheetList.find(s => s.properties.title === tabName);
    if (found) {
      console.log(`Queueing deletion for unused tab: ${tabName} (sheetId: ${found.properties.sheetId})`);
      deleteRequests.push({
        deleteSheet: {
          sheetId: found.properties.sheetId,
        },
      });
    }
  }

  if (deleteRequests.length > 0) {
    console.log("Deleting unused tabs...");
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: deleteRequests },
    });
    console.log("Successfully removed unused tabs.");
  }

  // 2. Clear old data from Responses and Leads so we start clean
  console.log("Clearing old data in Responses...");
  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range: "Responses!A:ZZ",
  });

  console.log("Clearing old data in Leads...");
  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range: "Leads!A:ZZ",
  });

  // 3. Write clean, human-readable headers
  console.log("Writing clear headers to Responses...");
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: "Responses!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [CLEAR_RESPONSES_HEADERS],
    },
  });

  console.log("Writing clear headers to Leads...");
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: "Leads!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [CLEAR_LEADS_HEADERS],
    },
  });

  // 4. Format row 1 in both sheets: Bold text, frozen top row, subtle header background
  const freshSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const responsesSheetId = freshSpreadsheet.data.sheets.find(s => s.properties.title === "Responses").properties.sheetId;
  const leadsSheetId = freshSpreadsheet.data.sheets.find(s => s.properties.title === "Leads").properties.sheetId;

  const formattingRequests = [
    // Freeze row 1 on Responses
    {
      updateSheetProperties: {
        properties: {
          sheetId: responsesSheetId,
          gridProperties: { frozenRowCount: 1 },
        },
        fields: "gridProperties.frozenRowCount",
      },
    },
    // Freeze row 1 on Leads
    {
      updateSheetProperties: {
        properties: {
          sheetId: leadsSheetId,
          gridProperties: { frozenRowCount: 1 },
        },
        fields: "gridProperties.frozenRowCount",
      },
    },
    // Format Responses header row: bold, navy header, white text
    {
      repeatCell: {
        range: {
          sheetId: responsesSheetId,
          startRowIndex: 0,
          endRowIndex: 1,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.08, green: 0.12, blue: 0.20 }, // Dark navy #141f33
            textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 1, green: 1, blue: 1 } },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
    // Format Leads header row: bold, dark brand, white text
    {
      repeatCell: {
        range: {
          sheetId: leadsSheetId,
          startRowIndex: 0,
          endRowIndex: 1,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.13, green: 0.20, blue: 0.35 },
            textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 1, green: 1, blue: 1 } },
            horizontalAlignment: "CENTER",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
      },
    },
  ];

  console.log("Applying professional styling & freezing row 1...");
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: { requests: formattingRequests },
  });

  console.log("✅ Google Spreadsheet reformatted with clear headers, frozen header rows, and extra tabs removed!");
}

reformatSheet().catch(err => {
  console.error("Reformat error:", err);
  process.exit(1);
});
