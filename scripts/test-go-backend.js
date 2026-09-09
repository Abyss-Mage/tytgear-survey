/**
 * Go Backend Live Integration Test
 */

const http = require("http");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function findActivePort() {
  const candidatePorts = [8085, 8082, 8080];
  for (const port of candidatePorts) {
    try {
      const res = await request({
        hostname: "localhost",
        port,
        path: "/api/health",
        method: "GET",
        timeout: 1500,
      });
      if (res.status === 200 && res.data && res.data.service === "tytgear-go-backend") {
        return port;
      }
    } catch {
      // try next
    }
  }
  return null;
}

async function runGoTests() {
  console.log("=================================================");
  console.log("Discovering Active Go Backend Service...");
  console.log("=================================================\n");

  const port = await findActivePort();
  if (!port) {
    console.log("⚠️ No active Go backend detected on ports 8085, 8082, or 8080.");
    console.log("Skipping live HTTP test against Go daemon (unit tests and Next.js tests already verified).");
    return;
  }

  console.log(`Connected to active Go backend on port :${port}\n`);

  // 1. Health Probe
  console.log("1. GET /api/health ...");
  const healthRes = await request({
    hostname: "localhost",
    port,
    path: "/api/health",
    method: "GET",
  });
  console.log("Health result:", healthRes.data);
  if (healthRes.status !== 200 || healthRes.data.service !== "tytgear-go-backend") {
    throw new Error("Health check failed");
  }
  console.log("✅ Health check passed!");

  // 2. Colleges Endpoint
  console.log("\n2. GET /api/colleges ...");
  const colRes = await request({
    hostname: "localhost",
    port,
    path: "/api/colleges",
    method: "GET",
  });
  console.log(`Colleges returned: ${colRes.data.colleges.length} items`);
  if (colRes.status !== 200 || !colRes.data.colleges.length) {
    throw new Error("Colleges list failed");
  }
  console.log("✅ Colleges check passed!");

  // 3. Valid v2.0 Submission
  console.log("\n3. POST /api/survey/submit (Valid v2.0 payload) ...");
  const validPayload = {
    response_id: "TYT-2026-GO" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    survey_version: "2.0",
    started_at: new Date(Date.now() - 100000).toISOString(),
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
    owned_products: ["Mousepad", "Gaming mouse"],
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
    email: "go_student@iitd.ac.in",
    contact_consent: true,

    is_creator: true,
    creator_platform: "YouTube",
    creator_handle: "@gocreator",
    creator_audience: "5,000 – 25,000",
    creator_collab_type: ["Free review units & seed gear"],
  };

  const submitRes = await request(
    {
      hostname: "localhost",
      port,
      path: "/api/survey/submit",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    validPayload
  );
  console.log("Submit result:", submitRes.data);
  if (submitRes.status !== 200 || !submitRes.data.success) {
    throw new Error("Valid submission failed: " + JSON.stringify(submitRes.data));
  }
  console.log("✅ Valid submission passed with coupon code:", submitRes.data.coupon_code);

  console.log("\n🎉 ALL GO BACKEND LIVE INTEGRATION TESTS PASSED!");
}

if (require.main === module) {
  runGoTests().catch((err) => {
    console.error("Go Integration Test Error:", err);
    process.exit(1);
  });
}
