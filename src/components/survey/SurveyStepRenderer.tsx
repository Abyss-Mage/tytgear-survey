"use client";

import React from "react";
import { useSurvey } from "./SurveyContext";
import { Step1Welcome } from "./steps/Step1Welcome";
import { Step2Profile } from "./steps/Step2Profile";
import { Step3Interests } from "./steps/Step3Interests";
import { Step4Purchasing } from "./steps/Step4Purchasing";
import { Step5Demand } from "./steps/Step5Demand";
import { Step6Designs } from "./steps/Step6Designs";
import { Step7PricingSmall } from "./steps/Step7PricingSmall";
import { Step8PricingLarge } from "./steps/Step8PricingLarge";
import { Step9PricingFramedPoster } from "./steps/Step9PricingFramedPoster";
import { Step10PricingMetalPoster } from "./steps/Step10PricingMetalPoster";
import { Step10BudgetTapestry } from "./steps/Step10BudgetTapestry";
import { Step11Concept } from "./steps/Step11Concept";
import { Step12Marketing } from "./steps/Step12Marketing";
import { Step13CreatorForm } from "./steps/Step13CreatorForm";
import { Step14ThankYou } from "./steps/Step14ThankYou";

export const SurveyStepRenderer: React.FC = () => {
  const { currentStep } = useSurvey();

  switch (currentStep) {
    case 1:
      return <Step1Welcome />;
    case 2:
      return <Step2Profile />;
    case 3:
      return <Step3Interests />;
    case 4:
      return <Step4Purchasing />;
    case 5:
      return <Step5Demand />;
    case 6:
      return <Step6Designs />;
    case 7:
      return <Step7PricingSmall />;
    case 8:
      return <Step8PricingLarge />;
    case 9:
      return <Step9PricingFramedPoster />;
    case 10:
      return <Step10PricingMetalPoster />;
    case 11:
      return <Step10BudgetTapestry />;
    case 12:
      return <Step11Concept />;
    case 13:
      return <Step12Marketing />;
    case 14:
      return <Step13CreatorForm />;
    case 15:
      return <Step14ThankYou />;
    default:
      return <Step1Welcome />;
  }
};
