"use client";

import React from "react";
import { ProductSpecCard } from "../ProductSpecCard";
import { BudgetRangeSlider } from "../BudgetRangeSlider";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

export const Step9BudgetPoster: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();

  const minVal = answers.budget_poster_min ?? 199;
  const maxVal = answers.budget_poster_max ?? 449;

  const presets = [
    { label: "Budget Print", min: 149, max: 249 },
    { label: "Standard Art Print", min: 199, max: 399 },
    { label: "Heavy Matte Card", min: 299, max: 549 },
    { label: "Collector Edition", min: 449, max: 749 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 6 • Product Pricing (3 of 4)
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Aesthetic Wall Art Posters
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Review the print specifications below, then set your comfortable budget range.
        </p>
      </div>

      {/* Product Spec Card */}
      <ProductSpecCard
        title="TYTGEAR Aesthetic Wall Art Posters"
        category="Room & Desk Decor"
        imageSrc="/images/products/wall-art.svg"
        dimensions="A3 / 12 × 18 inches"
        thickness="300 GSM Heavy Card"
        surface="Matte velvet anti-glare finish"
        base="Museum-grade archival art card"
        edge="Precision guillotine trimmed"
        features={[
          "Original illustrated anime, cyberpunk & gaming setup artworks",
          "Fade-proof archival pigment inks ensuring long-lasting vibrancy",
          "Matte anti-glare finish preventing harsh light reflections from setup monitors",
          "Standard A3 sizing easily fits standard frames or mounts directly with poster strips",
        ]}
      />

      {/* Single Question & Slider for Budget Range */}
      <div className="space-y-3 pt-2">
        <BudgetRangeSlider
          label="What budget range would you be willing to purchase this Poster within?"
          description="Drag the handles or select a preset to set the minimum and maximum price you would consider reasonable to pay."
          minValue={minVal}
          maxValue={maxVal}
          min={99}
          max={999}
          step={25}
          presets={presets}
          onChange={(minPrice, maxPrice) => {
            updateAnswers({
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
