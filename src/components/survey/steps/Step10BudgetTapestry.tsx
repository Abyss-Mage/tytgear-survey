"use client";

import React from "react";
import { ProductSpecCard } from "../ProductSpecCard";
import { BudgetRangeSlider } from "../BudgetRangeSlider";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

export const Step10BudgetTapestry: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();

  const minVal = answers.budget_tapestry_min ?? 499;
  const maxVal = answers.budget_tapestry_max ?? 999;

  const presets = [
    { label: "Value", min: 399, max: 699 },
    { label: "Sweet Spot", min: 499, max: 899 },
    { label: "Large Fabric", min: 699, max: 1199 },
    { label: "Premium Backdrop", min: 999, max: 1699 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 6 • Product Pricing (5 of 5)
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Aesthetic Wall Tapestries
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Review the large wall tapestry specifications and room backdrop mockup below, then set your comfortable budget range.
        </p>
      </div>

      {/* Product Spec Card */}
      <ProductSpecCard
        title="TYTGEAR Aesthetic Wall Tapestries"
        category="Room Ambience & Setup Backdrop"
        imageSrc="/images/mockups/tapestries.webp"
        thickness="Lightweight & Durable"
        surface="Silky woven microfiber polyester"
        base="Wrinkle-resistant hemmed edges"
        edge="Precision laser-cut & double-stitched"
        features={[
          "Large format wall coverage transforming blank dorm, bedroom, or streaming backdrops",
          "Vibrant dye-sublimation print that won't peel, crack, or fade after machine washing",
          "Ultra-lightweight fabric easily hung using thumb tacks, command hooks, or clips",
          "Can double as a bed throw, window curtain, or video call / stream background",
        ]}
      />

      {/* Single Question & Slider for Budget Range */}
      <div className="space-y-3 pt-2">
        <BudgetRangeSlider
          label="What budget range would you be willing to purchase this Wall Tapestry within?"
          description="Drag the handles or select a preset to set the minimum and maximum price you would consider reasonable to pay."
          minValue={minVal}
          maxValue={maxVal}
          min={199}
          max={1999}
          step={50}
          presets={presets}
          onChange={(minPrice, maxPrice) => {
            updateAnswers({
              budget_tapestry_min: minPrice,
              budget_tapestry_max: maxPrice,
            });
          }}
        />
      </div>

      <NavigationButtons />
    </div>
  );
};
