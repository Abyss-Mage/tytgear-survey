"use client";

import React from "react";
import Image from "next/image";
import { AlertCircle, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface PriceSensitivityProps {
  tooCheap?: number;
  goodDeal?: number;
  expensive?: number;
  tooExpensive?: number;
  onChange: (field: "price_too_cheap" | "price_good_deal" | "price_expensive" | "price_too_expensive", value: number | undefined) => void;
  errors?: Record<string, string>;
}

export const PriceSensitivity: React.FC<PriceSensitivityProps> = ({
  tooCheap,
  goodDeal,
  expensive,
  tooExpensive,
  onChange,
  errors = {},
}) => {
  const handleNumericChange = (
    field: "price_too_cheap" | "price_good_deal" | "price_expensive" | "price_too_expensive",
    rawVal: string
  ) => {
    if (rawVal === "") {
      onChange(field, undefined);
      return;
    }
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(field, Math.round(parsed));
    }
  };

  // Real-time consistency check
  const hasValues =
    tooCheap !== undefined &&
    goodDeal !== undefined &&
    expensive !== undefined &&
    tooExpensive !== undefined;

  let inconsistencyMessage: string | null = null;
  if (hasValues) {
    if (tooCheap > goodDeal) {
      inconsistencyMessage =
        "The 'Good deal' price should normally be higher than or equal to the 'Too cheap / questionable quality' price.";
    } else if (goodDeal > expensive) {
      inconsistencyMessage =
        "The 'Starting to feel expensive' price should be higher than or equal to the 'Good deal' price.";
    } else if (expensive > tooExpensive) {
      inconsistencyMessage =
        "The 'Too expensive' price should be higher than or equal to the 'Starting to feel expensive' price.";
    }
  }

  return (
    <div className="space-y-6">
      {/* Product Highlight Card */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-canvas-border bg-canvas-card flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm">
        <div className="relative w-36 h-28 flex-shrink-0 bg-canvas-subtle rounded-xl overflow-hidden border border-canvas-border">
          <Image
            src="/images/mockups/smallmousepad.webp"
            alt="TYTGEAR Small Mousepad"
            fill
            sizes="144px"
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <span className="text-[11px] font-semibold text-brand bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100 inline-block mb-1.5">
            Reference Product
          </span>
          <h3 className="text-base font-bold text-brand-dark">
            Precision Small Gaming Mousepad
          </h3>
          <p className="text-xs text-canvas-muted mt-1 leading-relaxed">
            High-density micro-weave cloth surface, anti-fray stitched edges, non-slip rubber base (approx. 250 × 210 × 3mm).
          </p>
        </div>
      </div>

      {/* Van Westendorp Pricing Guidance */}
      <div className="p-3.5 rounded-xl bg-brand-50/50 border border-brand-100 flex items-start gap-2.5 text-xs text-brand-dark/80">
        <HelpCircle className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
        <span>
          Please enter your honest estimates in Indian Rupees (₹). There are no right or wrong figures—we want to understand your natural perception of value.
        </span>
      </div>

      {/* Logical Inconsistency Warning */}
      {inconsistencyMessage && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Please check your pricing hierarchy</span>
            <span>{inconsistencyMessage}</span>
          </div>
        </div>
      )}

      {/* The 4 Pricing Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Q24 */}
        <div className="p-4 rounded-xl border-2 border-canvas-border bg-canvas-card">
          <span className="text-[11px] font-bold text-canvas-muted uppercase tracking-wider block mb-1">
            Q24 • Too Inexpensive
          </span>
          <label className="block text-xs font-semibold text-brand-dark mb-2 min-h-[32px]">
            At what price would this seem so cheap that you would question its quality?
          </label>
          <Input
            type="number"
            min={1}
            prefixText="₹"
            placeholder="e.g. 199"
            value={tooCheap !== undefined ? tooCheap : ""}
            onChange={(e) => handleNumericChange("price_too_cheap", e.target.value)}
            error={errors.price_too_cheap}
          />
        </div>

        {/* Q25 */}
        <div className="p-4 rounded-xl border-2 border-canvas-border bg-canvas-card">
          <span className="text-[11px] font-bold text-canvas-muted uppercase tracking-wider block mb-1">
            Q25 • Good Deal
          </span>
          <label className="block text-xs font-semibold text-brand-dark mb-2 min-h-[32px]">
            At what price would you consider this product a great deal?
          </label>
          <Input
            type="number"
            min={1}
            prefixText="₹"
            placeholder="e.g. 399"
            value={goodDeal !== undefined ? goodDeal : ""}
            onChange={(e) => handleNumericChange("price_good_deal", e.target.value)}
            error={errors.price_good_deal}
          />
        </div>

        {/* Q26 */}
        <div className="p-4 rounded-xl border-2 border-canvas-border bg-canvas-card">
          <span className="text-[11px] font-bold text-canvas-muted uppercase tracking-wider block mb-1">
            Q26 • Starting to Feel Expensive
          </span>
          <label className="block text-xs font-semibold text-brand-dark mb-2 min-h-[32px]">
            At what price would it start to feel expensive, but you might still consider it?
          </label>
          <Input
            type="number"
            min={1}
            prefixText="₹"
            placeholder="e.g. 699"
            value={expensive !== undefined ? expensive : ""}
            onChange={(e) => handleNumericChange("price_expensive", e.target.value)}
            error={errors.price_expensive}
          />
        </div>

        {/* Q27 */}
        <div className="p-4 rounded-xl border-2 border-canvas-border bg-canvas-card">
          <span className="text-[11px] font-bold text-canvas-muted uppercase tracking-wider block mb-1">
            Q27 • Too Expensive
          </span>
          <label className="block text-xs font-semibold text-brand-dark mb-2 min-h-[32px]">
            At what price would it become too expensive for you to consider buying?
          </label>
          <Input
            type="number"
            min={1}
            prefixText="₹"
            placeholder="e.g. 1199"
            value={tooExpensive !== undefined ? tooExpensive : ""}
            onChange={(e) => handleNumericChange("price_too_expensive", e.target.value)}
            error={errors.price_too_expensive}
          />
        </div>
      </div>
    </div>
  );
};
