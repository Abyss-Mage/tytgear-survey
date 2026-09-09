const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const credPath = path.join(process.cwd(), "tytgear-survey-fbe67a6314b6.json");
const creds = JSON.parse(fs.readFileSync(credPath, "utf-8"));
const sheetId = "108RXZlR75IIwP2rkKvJuKsLlnHdxKeuLuN48-XLiHTg";

const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const COUPONS_HEADERS = [
  "coupon_code",
  "discount_type",
  "coupon_amount",
  "customer_email",
  "usage_limit",
  "usage_limit_per_user",
  "individual_use",
  "description",
  "date_created"
];

async function addCouponsTab() {
  console.log("Checking spreadsheet tabs...");
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const existingTitles = spreadsheet.data.sheets.map(s => s.properties.title);
  console.log("Current tabs:", existingTitles);

  let couponsSheetId;
  const found = spreadsheet.data.sheets.find(s => s.properties.title === "WooCommerce Coupons");

  if (!found) {
    console.log("Creating 'WooCommerce Coupons' tab...");
    const addRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: "WooCommerce Coupons",
              },
            },
          },
        ],
      },
    });
    couponsSheetId = addRes.data.replies[0].addSheet.properties.sheetId;
    console.log("Created tab with sheetId:", couponsSheetId);
  } else {
    couponsSheetId = found.properties.sheetId;
    console.log("'WooCommerce Coupons' already exists with sheetId:", couponsSheetId);
  }

  // Set headers
  console.log("Setting headers for 'WooCommerce Coupons'...");
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: "WooCommerce Coupons!A1:I1",
    valueInputOption: "RAW",
    requestBody: {
      values: [COUPONS_HEADERS],
    },
  });

  // Freeze top row and style with purple WooCommerce branding
  console.log("Styling 'WooCommerce Coupons' header row...");
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId: couponsSheetId,
              gridProperties: { frozenRowCount: 1 },
            },
            fields: "gridProperties.frozenRowCount",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: couponsSheetId,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.47, green: 0.22, blue: 0.65 }, // WooCommerce purple #7738a6
                textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 1, green: 1, blue: 1 } },
                horizontalAlignment: "CENTER",
              },
            },
            fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
          },
        },
      ],
    },
  });

  console.log("✅ 'WooCommerce Coupons' tab successfully configured and ready for CSV export!");
}

addCouponsTab().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
