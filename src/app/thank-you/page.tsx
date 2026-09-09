"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-12 text-center text-brand-dark">
      <div className="max-w-md w-full bg-canvas-card border-2 border-canvas-border p-6 sm:p-8 rounded-3xl shadow-card space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand mx-auto flex items-center justify-center shadow-sm border border-brand-200">
          <CheckCircle className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">
            TYTGEAR Research Survey
          </h1>
          <p className="text-xs sm:text-sm text-canvas-muted mt-2 leading-relaxed">
            Thank you for participating in our pre-launch study. Your candid feedback directly shapes our upcoming late September 2026 launch products.
          </p>
        </div>

        {/* Launch Discount Note */}
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-left space-y-2">
          <div className="flex items-center gap-2 text-brand font-bold text-sm">
            <Mail className="w-4 h-4 text-brand" />
            <span>Launch Discount Delivery</span>
          </div>
          <p className="text-xs text-brand-dark/80 leading-relaxed">
            If you provided your email during the survey, your exclusive 20% launch discount code will be sent to your email by our team prior to launch.
          </p>
        </div>

        <Link href="/survey" className="block">
          <Button variant="outline" size="md" fullWidth>
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Survey</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
