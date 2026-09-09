"use client";

import React, { useState } from "react";
import { MultiChoice } from "../MultiChoice";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

const DESIGN_PURCHASE_DRIVERS = [
  "Looks unique / Premium",
  "Matches my personality",
  "Looks good in my setup",
  "Represents something I like",
  "Original artwork",
  "Trendy",
  "Minimalistic",
  "Bold / Eye-catching",
  "Other",
];

export const Step6Designs: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!answers.design_purchase_drivers || answers.design_purchase_drivers.length === 0) {
      errs.design_purchase_drivers = "Please select what makes a design worth purchasing.";
    } else if (answers.design_purchase_drivers.length > 3) {
      errs.design_purchase_drivers = "Please select at most 3 reasons.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 5 • Design Preferences
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Visual Directions &amp; Aesthetics
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Tell us what matters most to you when choosing gear designs.
        </p>
      </div>

      {/* Q18: What makes a design worth purchasing? */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <label className="block text-sm font-bold text-brand-dark">
            18. What makes a design worth purchasing to you? <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-semibold text-brand">Select up to 3</span>
        </div>
        <MultiChoice
          name="design_purchase_drivers"
          options={DESIGN_PURCHASE_DRIVERS}
          values={answers.design_purchase_drivers}
          onChange={(vals) => {
            updateAnswers({ design_purchase_drivers: vals });
            if (errors.design_purchase_drivers) {
              setErrors((prev) => ({ ...prev, design_purchase_drivers: "" }));
            }
          }}
          maxSelections={3}
          columns={2}
        />
        {errors.design_purchase_drivers && (
          <p className="text-xs font-medium text-red-600">{errors.design_purchase_drivers}</p>
        )}
      </div>

      <NavigationButtons
        onValidate={validate}
        validationError={Object.values(errors).find(Boolean)}
      />
    </div>
  );
};
