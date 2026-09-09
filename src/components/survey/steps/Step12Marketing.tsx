"use client";

import React, { useState } from "react";
import { SingleChoice } from "../SingleChoice";
import { MultiChoice } from "../MultiChoice";
import { RatingScale } from "../RatingScale";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

const DISCOVERY_CHANNELS_OPTIONS = [
  "Instagram / Reels",
  "YouTube / Shorts",
  "Reddit (r/IndianGaming, etc.)",
  "Discord Communities",
  "Friend Recommendation / Word of Mouth",
  "Gaming / Tech Events & Expos",
  "College Campus / Fests",
  "Offline Tech / Gaming Stores",
  "Other",
];

const CONTENT_PREFERENCES_OPTIONS = [
  "Setup inspiration & desk tours",
  "Product reviews & sound tests",
  "Aesthetic b-rolls & unboxings",
  "Anime / Pop-culture artwork showcases",
  "Behind-the-scenes / manufacturing process",
  "Creator / Streamer collabs",
  "Community giveaways & tournaments",
  "Discounts & exclusive drop alerts",
];

const LAUNCH_OFFER_OPTIONS = [
  "Flat launch discount (e.g. 20% off)",
  "Buy 1 Get 1 / Bundle deals",
  "Free shipping nationwide",
  "Free custom stickers / desk accessories with order",
  "Exclusive early-bird limited colorway / edition",
];

export const Step12Marketing: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!answers.discovery_channels || answers.discovery_channels.length === 0) {
      errs.discovery_channels = "Please select up to 3 channels.";
    } else if (answers.discovery_channels.length > 3) {
      errs.discovery_channels = "Please select at most 3 channels.";
    }

    if (!answers.content_preferences || answers.content_preferences.length === 0) {
      errs.content_preferences = "Please select up to 3 content types.";
    } else if (answers.content_preferences.length > 3) {
      errs.content_preferences = "Please select at most 3 content types.";
    }

    if (!answers.launch_offer) {
      errs.launch_offer = "Please select your preferred launch offer.";
    }

    if (answers.purchase_intent === undefined) {
      errs.purchase_intent = "Please select your likelihood on the 0-10 scale.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-xs font-bold text-brand uppercase tracking-wider">
          Section 8 • Marketing &amp; Launch
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Discovery Channels &amp; Purchase Likelihood
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1">
          How do you discover new gear, and what offers resonate with you?
        </p>
      </div>

      {/* Discovery Channels */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <label className="block text-sm font-bold text-brand-dark">
            Where are you most likely to discover a brand like TYTGEAR? <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-semibold text-brand">Select up to 3</span>
        </div>
        <MultiChoice
          name="discovery_channels"
          options={DISCOVERY_CHANNELS_OPTIONS}
          values={answers.discovery_channels}
          onChange={(vals) => {
            updateAnswers({ discovery_channels: vals });
            if (errors.discovery_channels) {
              setErrors((prev) => ({ ...prev, discovery_channels: "" }));
            }
          }}
          columns={2}
          maxSelections={3}
        />
        {errors.discovery_channels && (
          <p className="text-xs font-medium text-red-600">{errors.discovery_channels}</p>
        )}
      </div>

      {/* Content Preferences */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <label className="block text-sm font-bold text-brand-dark">
            What type of content would make you follow or check out TYTGEAR? <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-semibold text-brand">Select up to 3</span>
        </div>
        <MultiChoice
          name="content_preferences"
          options={CONTENT_PREFERENCES_OPTIONS}
          values={answers.content_preferences}
          onChange={(vals) => {
            updateAnswers({ content_preferences: vals });
            if (errors.content_preferences) {
              setErrors((prev) => ({ ...prev, content_preferences: "" }));
            }
          }}
          columns={2}
          maxSelections={3}
        />
        {errors.content_preferences && (
          <p className="text-xs font-medium text-red-600">{errors.content_preferences}</p>
        )}
      </div>

      {/* Launch Offer */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          Which launch offer would most incentivize you to place an order? <span className="text-red-500">*</span>
        </label>
        <SingleChoice
          name="launch_offer"
          options={LAUNCH_OFFER_OPTIONS}
          value={answers.launch_offer}
          onChange={(val) => {
            updateAnswers({ launch_offer: val });
            if (errors.launch_offer) {
              setErrors((prev) => ({ ...prev, launch_offer: "" }));
            }
          }}
          columns={1}
        />
        {errors.launch_offer && (
          <p className="text-xs font-medium text-red-600">{errors.launch_offer}</p>
        )}
      </div>

      {/* Purchase Intent (0-10) */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          How likely are you to purchase from TYTGEAR when we launch at the end of September 2026? <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-canvas-muted">
          On a scale from 0 (Not at all likely) to 10 (Extremely likely).
        </p>
        <div className="p-4 sm:p-5 rounded-2xl bg-canvas-card border border-canvas-border shadow-sm">
          <RatingScale
            min={0}
            max={10}
            value={answers.purchase_intent}
            onChange={(val) => {
              updateAnswers({ purchase_intent: val });
              if (errors.purchase_intent) {
                setErrors((prev) => ({ ...prev, purchase_intent: "" }));
              }
            }}
            minLabel="Not at all likely"
            maxLabel="Extremely likely"
          />
        </div>
        {errors.purchase_intent && (
          <p className="text-xs font-medium text-red-600">{errors.purchase_intent}</p>
        )}
      </div>

      <NavigationButtons
        onValidate={validate}
        validationError={Object.values(errors).find(Boolean)}
      />
    </div>
  );
};
