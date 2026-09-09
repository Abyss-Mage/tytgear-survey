"use client";

import React from "react";
import { useSurvey } from "./SurveyContext";

export const Honeypot: React.FC = () => {
  const { honeypot, setHoneypot } = useSurvey();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        opacity: 0,
        height: 0,
        width: 0,
        overflow: "hidden",
        zIndex: -1,
      }}
    >
      <label htmlFor="survey-feedback-bot-check">Do not fill this field</label>
      <input
        type="text"
        id="survey-feedback-bot-check"
        name="website_url_check"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
};
