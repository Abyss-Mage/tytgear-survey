"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SurveyAnswers, LikertRating } from "@/types/survey";
import { INITIAL_SURVEY_ANSWERS, TOTAL_STEPS, SURVEY_VERSION } from "@/config/survey";
import { generateResponseId } from "@/lib/id";
import { resolveCollege } from "@/config/colleges";
import { findFirstIncompleteStep, getFieldStep } from "@/lib/validation/surveyValidation";

interface SurveyContextType {
  currentStep: number;
  totalSteps: number;
  answers: SurveyAnswers;
  responseId: string;
  startedAt: string;
  collegeId: string;
  collegeName: string;
  isSubmitting: boolean;
  submitError: string | null;
  completed: boolean;
  honeypot: string;
  setHoneypot: (val: string) => void;
  updateAnswers: (updates: Partial<SurveyAnswers>) => void;
  setLikertAnswer: (productId: string, rating: LikertRating) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setStep: (step: number) => void;
  submitSurvey: () => Promise<boolean>;
  resetSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const STORAGE_KEY = "tytgear_survey_session_v1";

export const SurveyProvider: React.FC<{
  children: React.ReactNode;
  initialCollegeCode?: string;
}> = ({ children, initialCollegeCode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [responseId, setResponseId] = useState<string>("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [collegeId, setCollegeId] = useState<string>("");
  const [collegeName, setCollegeName] = useState<string>("");
  const [answers, setAnswers] = useState<SurveyAnswers>(INITIAL_SURVEY_ANSWERS);
  const [honeypot, setHoneypot] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  // Initialize session on mount
  useEffect(() => {
    const collegeInfo = resolveCollege(initialCollegeCode);

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.responseId && parsed.answers) {
          setResponseId(parsed.responseId);
          setStartedAt(parsed.startedAt || new Date().toISOString());
          setCurrentStep(parsed.currentStep || 1);
          setCompleted(parsed.completed || false);
          
          // If a specific college code was passed via URL, it takes precedence
          const activeCollege = initialCollegeCode ? collegeInfo : {
            id: parsed.collegeId || collegeInfo.id,
            name: parsed.collegeName || collegeInfo.name,
          };
          
          setCollegeId(activeCollege.id);
          setCollegeName(activeCollege.name);
          setAnswers({
            ...INITIAL_SURVEY_ANSWERS,
            ...parsed.answers,
            college_id: activeCollege.id,
            college_name: activeCollege.name,
          });
          setIsHydrated(true);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not read survey session from storage:", e);
    }

    // Fresh session
    const newId = generateResponseId();
    const newStarted = new Date().toISOString();
    setResponseId(newId);
    setStartedAt(newStarted);
    setCollegeId(collegeInfo.id);
    setCollegeName(collegeInfo.name);
    setAnswers({
      ...INITIAL_SURVEY_ANSWERS,
      college_id: collegeInfo.id,
      college_name: collegeInfo.name,
    });
    setIsHydrated(true);
  }, [initialCollegeCode]);

  // Sync state changes to sessionStorage
  useEffect(() => {
    if (!isHydrated || !responseId) return;

    try {
      const sessionData = {
        responseId,
        startedAt,
        currentStep,
        collegeId,
        collegeName,
        answers,
        completed,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.warn("Could not persist survey session to storage:", e);
    }
  }, [isHydrated, responseId, startedAt, currentStep, collegeId, collegeName, answers, completed]);

  const updateAnswers = (updates: Partial<SurveyAnswers>) => {
    setAnswers((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const setLikertAnswer = (productId: string, rating: LikertRating) => {
    setAnswers((prev) => ({
      ...prev,
      product_interests: {
        ...prev.product_interests,
        [productId]: rating,
      },
    }));
  };

  const goToNextStep = () => {
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const goToPreviousStep = () => {
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const setStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setSubmitError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentStep(step);
    }
  };

  const resetSurvey = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    const newId = generateResponseId();
    const newStarted = new Date().toISOString();
    const collegeInfo = resolveCollege(initialCollegeCode);
    setResponseId(newId);
    setStartedAt(newStarted);
    setCurrentStep(1);
    setCompleted(false);
    setSubmitError(null);
    setAnswers({
      ...INITIAL_SURVEY_ANSWERS,
      college_id: collegeInfo.id,
      college_name: collegeInfo.name,
    });
  };

  const submitSurvey = async (): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);

    // 1. Client-side pre-validation: check all required answers and redirect to earliest errored step
    const incomplete = findFirstIncompleteStep(answers);
    if (incomplete) {
      setCurrentStep(incomplete.step);
      setSubmitError(incomplete.message);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }

    const rawEmail = (answers.creator_email || answers.email || "").trim();
    const payload = {
      ...answers,
      email: rawEmail ? rawEmail : undefined,
      creator_email: answers.is_creator ? (rawEmail || undefined) : undefined,
      response_id: responseId,
      survey_version: SURVEY_VERSION,
      started_at: startedAt,
      college_id: collegeId,
      college_name: collegeName,
      honeypot: honeypot || "",
    };

    try {
      const response = await fetch("/api/survey/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Redirect to the first errored step returned by the server
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const firstErr = data.errors[0];
          const targetStep = getFieldStep(firstErr.field);
          setCurrentStep(targetStep);
          setSubmitError(firstErr.message || data.message || "Please complete this required question with a valid answer.");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return false;
        }
        throw new Error(data.message || "Please complete all required questions with valid answers.");
      }

      setCompleted(true);
      setCurrentStep(TOTAL_STEPS); // Go to thank you step
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      const msg = error?.message || "We couldn't submit your response right now. Please try again.";
      setSubmitError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SurveyContext.Provider
      value={{
        currentStep,
        totalSteps: TOTAL_STEPS,
        answers,
        responseId,
        startedAt,
        collegeId,
        collegeName,
        isSubmitting,
        submitError,
        completed,
        honeypot,
        setHoneypot,
        updateAnswers,
        setLikertAnswer,
        goToNextStep,
        goToPreviousStep,
        setStep,
        submitSurvey,
        resetSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
};
