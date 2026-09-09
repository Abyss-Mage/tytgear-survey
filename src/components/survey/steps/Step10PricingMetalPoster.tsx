"use client";

import React from "react";
import { ProductSpecCard } from "../ProductSpecCard";
import { BudgetRangeSlider } from "../BudgetRangeSlider";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

export const Step10PricingMetalPoster: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();

  const minVal = answers.budget_metal_poster_min ?? 599;
  const maxVal = answers.budget_metal_poster_max ?? 1199;

  const presets = [
    { label: "Value Metal", min: 399, max: 699 },
    { label: "Sweet Spot", min: 599, max: 1099 },
    { label: "Collector Plate", min: 899, max: 1499 },
    { label: "Flagship Metal", min: 1299, max: 2199 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 6 • Product Pricing (4 of 5)
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Metal Plate Wall Art Poster
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Review the magnetic metal print specifications and mockup below, then set your comfortable budget range.
        </p>
      </div>

      {/* Product Spec Card */}
      <ProductSpecCard
        title="TYTGEAR Magnetic Metal Wall Art"
        category="Magnetic Metal Art Plate"
        imageSrc="/images/mockups/metalposter.webp"
        surface="High-gloss ultra-vibrant lacquer finish"
        base="Magnetic adhesive wall-mount system (No nails, no drilling)"
        edge="Polished rounded safety corners"
        features={[
          "Damage-free magnetic mounting system — sticks cleanly to any wall without drilling",
          "Easy magnetic swap: rotate or change art designs in seconds on the same wall mount",
          "Vibrant dye-sublimated aluminum delivering unmatched color depth and metallic shine",
          "100% waterproof, scratch-resistant, and fade-proof archival durability",
        ]}
      />

      {/* Single Question & Slider for Budget Range */}
      <div className="space-y-3 pt-2">
        <BudgetRangeSlider
          label="What budget range would you be willing to purchase this Metal Poster within?"
          description="Drag the handles or select a preset to set the minimum and maximum price you would consider reasonable to pay."
          minValue={minVal}
          maxValue={maxVal}
          min={249}
          max={2499}
          step={50}
          presets={presets}
          onChange={(minPrice, maxPrice) => {
            updateAnswers({
              budget_metal_poster_min: minPrice,
              budget_metal_poster_max: maxPrice,
            });
          }}
        />
      </div>

      <NavigationButtons />
    </div>
  );
};
