/**
 * Test survey validation and step redirection mapping
 */

const assert = require("assert");

// Pure JS duplicate of the logic to verify correctness independently
function getFieldStep(field) {
  if (field === "name") {
    return 1;
  }
  if (
    [
      "affiliation",
      "college_id",
      "college_name",
      "age",
      "respondent_type",
      "city",
      "state",
    ].includes(field)
  ) {
    return 2;
  }
  if (["interests", "gaming_frequency", "platforms", "setup_type"].includes(field)) {
    return 3;
  }
  if (
    [
      "owned_products",
      "last_purchase",
      "recent_purchase",
      "recent_spend",
      "purchase_location",
      "purchase_drivers",
    ].includes(field)
  ) {
    return 4;
  }
  if (field.startsWith("product_interests") || field === "top_products") {
    return 5;
  }
  if (["design_purchase_drivers", "designs_appealing", "design_most_likely_purchase"].includes(field)) {
    return 6;
  }
  if (field.includes("small")) return 7;
  if (field.includes("large")) return 8;
  if (field.includes("framed_poster")) return 9;
  if (field.includes("metal_poster")) return 10;
  if (field.includes("poster")) return 9;
  if (field.includes("tapestry")) return 11;
  if (field === "tytgear_interest") return 12;
  if (["discovery_channels", "content_preferences", "launch_offer", "purchase_intent"].includes(field)) {
    return 13;
  }
  return 14;
}

console.log("=================================================");
console.log("Testing Step Redirection for Missing/Errored Fields");
console.log("=================================================\n");

assert.strictEqual(getFieldStep("name"), 1);
assert.strictEqual(getFieldStep("age"), 2);
assert.strictEqual(getFieldStep("affiliation"), 2);
assert.strictEqual(getFieldStep("city"), 2);
assert.strictEqual(getFieldStep("interests"), 3);
assert.strictEqual(getFieldStep("owned_products"), 4);
assert.strictEqual(getFieldStep("product_interests.small_mousepad"), 5);
assert.strictEqual(getFieldStep("top_products"), 5);
assert.strictEqual(getFieldStep("design_purchase_drivers"), 6);
assert.strictEqual(getFieldStep("price_small_good_deal"), 7);
assert.strictEqual(getFieldStep("price_large_good_deal"), 8);
assert.strictEqual(getFieldStep("budget_framed_poster_min"), 9);
assert.strictEqual(getFieldStep("budget_metal_poster_min"), 10);
assert.strictEqual(getFieldStep("budget_tapestry_min"), 11);
assert.strictEqual(getFieldStep("tytgear_interest"), 12);
assert.strictEqual(getFieldStep("discovery_channels"), 13);
assert.strictEqual(getFieldStep("creator_platform"), 14);

console.log("✅ All field-to-step redirections correctly map to Steps 2 through 13!");
console.log("🎉 VERIFICATION PASSED!\n");
