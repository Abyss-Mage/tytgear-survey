"use client";

import React from "react";
import { ProductSpecCard } from "../ProductSpecCard";
import { BudgetRangeSlider } from "../BudgetRangeSlider";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

export const Step8PricingLarge: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();

  const minVal = answers.budget_large_mousepad_min ?? 699;
  const maxVal = answers.budget_large_mousepad_max ?? 1299;

  const presets = [
    { label: "Value", min: 499, max: 799 },
    { label: "Sweet Spot", min: 699, max: 1199 },
    { label: "Premium Mat", min: 1099, max: 1699 },
    { label: "Flagship Tier", min: 1599, max: 2299 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 6 • Product Pricing (2 of 5)
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          80×33 cm Large Hybrid Mousepad
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Review the flagship specs and desk setup mockup below, then set your comfortable budget range for the extended desk mat.
        </p>
      </div>

      {/* Product Spec Card */}
      <ProductSpecCard
        title="TYTGEAR 80×33 cm Large Hybrid Mousepad"
        category="Extended Desk Mat / Hybrid Surface"
        imageSrc="/images/mockups/largemousepad.webp"
        dimensions="800 × 330 mm (80 × 33 cm)"
        thickness="4 mm"
        surface="Hybrid micro-weave (speed + stopping control)"
        base="Dense anti-slip textured natural rubber"
        edge="360° flush anti-fray micro-stitching"
        features={[
          "Full-desk coverage accommodating mechanical keyboard, mouse & desk gear",
          "Water-repellent nano coating resisting accidental liquid and beverage spills",
          "Plush 4mm high-density core for all-day wrist support and comfort",
          "Cinematic high-contrast artwork print designed to elevate your setup",
        ]}
      />

      {/* Single Question & Slider for Budget Range */}
      <div className="space-y-3 pt-2">
        <BudgetRangeSlider
          label="What budget range would you be willing to purchase this 80×33 cm Large Hybrid Mousepad within?"
          description="Drag the handles or select a preset to set the minimum and maximum price you would consider reasonable to pay."
          minValue={minVal}
          maxValue={maxVal}
          min={299}
          max={2499}
          step={50}
          presets={presets}
          onChange={(minPrice, maxPrice) => {
            updateAnswers({
              budget_large_mousepad_min: minPrice,
              budget_large_mousepad_max: maxPrice,
              price_large_good_deal: minPrice,
              price_large_expensive: maxPrice,
            });
          }}
        />
      </div>

      <NavigationButtons />
    </div>
  );
};
