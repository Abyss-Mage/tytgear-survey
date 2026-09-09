"use client";

import React from "react";
import Image from "next/image";
import { AlertCircle, GraduationCap } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { useSurvey } from "./SurveyContext";

interface SurveyShellProps {
  children: React.ReactNode;
}

export const SurveyShell: React.FC<SurveyShellProps> = ({ children }) => {
  const { currentStep, totalSteps, collegeName, collegeId, submitError } = useSurvey();

  return (
    <div className="min-h-screen bg-canvas text-brand-dark flex flex-col selection:bg-brand-200 selection:text-brand-900">
      {/* Header */}
      <header className="bg-canvas border-b border-canvas-border px-4 py-3.5 sm:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-auto relative">
              <Image
                src="/images/brand/tytgear-logo.png"
                alt="TYTGEAR Logo"
                width={130}
                height={36}
                priority
                className="h-9 w-auto object-contain"
              />
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold tracking-wider text-canvas-muted uppercase">
              Pre-Launch Study
            </span>
          </div>

          {/* College Badge */}
          {collegeName && collegeId !== "OTHER" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-medium text-brand">
              <GraduationCap className="w-3.5 h-3.5 text-brand" />
              <span className="truncate max-w-[180px] sm:max-w-xs">{collegeName}</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar (Show on all survey question steps before thank you step) */}
      {currentStep > 1 && currentStep < totalSteps && (
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-start">
        {submitError && currentStep < totalSteps && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fadeIn shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Incomplete Required Question</span>
              <span>{submitError}</span>
            </div>
          </div>
        )}
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 px-6 border-t border-canvas-border text-center text-xs text-canvas-muted bg-canvas">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 TYTGEAR. All rights reserved.</span>
          <span className="text-[11px]">Academic &amp; Market Research Study • Student Cohort</span>
        </div>
      </footer>
    </div>
  );
};
