"use client";

import React from "react";
import { ProductSpecCard } from "../ProductSpecCard";
import { BudgetRangeSlider } from "../BudgetRangeSlider";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

export const Step7PricingSmall: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();

  const minVal = answers.budget_small_mousepad_min ?? 249;
  const maxVal = answers.budget_small_mousepad_max ?? 499;

  const presets = [
    { label: "Value", min: 199, max: 349 },
    { label: "Sweet Spot", min: 299, max: 499 },
    { label: "Premium", min: 449, max: 699 },
    { label: "High-End", min: 649, max: 899 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 6 • Product Pricing (1 of 5)
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Small Precision Mousepad
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Review the detailed product specifications and mockup below, then set your comfortable budget range.
        </p>
      </div>

      {/* Product Spec Card */}
      <ProductSpecCard
        title="TYTGEAR Compact Precision Mousepad"
        category="Small Gaming Mousepad"
        imageSrc="/images/mockups/smallmousepad.webp"
        surface="High-density micro-weave cloth"
        base="Anti-slip natural textured rubber"
        edge="Precision anti-fray stitched border"
        features={[
          "Compact footprint optimized for tight dorm desks & portable laptops",
          "Balanced micro-texture providing smooth glide with reliable stopping power",
          "Flush edge stitching that prevents wrist irritation during extended use",
          "Fade-resistant high-definition art print that maintains vibrant colors",
        ]}
      />

      {/* Single Question & Slider for Budget Range */}
      <div className="space-y-3 pt-2">
        <BudgetRangeSlider
          label="What budget range would you be willing to purchase this Small Mousepad within?"
          description="Drag the handles or select a preset to set the minimum and maximum price you would consider reasonable to pay."
          minValue={minVal}
          maxValue={maxVal}
          min={99}
          max={999}
          step={25}
          presets={presets}
          onChange={(minPrice, maxPrice) => {
            updateAnswers({
              budget_small_mousepad_min: minPrice,
              budget_small_mousepad_max: maxPrice,
              price_small_good_deal: minPrice,
              price_small_expensive: maxPrice,
            });
          }}
        />
      </div>

      <NavigationButtons />
    </div>
  );
};
