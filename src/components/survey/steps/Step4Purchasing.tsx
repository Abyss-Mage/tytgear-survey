"use client";

import React, { useState } from "react";
import { SingleChoice } from "../SingleChoice";
import { MultiChoice } from "../MultiChoice";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

const OWNED_PRODUCTS_OPTIONS = [
  "Mousepad",
  "Gaming mouse",
  "Gaming keyboard",
  "Gaming headset",
  "Controller",
  "Desk accessories",
  "Wall art / posters",
  "None of these",
];

const LAST_PURCHASE_OPTIONS = [
  "Within the last month",
  "1–3 months ago",
  "4–6 months ago",
  "7–12 months ago",
  "More than a year ago",
  "Never",
];

const RECENT_PURCHASE_OPTIONS = [
  "Mousepad",
  "Mouse",
  "Keyboard",
  "Headset",
  "Controller",
  "Wall decoration / posters",
  "Mobile cover / accessory",
  "Desk accessory",
  "Other",
];

const RECENT_SPEND_OPTIONS = [
  "Under ₹300",
  "₹300–₹499",
  "₹500–₹999",
  "₹1,000–₹1,999",
  "₹2,000–₹4,999",
  "₹5,000+",
  "Not applicable",
];

const PURCHASE_LOCATION_OPTIONS = [
  "Amazon",
  "Flipkart",
  "Brand website",
  "Local / offline store",
  "Social media (Instagram / Facebook)",
  "Other",
];

const PURCHASE_DRIVERS_OPTIONS = [
  "Price",
  "Design / aesthetics",
  "Build quality",
  "Brand reputation",
  "Reviews / ratings",
  "Friend recommendation",
  "Influencer / creator endorsement",
  "Discount / offer",
  "Utility / need",
];

export const Step4Purchasing: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!answers.owned_products || answers.owned_products.length === 0) {
      errs.owned_products = "Please select products you currently own (or 'None of these').";
    }
    if (!answers.last_purchase) {
      errs.last_purchase = "Please select when you last made a purchase.";
    }
    if (!answers.recent_purchase) {
      errs.recent_purchase = "Please select what you purchased most recently.";
    }
    if (!answers.recent_spend) {
      errs.recent_spend = "Please select your approximate spend.";
    }
    if (!answers.purchase_location || answers.purchase_location.length === 0) {
      errs.purchase_location = "Please select where you usually purchase gear.";
    }
    if (!answers.purchase_drivers || answers.purchase_drivers.length === 0) {
      errs.purchase_drivers = "Please select what influenced your purchase.";
    } else if (answers.purchase_drivers.length > 3) {
      errs.purchase_drivers = "Please select at most 3 factors.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 3 • What You Own &amp; Buy
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Your Existing Gear &amp; Purchase Habits
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          We want to capture actual past purchases rather than hypothetical intentions.
        </p>
      </div>

      {/* Q10: Owned products */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          10. Which of the following do you currently own? <span className="text-red-500">*</span>
        </label>
        <MultiChoice
          name="owned_products"
          options={OWNED_PRODUCTS_OPTIONS}
          values={answers.owned_products}
          onChange={(vals) => {
            updateAnswers({ owned_products: vals });
            if (errors.owned_products) setErrors((prev) => ({ ...prev, owned_products: "" }));
          }}
          exclusiveOptions={["None of these"]}
          columns={2}
          instruction="Select all that apply."
        />
        {errors.owned_products && (
          <p className="text-xs font-medium text-red-600">{errors.owned_products}</p>
        )}
      </div>

      {/* Q11: Last purchase */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          11. When did you last purchase any gaming or desk setup gear? <span className="text-red-500">*</span>
        </label>
        <SingleChoice
          name="last_purchase"
          options={LAST_PURCHASE_OPTIONS}
          value={answers.last_purchase}
          onChange={(val) => {
            updateAnswers({ last_purchase: val });
            if (errors.last_purchase) setErrors((prev) => ({ ...prev, last_purchase: "" }));
          }}
          columns={2}
        />
        {errors.last_purchase && (
          <p className="text-xs font-medium text-red-600">{errors.last_purchase}</p>
        )}
      </div>

      {/* Q12: Recent purchase */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          12. What was the most recent product you purchased? <span className="text-red-500">*</span>
        </label>
        <SingleChoice
          name="recent_purchase"
          options={RECENT_PURCHASE_OPTIONS}
          value={answers.recent_purchase}
          onChange={(val) => {
            updateAnswers({ recent_purchase: val });
            if (errors.recent_purchase) setErrors((prev) => ({ ...prev, recent_purchase: "" }));
          }}
          columns={2}
        />
        {errors.recent_purchase && (
          <p className="text-xs font-medium text-red-600">{errors.recent_purchase}</p>
        )}
      </div>

      {/* Q13: Spend */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          13. Approximately how much did you spend on your most recent purchase? <span className="text-red-500">*</span>
        </label>
        <SingleChoice
          name="recent_spend"
          options={RECENT_SPEND_OPTIONS}
          value={answers.recent_spend}
          onChange={(val) => {
            updateAnswers({ recent_spend: val });
            if (errors.recent_spend) setErrors((prev) => ({ ...prev, recent_spend: "" }));
          }}
          columns={2}
        />
        {errors.recent_spend && (
          <p className="text-xs font-medium text-red-600">{errors.recent_spend}</p>
        )}
      </div>

      {/* Q14: Purchase location */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          14. Where did you buy it from? <span className="text-red-500">*</span>
        </label>
        <MultiChoice
          name="purchase_location"
          options={PURCHASE_LOCATION_OPTIONS}
          values={answers.purchase_location}
          onChange={(vals) => {
            updateAnswers({ purchase_location: vals });
            if (errors.purchase_location) setErrors((prev) => ({ ...prev, purchase_location: "" }));
          }}
          columns={2}
          instruction="Select all that apply."
        />
        {errors.purchase_location && (
          <p className="text-xs font-medium text-red-600">{errors.purchase_location}</p>
        )}
      </div>

      {/* Q15: Purchase drivers */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <label className="block text-sm font-bold text-brand-dark">
            15. What influenced your purchase the most? <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-semibold text-brand">Select up to 3</span>
        </div>
        <MultiChoice
          name="purchase_drivers"
          options={PURCHASE_DRIVERS_OPTIONS}
          values={answers.purchase_drivers}
          onChange={(vals) => {
            updateAnswers({ purchase_drivers: vals });
            if (errors.purchase_drivers) setErrors((prev) => ({ ...prev, purchase_drivers: "" }));
          }}
          maxSelections={3}
          columns={2}
        />
        {errors.purchase_drivers && (
          <p className="text-xs font-medium text-red-600">{errors.purchase_drivers}</p>
        )}
      </div>

      <NavigationButtons
        onValidate={validate}
        validationError={Object.values(errors).find(Boolean)}
      />
    </div>
  );
};
