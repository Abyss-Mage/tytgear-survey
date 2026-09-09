"use client";

import React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSurvey } from "./SurveyContext";

interface NavigationButtonsProps {
  onValidate?: () => boolean;
  validationError?: string | null;
  nextLabel?: string;
  isSubmit?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onValidate,
  validationError,
  nextLabel,
  isSubmit = false,
}) => {
  const {
    currentStep,
    totalSteps,
    goToPreviousStep,
    goToNextStep,
    submitSurvey,
    isSubmitting,
    submitError,
  } = useSurvey();

  const handleNext = async () => {
    if (onValidate && !onValidate()) {
      return;
    }

    if (isSubmit || currentStep === totalSteps - 1) {
      await submitSurvey();
    } else {
      goToNextStep();
    }
  };

  const showBack = currentStep > 1 && currentStep < totalSteps;
  const activeError = validationError || submitError;

  return (
    <div className="mt-8 pt-6 border-t border-canvas-border">
      {activeError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1 font-medium">{activeError}</div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {showBack ? (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={goToPreviousStep}
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back</span>
          </Button>
        ) : (
          <div className="hidden sm:block" />
        )}

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleNext}
          isLoading={isSubmitting}
          className="flex-1 sm:flex-initial sm:min-w-[180px]"
        >
          {isSubmit || currentStep === totalSteps - 1 ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              <span>Submit Survey</span>
            </>
          ) : (
            <>
              <span>{nextLabel || "Continue"}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
