"use client";

import React, { useState } from "react";
import { SingleChoice } from "../SingleChoice";
import { MultiChoice } from "../MultiChoice";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

const INTERESTS_OPTIONS = [
  "Gaming",
  "Anime / Manga",
  "Esports",
  "Technology / PC Building",
  "Movies / TV / Pop Culture",
  "Art / Illustration",
  "Music",
  "Fashion / Streetwear",
  "Room / Desk Setup",
  "None of these",
];

const GAMING_FREQUENCY_OPTIONS = [
  "Daily",
  "Several times a week",
  "Once a week",
  "A few times a month",
  "Rarely",
  "Never",
];

const PLATFORMS_OPTIONS = [
  "Gaming PC / Laptop",
  "PlayStation / Xbox / Nintendo Switch",
  "Mobile",
];

const SETUP_OPTIONS = [
  "I don't have a dedicated setup",
  "Basic desk/laptop setup",
  "Gaming setup",
  "Cafe PC",
];

export const Step3Interests: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!answers.interests || answers.interests.length === 0) {
      errs.interests = "Please select at least one interest (or 'None of these').";
    }
    if (!answers.gaming_frequency) {
      errs.gaming_frequency = "Please indicate how often you play games.";
    }
    if (!answers.platforms || answers.platforms.length === 0) {
      errs.platforms = "Please select the gaming platforms you regularly use.";
    }
    if (!answers.setup_type) {
      errs.setup_type = "Please describe your current setup.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 2 • Your Interests &amp; Gaming Habits
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Gaming Habits &amp; Setup Environment
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          Help us understand the types of setups, platforms, and aesthetics you relate to.
        </p>
      </div>

      {/* Q6: Interests */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          6. Which of the following are you interested in? <span className="text-red-500">*</span>
        </label>
        <MultiChoice
          name="interests"
          options={INTERESTS_OPTIONS}
          values={answers.interests}
          onChange={(vals) => {
            updateAnswers({ interests: vals });
            if (errors.interests) setErrors((prev) => ({ ...prev, interests: "" }));
          }}
          exclusiveOptions={["None of these"]}
          columns={2}
          instruction="Select all that apply."
        />
        {errors.interests && (
          <p className="text-xs font-medium text-red-600">{errors.interests}</p>
        )}
      </div>

      {/* Q7: Gaming Frequency */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          7. How often do you play games? <span className="text-red-500">*</span>
        </label>
        <SingleChoice
          name="gaming_frequency"
          options={GAMING_FREQUENCY_OPTIONS}
          value={answers.gaming_frequency}
          onChange={(val) => {
            updateAnswers({ gaming_frequency: val });
            if (errors.gaming_frequency) setErrors((prev) => ({ ...prev, gaming_frequency: "" }));
          }}
          columns={2}
        />
        {errors.gaming_frequency && (
          <p className="text-xs font-medium text-red-600">{errors.gaming_frequency}</p>
        )}
      </div>

      {/* Q8: Gaming Platforms */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          8. Which gaming platforms do you regularly use? <span className="text-red-500">*</span>
        </label>
        <MultiChoice
          name="platforms"
          options={PLATFORMS_OPTIONS}
          values={answers.platforms}
          onChange={(vals) => {
            updateAnswers({ platforms: vals });
            if (errors.platforms) setErrors((prev) => ({ ...prev, platforms: "" }));
          }}
          columns={1}
          instruction="Select all that apply."
        />
        {errors.platforms && (
          <p className="text-xs font-medium text-red-600">{errors.platforms}</p>
        )}
      </div>

      {/* Q9: Desk / Setup */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          9. How would you describe your current desk/setup? <span className="text-red-500">*</span>
        </label>
        <SingleChoice
          name="setup_type"
          options={SETUP_OPTIONS}
          value={answers.setup_type}
          onChange={(val) => {
            updateAnswers({ setup_type: val });
            if (errors.setup_type) setErrors((prev) => ({ ...prev, setup_type: "" }));
          }}
          columns={1}
        />
        {errors.setup_type && (
          <p className="text-xs font-medium text-red-600">{errors.setup_type}</p>
        )}
      </div>

      <NavigationButtons
        onValidate={validate}
        validationError={Object.values(errors).find(Boolean)}
      />
    </div>
  );
};
