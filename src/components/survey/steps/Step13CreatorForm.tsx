"use client";

import React, { useState } from "react";
import { Sparkles, Video, Users, Gift, Megaphone } from "lucide-react";
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

const COLLAB_TYPES = [
  "Free review units & seed gear",
  "Dedicated discount code with creator commission",
  "Sponsored video / stream placement",
  "College fest or esports tournament sponsorship",
  "Co-designing future mousepads & gear",
];

export const Step13CreatorForm: React.FC = () => {
  const { answers, updateAnswers } = useSurvey();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (answers.is_creator) {
      if (!answers.creator_platform) {
        errs.creator_platform = "Please select your primary platform or role.";
      }
      if (!answers.creator_handle || answers.creator_handle.trim().length === 0) {
        errs.creator_handle = "Please share your channel handle, profile link, or society name.";
      }
      if (!answers.creator_audience) {
        errs.creator_audience = "Please select your estimated follower or club size.";
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

      {/* Benefits Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/50 border border-brand-200 space-y-3">
        <h4 className="text-xs font-bold text-brand uppercase tracking-wider">
          Why Partner With TYTGEAR?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-dark">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-brand flex-shrink-0" />
            <span>Complimentary review units &amp; seed setups</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand flex-shrink-0" />
            <span>Dedicated discount code &amp; affiliate earnings</span>
          </div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-brand flex-shrink-0" />
            <span>Sponsorships for college fests &amp; LAN events</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-brand flex-shrink-0" />
            <span>Opportunities to co-design official collections</span>
          </div>
        </div>
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
            className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${
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
                creator_handle: "",
                creator_audience: "",
                creator_collab_type: [],
              });
              setErrors({});
            }}
            className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${
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
          {/* Platform */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-brand-dark">
              Where do you primarily create content or lead gaming activities? <span className="text-red-500">*</span>
            </label>
            <SingleChoice
              name="creator_platform"
              options={CREATOR_PLATFORMS}
              value={answers.creator_platform || ""}
              onChange={(val) => {
                updateAnswers({ creator_platform: val });
                if (errors.creator_platform) {
                  setErrors((prev) => ({ ...prev, creator_platform: "" }));
                }
              }}
              columns={2}
            />
            {errors.creator_platform && (
              <p className="text-xs font-medium text-red-600">{errors.creator_platform}</p>
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

          {/* Collaboration Type */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="block text-sm font-bold text-brand-dark">
                How would you like to collaborate?
              </label>
              <span className="text-xs font-semibold text-brand">Select all that apply</span>
            </div>
            <MultiChoice
              name="creator_collab_type"
              options={COLLAB_TYPES}
              values={answers.creator_collab_type || []}
              onChange={(vals) => {
                updateAnswers({ creator_collab_type: vals });
              }}
              columns={1}
            />
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
