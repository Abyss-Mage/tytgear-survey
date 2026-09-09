import React from "react";
import { SurveyShell } from "@/components/survey/SurveyShell";
import { SurveyProvider } from "@/components/survey/SurveyContext";
import { SurveyStepRenderer } from "@/components/survey/SurveyStepRenderer";

interface SurveyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SurveyPage({ searchParams }: SurveyPageProps) {
  const resolvedParams = await searchParams;
  const collegeParam =
    typeof resolvedParams?.college === "string" ? resolvedParams.college : undefined;

  return (
    <SurveyProvider initialCollegeCode={collegeParam}>
      <SurveyShell>
        <SurveyStepRenderer />
      </SurveyShell>
    </SurveyProvider>
  );
}
