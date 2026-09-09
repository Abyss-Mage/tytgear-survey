"use client";

import React, { useState } from "react";
import { Sparkles, Gift } from "lucide-react";
import { SingleChoice } from "../SingleChoice";
import { MultiChoice } from "../MultiChoice";
import { Input } from "@/components/ui/Input";
import { NavigationButtons } from "../NavigationButtons";
import { useSurvey } from "../SurveyContext";

const CREATOR_PLATFORMS = [
  "YouTube",
  "Instagram",
  "Twitch",
  "Kick",
  "Twitter / X",
  "College Gaming / Tech Club",
  "Other",
];

const AUDIENCE_TIERS = [
  "Under 1,000 followers / members",
  "1,000 – 5,000",
  "5,000 – 25,000",
  "25,000 – 100,000",
  "100,000+",
];

export const Step13CreatorForm: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (answers.is_creator) {
      const hasPlatform =
        (answers.creator_platforms && answers.creator_platforms.length > 0) ||
        (answers.creator_platform && answers.creator_platform.trim().length > 0);
      if (!hasPlatform) {
        errs.creator_platforms = "Please select at least one platform or role.";
      }
      if (!answers.creator_handle || answers.creator_handle.trim().length === 0) {
        errs.creator_handle = "Please share your channel handle, profile link, or society name.";
      }
      if (!answers.creator_audience) {
        errs.creator_audience = "Please select your estimated follower or club size.";
      }
      const emailToTest = (answers.creator_email || answers.email || "").trim();
      if (!emailToTest || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToTest)) {
        errs.creator_email = "Please enter a valid email address for creator communications.";
      }
      if (!answers.creator_terms_accepted) {
        errs.creator_terms_accepted = "Please accept the partnership expectations to apply.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>Partnership &bull; Optional</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
          Creator &amp; Campus Ambassador Program
        </h2>
        <p className="text-xs sm:text-sm text-canvas-muted mt-1 leading-relaxed">
          Are you a streamer, YouTuber, desk setup creator, or college club leader? TYTGEAR is looking for early creators to collaborate with for launch.
        </p>
      </div>

      {/* Collab Opt-In Question */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-brand-dark">
          Are you interested in collaborating with TYTGEAR as a creator or campus representative?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              updateAnswers({ is_creator: true });
            }}
            className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
              answers.is_creator === true
                ? "border-brand bg-brand-50 text-brand ring-2 ring-brand/20 shadow-sm"
                : "border-canvas-border bg-canvas hover:border-brand-200 text-brand-dark"
            }`}
          >
            <span>Yes, I create content or lead a gaming club</span>
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                answers.is_creator === true ? "border-brand bg-brand text-canvas" : "border-canvas-muted"
              }`}
            >
              {answers.is_creator === true && <span className="w-1.5 h-1.5 rounded-full bg-canvas" />}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateAnswers({
                is_creator: false,
                creator_platform: "",
                creator_platforms: [],
                creator_handle: "",
                creator_audience: "",
                creator_collab_type: [],
                creator_email: "",
                creator_terms_accepted: false,
              });
              setErrors({});
            }}
            className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
              answers.is_creator === false
                ? "border-brand bg-brand-50 text-brand ring-2 ring-brand/20 shadow-sm"
                : "border-canvas-border bg-canvas hover:border-brand-200 text-brand-dark"
            }`}
          >
            <span>No, not at this time</span>
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                answers.is_creator === false ? "border-brand bg-brand text-canvas" : "border-canvas-muted"
              }`}
            >
              {answers.is_creator === false && <span className="w-1.5 h-1.5 rounded-full bg-canvas" />}
            </span>
          </button>
        </div>
      </div>

      {/* Creator Details (Conditional) */}
      {answers.is_creator && (
        <div className="space-y-6 pt-4 border-t border-canvas-border animate-fadeIn">
          {/* Multiple Selection Platform Selection */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="block text-sm font-bold text-brand-dark">
                Where do you primarily create content or lead gaming activities? <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-semibold text-brand">Select all that apply</span>
            </div>
            <MultiChoice
              name="creator_platforms"
              options={CREATOR_PLATFORMS}
              values={
                answers.creator_platforms && answers.creator_platforms.length > 0
                  ? answers.creator_platforms
                  : answers.creator_platform
                  ? answers.creator_platform.split(" | ")
                  : []
              }
              onChange={(vals) => {
                updateAnswers({
                  creator_platforms: vals,
                  creator_platform: vals.join(" | "),
                });
                if (errors.creator_platforms) {
                  setErrors((prev) => ({ ...prev, creator_platforms: "" }));
                }
              }}
              columns={2}
            />
            {errors.creator_platforms && (
              <p className="text-xs font-medium text-red-600">{errors.creator_platforms}</p>
            )}
          </div>

          {/* Handle / Channel */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-brand-dark">
              Channel Handle, Profile URL, or Society Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. @setupwarriors, youtube.com/@yourchannel, IIT Bombay Gaming Club"
              value={answers.creator_handle || ""}
              onChange={(e) => {
                updateAnswers({ creator_handle: e.target.value });
                if (errors.creator_handle) {
                  setErrors((prev) => ({ ...prev, creator_handle: "" }));
                }
              }}
            />
            {errors.creator_handle && (
              <p className="text-xs font-medium text-red-600">{errors.creator_handle}</p>
            )}
          </div>

          {/* Audience / Follower Size */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-brand-dark">
              Estimated Community / Follower Size <span className="text-red-500">*</span>
            </label>
            <SingleChoice
              name="creator_audience"
              options={AUDIENCE_TIERS}
              value={answers.creator_audience || ""}
              onChange={(val) => {
                updateAnswers({ creator_audience: val });
                if (errors.creator_audience) {
                  setErrors((prev) => ({ ...prev, creator_audience: "" }));
                }
              }}
              columns={1}
            />
            {errors.creator_audience && (
              <p className="text-xs font-medium text-red-600">{errors.creator_audience}</p>
            )}
          </div>

          {/* Creator Contact Email */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-brand-dark">
              Creator Contact Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="e.g. yourchannel@gmail.com, creator@business.com"
              value={answers.creator_email || answers.email || ""}
              onChange={(e) => {
                const val = e.target.value;
                updateAnswers({
                  creator_email: val,
                  email: answers.email ? answers.email : val,
                });
                if (errors.creator_email) {
                  setErrors((prev) => ({ ...prev, creator_email: "" }));
                }
              }}
            />
            <p className="text-[11px] text-canvas-muted">
              Where our creator partnership team should reach out with product seeding and collaboration details.
            </p>
            {errors.creator_email && (
              <p className="text-xs font-medium text-red-600">{errors.creator_email}</p>
            )}
          </div>

          {/* Gives & Takes Partnership Section */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-brand-dark">
              Partnership Scope &amp; Expectations
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Gives */}
              <div className="p-4 rounded-xl border-2 border-emerald-200/90 bg-emerald-50/40 space-y-2 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Gives</span>
                </div>
                <p className="text-xs sm:text-sm text-brand-dark/90 leading-relaxed font-medium">
                  Build a meaningful partnership with TYTGEAR through exclusive creator opportunities, tailored benefits, and access to selected brand experiences. We aim to provide the right resources to support your content and creative direction.
                </p>
              </div>

              {/* Takes */}
              <div className="p-4 rounded-xl border-2 border-brand-200 bg-brand-50/40 space-y-2 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Takes</span>
                </div>
                <p className="text-xs sm:text-sm text-brand-dark/90 leading-relaxed font-medium">
                  In return, we look for authentic storytelling, consistent brand representation, and content that naturally connects TYTGEAR with your audience. Collaboration expectations will be aligned with your platform, content style, and the scope of each partnership.
                </p>
              </div>
            </div>
          </div>

          {/* Compulsory Terms & Guidelines Checkbox */}
          <div className="space-y-1.5 pt-1">
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                answers.creator_terms_accepted
                  ? "border-brand bg-brand-50/60 shadow-sm"
                  : errors.creator_terms_accepted
                  ? "border-red-300 bg-red-50/40"
                  : "border-canvas-border bg-canvas-card hover:border-brand-200"
              }`}
            >
              <input
                type="checkbox"
                checked={answers.creator_terms_accepted === true}
                onChange={(e) => {
                  updateAnswers({ creator_terms_accepted: e.target.checked });
                  if (errors.creator_terms_accepted) {
                    setErrors((prev) => ({ ...prev, creator_terms_accepted: "" }));
                  }
                }}
                className="mt-0.5 w-4 h-4 text-brand rounded border-canvas-border focus:ring-brand cursor-pointer flex-shrink-0"
              />
              <div className="text-xs sm:text-sm text-brand-dark leading-snug">
                <span>
                  I have read and agree to the partnership expectations, creator terms, and collaboration guidelines outlined above.
                </span>{" "}
                <span className="text-red-500 font-bold">*</span>
              </div>
            </label>
            {errors.creator_terms_accepted && (
              <p className="text-xs font-medium text-red-600 pl-1">{errors.creator_terms_accepted}</p>
            )}
          </div>
        </div>
      )}

      <NavigationButtons
        onValidate={validate}
        validationError={Object.values(errors).find(Boolean)}
        isSubmit={true}
        nextLabel="Submit Survey & Finish"
      />
    </div>
  );
};

