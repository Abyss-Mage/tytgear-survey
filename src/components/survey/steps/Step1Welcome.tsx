"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, Tag, Clock, ShieldCheck, HeartHandshake, ArrowRight, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSurvey } from "../SurveyContext";
import { Honeypot } from "../Honeypot";

export const Step1Welcome: React.FC = () => {
  const { goToNextStep, collegeName, collegeId, answers, updateAnswers } = useSurvey();
  const [nameError, setNameError] = useState<string | null>(null);

  const handleStart = () => {
    const trimmed = (answers.name || "").trim();
    if (!trimmed || trimmed.length < 2) {
      setNameError("Please enter your name to begin the survey.");
      return;
    }
    setNameError(null);
    goToNextStep();
  };

  return (
    <div className="max-w-2xl mx-auto py-2 sm:py-6 animate-fadeIn space-y-6">
      <Honeypot />

      {/* College Notice if detected */}
      {collegeName && collegeId !== "OTHER" && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand">
          <span>Campus Partner:</span>
          <span className="text-brand-dark">{collegeName}</span>
        </div>
      )}

      {/* Hero Title */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-dark tracking-tight leading-tight mb-3">
          Help Shape the Next Generation of Gaming &amp; Lifestyle Gear
        </h1>
        <p className="text-sm sm:text-base text-brand-dark/80 leading-relaxed">
          TYTGEAR is conducting nationwide research to understand real setup habits, design tastes, and gear expectations across Indian campuses.
        </p>
      </div>

      {/* TWO PROMINENT REWARD BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Box 1: 80x33 cm Large Hybrid Mousepad Giveaway */}
        <div className="relative overflow-hidden p-5 rounded-2xl border-2 border-brand-300 bg-gradient-to-br from-brand-50/80 via-canvas-card to-brand-100/40 shadow-sm flex flex-col justify-between group hover:border-brand-500 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand text-canvas flex items-center justify-center shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand bg-brand-100/80 px-2 py-0.5 rounded-md inline-block mb-1">
                Optional Giveaway
              </span>
              <h3 className="text-base font-bold text-brand-dark">
                Win an 80×33 cm Large Hybrid Mousepad
              </h3>
            </div>
            <p className="text-xs text-brand-dark/80 leading-relaxed">
              Every participant is eligible to enter the draw for a premium TYTGEAR 80×33 cm Large Hybrid Mousepad featuring water-repellent micro-weave and stitched edges.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-brand-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-brand">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optional entry after survey completion</span>
          </div>
        </div>

        {/* Box 2: Launch Discount Coupon via Email */}
        <div className="relative overflow-hidden p-5 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/80 via-canvas-card to-amber-100/40 shadow-sm flex flex-col justify-between group hover:border-amber-500 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-canvas flex items-center justify-center shadow-sm">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md inline-block mb-1">
                Launch Discount
              </span>
              <h3 className="text-base font-bold text-brand-dark">
                Exclusive Launch Discount Coupon
              </h3>
            </div>
            <p className="text-xs text-brand-dark/80 leading-relaxed">
              Receive an exclusive 20% launch discount coupon code delivered directly to your email upon survey completion when you share your email.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sent via email upon opting in</span>
          </div>
        </div>
      </div>

      {/* Survey Guidelines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-canvas-border bg-canvas-card flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-brand-dark">4–5 Minutes</h4>
            <p className="text-[11px] text-canvas-muted">Quick mobile-first questions with range sliders.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-canvas-border bg-canvas-card flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-brand-dark">Honest Answers</h4>
            <p className="text-[11px] text-canvas-muted">Critique and realistic feedback matter most.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-canvas-border bg-canvas-card flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-brand-dark">Email Only for Prizes</h4>
            <p className="text-[11px] text-canvas-muted">No spam, no phone number required.</p>
          </div>
        </div>
      </div>

      {/* Participant Name Input */}
      <div className="p-5 rounded-2xl border-2 border-brand-300 bg-gradient-to-br from-brand-50/50 via-canvas-card to-canvas-card shadow-sm text-left max-w-md mx-auto space-y-2">
        <label className="block text-xs font-bold text-brand-dark">
          Your Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 w-4 h-4 text-canvas-muted pointer-events-none" />
          <input
            type="text"
            placeholder="e.g. Alex Sharma"
            value={answers.name || ""}
            onChange={(e) => {
              updateAnswers({ name: e.target.value });
              if (nameError) setNameError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleStart();
              }
            }}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-canvas-border bg-canvas text-brand-dark text-sm placeholder:text-canvas-muted focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        {nameError && (
          <p className="text-xs font-semibold text-red-600 animate-fadeIn">{nameError}</p>
        )}
        <p className="text-[11px] text-canvas-muted">
          Your name will be recorded on your survey receipt and giveaway entry ticket.
        </p>
      </div>

      {/* Call to Action */}
      <div className="pt-2">
        <Button
          size="lg"
          fullWidth
          onClick={handleStart}
          className="text-base font-bold sm:w-auto sm:min-w-[240px] shadow-md"
        >
          <span>Start Survey &amp; Enter Giveaway</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
