"use client";

import React from "react";
import { ProductSpecCard } from "../ProductSpecCard";
import { BudgetRangeSlider } from "../BudgetRangeSlider";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

export const Step9PricingFramedPoster: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();

  const minVal = answers.budget_framed_poster_min ?? 349;
  const maxVal = answers.budget_framed_poster_max ?? 749;

  const presets = [
    { label: "Value", min: 249, max: 449 },
    { label: "Sweet Spot", min: 349, max: 699 },
    { label: "Gallery Frame", min: 549, max: 999 },
    { label: "Collector Frame", min: 799, max: 1499 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 6 • Product Pricing (3 of 5)
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Framed Wall Art Poster
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Review the framed gallery print specifications and mockup below, then set your comfortable budget range.
        </p>
      </div>

      {/* Product Spec Card */}
      <ProductSpecCard
        title="TYTGEAR Gallery Framed Wall Art"
        category="Framed Wall Decor"
        imageSrc="/images/mockups/framedposter.webp"
        thickness="20 mm Frame Profile Depth"
        surface="Ultra-clear shatterproof acrylic protection"
        base="Natural solid wood frame with sealed backing"
        edge="Precision mitered corners with hanging hardware"
        features={[
          "Ready-to-hang out of the box with mounted saw-tooth bracket",
          "High-definition archival art card print protected against dust and UV rays",
          "Sleek matte frame profile engineered to elevate gaming setups and room walls",
          "Original high-resolution anime, gaming, and urban aesthetic collections",
        ]}
      />

      {/* Single Question & Slider for Budget Range */}
      <div className="space-y-3 pt-2">
        <BudgetRangeSlider
          label="What budget range would you be willing to purchase this Framed Poster within?"
          description="Drag the handles or select a preset to set the minimum and maximum price you would consider reasonable to pay."
          minValue={minVal}
          maxValue={maxVal}
          min={149}
          max={1999}
          step={25}
          presets={presets}
          onChange={(minPrice, maxPrice) => {
            updateAnswers({
              budget_framed_poster_min: minPrice,
              budget_framed_poster_max: maxPrice,
              budget_poster_min: minPrice,
              budget_poster_max: maxPrice,
            });
          }}
        />
      </div>

      <NavigationButtons />
    </div>
  );
};
