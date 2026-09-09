"use client";

import React, { useState } from "react";
import { SingleChoice } from "../SingleChoice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";
import { INDIAN_STATES_AND_UTS } from "@/config/survey";

const AGE_OPTIONS = [
  "Under 16",
  "16–17",
  "18–20",
  "21–23",
  "24–26",
  "27+",
];

const RESPONDENT_TYPE_OPTIONS = [
  "Undergraduate student",
  "Postgraduate student",
  "Working professional",
  "Other",
];

export const Step2Profile: React.FC = () => {
  const { answers, updateAnswers, collegeName } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If affiliation is empty but collegeName is set from URL, prefill it
  React.useEffect(() => {
    if (!answers.affiliation && collegeName && collegeName !== "Other / Not specified") {
      updateAnswers({ affiliation: collegeName });
    }
  }, [collegeName, answers.affiliation, updateAnswers]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!answers.age) errs.age = "Please select your age group.";
    if (!answers.respondent_type) errs.respondent_type = "Please select your current role.";
    if (!answers.city || answers.city.trim().length === 0) errs.city = "Please enter your city.";
    if (!answers.state) errs.state = "Please select your state or union territory.";
    if (!answers.affiliation || answers.affiliation.trim().length === 0) {
      errs.affiliation = "Please specify your college, university, or company.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 1 • About You
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Tell us a little about yourself
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          This helps us understand how lifestyle preferences vary across age groups and institutions.
        </p>
      </div>

      {/* Q1: Age */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          1. What is your age? <span className="text-red-500">*</span>
        </label>
        <SingleChoice
          name="age"
          options={AGE_OPTIONS}
          value={answers.age}
          onChange={(val) => {
            updateAnswers({ age: val });
            if (errors.age) setErrors((prev) => ({ ...prev, age: "" }));
          }}
          columns={2}
        />
        {errors.age && <p className="text-xs font-medium text-red-600">{errors.age}</p>}
      </div>

      {/* Q2: Respondent Type */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          2. Which best describes you? <span className="text-red-500">*</span>
        </label>
        <SingleChoice
          name="respondent_type"
          options={RESPONDENT_TYPE_OPTIONS}
          value={answers.respondent_type}
          onChange={(val) => {
            updateAnswers({ respondent_type: val });
            if (errors.respondent_type) setErrors((prev) => ({ ...prev, respondent_type: "" }));
          }}
          columns={2}
        />
        {errors.respondent_type && (
          <p className="text-xs font-medium text-red-600">{errors.respondent_type}</p>
        )}
      </div>

      {/* Q3 & Q4: City and State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="3. Which city do you currently live in? *"
            placeholder="e.g. Mumbai, Bengaluru, Delhi"
            value={answers.city}
            onChange={(e) => {
              updateAnswers({ city: e.target.value });
              if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
            }}
            error={errors.city}
          />
        </div>

        <div>
          <Select
            label="4. Which state/UT do you currently live in? *"
            placeholder="Select State or Union Territory"
            value={answers.state}
            onChange={(e) => {
              updateAnswers({ state: e.target.value });
              if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
            }}
            options={INDIAN_STATES_AND_UTS.map((s) => ({ value: s, label: s }))}
            error={errors.state}
          />
        </div>
      </div>

      {/* Q5: College / University / Company Text Field */}
      <div className="space-y-2">
        <Input
          label="5. Which college, university, or company do you currently attend/work at? *"
          placeholder="e.g. IIT Delhi, BITS Pilani, Infosys, or Self-employed"
          value={answers.affiliation || ""}
          onChange={(e) => {
            updateAnswers({ affiliation: e.target.value });
            if (errors.affiliation) setErrors((prev) => ({ ...prev, affiliation: "" }));
          }}
          error={errors.affiliation}
          helperText="Enter your institution or workplace name."
        />
      </div>

      <NavigationButtons
        onValidate={validate}
        validationError={Object.values(errors).find(Boolean)}
      />
    </div>
  );
};
