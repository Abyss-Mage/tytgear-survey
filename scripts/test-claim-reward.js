/**
 * Test claiming discount coupon & entering giveaway via /api/survey/claim-reward
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

async function testClaimReward() {
  const port = process.env.PORT || 3000;
  console.log(`Testing POST http://localhost:${port}/api/survey/claim-reward ...`);

  // 1. Invalid email should fail
  const invalidRes = await postJson(`http://localhost:${port}/api/survey/claim-reward`, {
    response_id: "TYT-2026-REWARD01",
    email: "not-an-email",
    contact_consent: true,
  });
  console.log("Invalid email test status:", invalidRes.status);
  if (invalidRes.status !== 400) {
    throw new Error("Expected 400 for invalid email");
  }
  console.log("✅ Invalid email correctly rejected");

  // 2. Valid email should succeed and send coupon
  const validRes = await postJson(`http://localhost:${port}/api/survey/claim-reward`, {
    response_id: "TYT-2026-REWARD02",
    email: "student@bits-pilani.ac.in",
    contact_consent: true,
    affiliation: "BITS Pilani",
  });
  console.log("Valid claim status:", validRes.status);
  console.log("Valid claim response:", validRes.data);

  if (validRes.status !== 200 || !validRes.data.success) {
    throw new Error("Valid claim reward test failed: " + JSON.stringify(validRes.data));
  }
  console.log("✅ Valid reward claim succeeded: email recorded for dispatch!");

  console.log("\n🎉 CLAIM REWARD ENDPOINT TEST PASSED!");
}

testClaimReward().catch((err) => {
  console.error("Test Error:", err);
  process.exit(1);
});
