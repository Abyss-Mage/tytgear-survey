"use client";

import React from "react";
import { SURVEY_STEPS } from "@/config/survey";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  // If at the welcome step (1) or thank you step (12), don't show full calculation or show clean state
  const stepPercentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
  const currentStepMeta = SURVEY_STEPS.find((s) => s.id === currentStep);

  return (
    <div className="w-full bg-canvas py-3 px-4 sm:px-6 border-b border-canvas-border sticky top-0 z-30 backdrop-blur-md bg-canvas/90">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1.5">
          <span className="flex items-center gap-2">
            <span className="bg-brand text-canvas px-2 py-0.5 rounded-md font-mono text-[11px]">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-canvas-muted hidden sm:inline">•</span>
            <span className="text-brand-dark font-medium hidden sm:inline">
              {currentStepMeta?.title || ""}
            </span>
          </span>
          <span className="text-brand font-mono">{stepPercentage}%</span>
        </div>
        <div
          className="w-full h-2 bg-canvas-subtle rounded-full overflow-hidden border border-canvas-border/50"
          role="progressbar"
          aria-valuenow={stepPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-brand transition-all duration-300 ease-out rounded-full"
            style={{ width: `${stepPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
