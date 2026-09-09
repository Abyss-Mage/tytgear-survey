"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SingleChoice } from "../SingleChoice";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

const TYTGEAR_INTEREST_OPTIONS = [
  "Very interested",
  "Interested",
  "Neutral",
  "Not very interested",
  "Not interested",
];

export const Step11Concept: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!answers.tytgear_interest) {
      errs.tytgear_interest = "Please indicate your level of interest.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 7 • Introducing TYTGEAR
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Brand Vision &amp; Concept
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Here is a quick look at what we are building for Indian gamers and desk enthusiasts.
        </p>
      </div>

      {/* Brand Showcase Card */}
      <div className="p-5 sm:p-6 rounded-2xl border-2 border-brand-200 bg-canvas-card shadow-sm space-y-4">
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-brand-900 border border-brand-800 shadow-md">
          <Image
            src="/images/brand/tytgear-showcase.webp"
            alt="TYTGEAR Concept Showcase"
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <p className="text-sm sm:text-base text-brand-dark font-medium leading-relaxed">
            <strong>TYTGEAR</strong> is an upcoming Indian gaming and lifestyle gear brand focused on high-performance surfaces, original artwork, and aesthetic accessories for desk setups and rooms.
          </p>
          <p className="text-xs sm:text-sm text-canvas-muted mt-2 leading-relaxed">
            Launching at the end of September 2026, TYTGEAR combines esports-grade materials with distinctive artwork to elevate your battlestation without inflated import markups.
          </p>
        </div>
      </div>

      {/* Brand Interest Question */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          Based on what you have seen, how interested would you be in TYTGEAR products? <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-canvas-muted">
          Please be completely candid. Honest feedback helps us build gear you genuinely want.
        </p>
        <SingleChoice
          name="tytgear_interest"
          options={TYTGEAR_INTEREST_OPTIONS}
          value={answers.tytgear_interest}
          onChange={(val) => {
            updateAnswers({ tytgear_interest: val });
            if (errors.tytgear_interest) {
              setErrors((prev) => ({ ...prev, tytgear_interest: "" }));
            }
          }}
          columns={2}
        />
        {errors.tytgear_interest && (
          <p className="text-xs font-medium text-red-600">{errors.tytgear_interest}</p>
        )}
      </div>

      <NavigationButtons
        onValidate={validate}
        validationError={Object.values(errors).find(Boolean)}
      />
    </div>
  );
};
