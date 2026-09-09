"use client";

import React, { useState } from "react";
import { LikertCardList } from "../LikertCardList";
import { MultiChoice } from "../MultiChoice";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";
import { PRODUCTS } from "@/config/products";

export const Step5Demand: React.FC = () => {
  const { answers, setLikertAnswer, updateAnswers } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!answers.top_products || answers.top_products.length === 0) {
      errs.top_products = "Please select at least 1 product you would prioritize.";
    } else if (answers.top_products.length > 3) {
      errs.top_products = "Please choose no more than 3 products.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const topProductOptions = PRODUCTS.map((p) => p.name);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 4 • Product Interest
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Product Interest &amp; Priority
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Help us identify which gear items have the highest genuine demand for launch.
        </p>
      </div>

      {/* Q16: Interest Likert for 6 products */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-bold text-brand-dark">
            16. How interested would you be in purchasing each product within the next 6–12 months? <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-canvas-muted mt-0.5">
            Rate each product individually based on your genuine interest.
          </p>
        </div>

        <LikertCardList
          products={PRODUCTS}
          ratings={answers.product_interests}
          onChange={(id, val) => setLikertAnswer(id, val)}
        />
      </div>

      {/* Q17: Top 3 products */}
      <div className="space-y-3 pt-6 border-t border-canvas-border">
        <div className="flex items-baseline justify-between">
          <label className="block text-sm font-bold text-brand-dark">
            17. If you could choose only THREE products, which would you be most likely to purchase? <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-semibold text-brand">Select up to 3</span>
        </div>
        <p className="text-xs text-canvas-muted">
          Pick the 3 items you would genuinely prioritize over others.
        </p>

        <MultiChoice
          name="top_products"
          options={topProductOptions}
          values={answers.top_products}
          onChange={(vals) => {
            updateAnswers({ top_products: vals });
            if (errors.top_products) setErrors((prev) => ({ ...prev, top_products: "" }));
          }}
          maxSelections={3}
          columns={2}
        />
        {errors.top_products && (
          <p className="text-xs font-medium text-red-600">{errors.top_products}</p>
        )}
      </div>

      <NavigationButtons
        onValidate={validate}
        validationError={Object.values(errors).find(Boolean)}
      />
    </div>
  );
};
