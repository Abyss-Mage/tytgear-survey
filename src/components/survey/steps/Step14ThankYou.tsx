"use client";

import React, { useState } from "react";
import { CheckCircle, Gift, Mail, ShieldCheck, Sparkles, RefreshCw, Send, Check } from "lucide-react";
import { useSurvey } from "../SurveyContext";
import { Button } from "@/components/ui/Button";

export const Step14ThankYou: React.FC = () => {
  const { responseId, answers, resetSurvey } = useSurvey();
  const [emailInput, setEmailInput] = useState(answers.email || "");
  const [consent, setConsent] = useState(true);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [claimedEmail, setClaimedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCreatorApplicant = answers.is_creator && !!answers.creator_handle;

  const handleClaimReward = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = emailInput.trim();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setErrorMessage("Please confirm consent to receive the discount code and giveaway updates.");
      return;
    }

    setIsSubmittingLead(true);

    try {
      const res = await fetch("/api/survey/claim-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response_id: responseId,
          email,
          contact_consent: true,
          affiliation: answers.affiliation || "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit email. Please try again.");
      }

      setRewardClaimed(true);
      setClaimedEmail(email);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error?.message || "Could not submit email right now. Please try again.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-8 text-center animate-fadeIn space-y-6">
      {/* Success Badge & Header */}
      <div className="w-16 h-16 rounded-full bg-brand-100 text-brand mx-auto flex items-center justify-center shadow-sm border border-brand-200">
        <CheckCircle className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
          Survey Completed!
        </h1>
        <p className="text-sm text-brand-dark/80 mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for sharing your candid insights. Your feedback directly shapes our late September 2026 launch products and pricing.
        </p>
      </div>

      {/* Submission Receipt */}
      <div className="p-4 rounded-xl border border-canvas-border bg-canvas-card text-left max-w-md mx-auto shadow-sm">
        <div className="text-[10px] font-bold text-canvas-muted uppercase tracking-wider mb-1">
          Submission Receipt
        </div>
        <div className="text-sm font-mono font-bold text-brand flex items-center justify-between">
          <span>{responseId}</span>
          <span className="text-[10px] font-sans font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
            Recorded
          </span>
        </div>
        {answers.affiliation && (
          <div className="text-xs text-canvas-muted mt-1 truncate">
            Affiliation: {answers.affiliation}
          </div>
        )}
      </div>

      {/* Creator Program Status if applied */}
      {isCreatorApplicant && (
        <div className="p-4 rounded-2xl bg-brand-50/40 border border-brand-200 text-xs text-brand-dark text-left flex items-start gap-3 max-w-md mx-auto">
          <Sparkles className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">Creator Application Received</span>
            <p className="text-canvas-muted mt-0.5">
              Thank you for applying! Our team will review your channel (<strong className="text-brand-dark">{answers.creator_handle}</strong>) and reach out before launch.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OPTIONAL SECTION: Giveaway Entry & Email-Sent Discount Code */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/90 via-canvas-card to-amber-50/50 shadow-sm text-left space-y-4 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-900 bg-amber-200/70 border border-amber-300 px-2 py-0.5 rounded-md inline-block">
            Optional Reward Section
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <Gift className="w-5 h-5 text-brand flex-shrink-0" />
            <span>Enter Giveaway &amp; Get Launch Discount</span>
          </h3>
          <p className="text-xs text-brand-dark/80 mt-1.5 leading-relaxed">
            Enter your email below. We will send your exclusive <strong>20% launch discount code directly to your email</strong> and confirm your entry into the drawing for an <strong>80×33 cm Large Hybrid Mousepad</strong>.
          </p>
        </div>

        {!rewardClaimed ? (
          <form onSubmit={handleClaimReward} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-canvas-muted pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-canvas-border bg-canvas text-brand-dark text-sm placeholder:text-canvas-muted focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded text-brand focus:ring-brand accent-brand border-canvas-border"
              />
              <span className="text-[11px] text-canvas-muted leading-tight">
                Send my 20% discount coupon to this email and notify me if I win the 80×33 cm mousepad giveaway.
              </span>
            </label>

            {errorMessage && (
              <p className="text-xs font-semibold text-red-600 animate-fadeIn">{errorMessage}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isSubmittingLead}
              className="mt-2 font-bold shadow-sm"
            >
              <Send className="w-3.5 h-3.5 mr-2" />
              <span>Send My Discount Code &amp; Enter Giveaway</span>
            </Button>

            <div className="flex items-center gap-1.5 text-[10px] text-canvas-muted pt-1 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              <span>No spam. Email is used strictly by us for your coupon and giveaway updates.</span>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-left space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-2 text-brand font-bold text-sm">
              <Check className="w-4 h-4 text-brand" />
              <span>Email Registered!</span>
            </div>
            <p className="text-xs text-brand-dark/80 leading-relaxed">
              We have recorded your email: <strong className="text-brand-dark">{claimedEmail}</strong>. Your exclusive <strong>20% launch discount code</strong> will be sent to your email by our team, and your entry into the <strong>80×33 cm Large Hybrid Mousepad Giveaway</strong> is officially confirmed!
            </p>
            <div className="flex items-center gap-2 text-[11px] text-canvas-muted pt-1">
              <Mail className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span>Please keep an eye on your inbox ahead of our late September 2026 launch.</span>
            </div>
          </div>
        )}
      </div>

      {/* Reset / Submit Another Response Button */}
      <div className="pt-4 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={resetSurvey}
          className="text-xs font-semibold text-canvas-muted"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>Submit another response</span>
        </Button>
      </div>
    </div>
  );
};
