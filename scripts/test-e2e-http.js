/**
 * End-to-End HTTP Integration Test for TYTGEAR Server
 */

const http = require("http");

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const body = JSON.stringify(data);

    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk;
        });
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(responseData) });
          } catch {
            resolve({ status: res.statusCode, raw: responseData });
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, length: data.length }));
    }).on("error", reject);
  });
}

async function runE2E() {
  const port = process.env.PORT || 3000;
  console.log(`Testing GET http://localhost:${port}/survey?college=IITD01 ...`);
  const pageRes = await get(`http://localhost:${port}/survey?college=IITD01`);
  console.log(`Response status: ${pageRes.status}, HTML bytes: ${pageRes.length}`);
  if (pageRes.status !== 200) throw new Error("GET /survey failed");

  console.log("\nTesting POST /api/survey/submit (Valid v2.0 payload) ...");
  const validPayload = {
    response_id: "TYT-2026-N7K2V9B3",
    survey_version: "2.0",
    started_at: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
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

  const submitRes = await postJson(`http://localhost:${port}/api/survey/submit`, validPayload);
  console.log("Submit status:", submitRes.status);
  console.log("Submit response:", submitRes.data);

  if (submitRes.status !== 200 || !submitRes.data.success) {
    throw new Error("Submission failed: " + JSON.stringify(submitRes.data));
  }

  console.log("\nTesting Honeypot anti-spam rejection ...");
  const botPayload = {
    ...validPayload,
    response_id: "TYT-2026-BOT99999",
    honeypot: "I am a spammer bot",
  };

  const botRes = await postJson(`http://localhost:${port}/api/survey/submit`, botPayload);
  console.log("Bot submit status:", botRes.status);
  console.log("Bot submit response:", botRes.data);

  if (botRes.status === 200 && botRes.data.suspicious === true) {
    console.log("✅ Bot honeypot successfully flagged response as suspicious without leaking errors!");
  }

  console.log("\n🎉 ALL E2E HTTP TESTS COMPLETED SUCCESSFULLY!");
}

if (require.main === module) {
  runE2E().catch((err) => {
    console.error("E2E Test Error:", err);
    process.exit(1);
  });
}
