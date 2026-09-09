"use client";

import React from "react";
import { Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SingleChoiceProps {
  options: (string | Option)[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
  columns?: 1 | 2;
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({
  options,
  value,
  onChange,
  name,
  columns = 1,
}) => {
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={`grid gap-2.5 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
    >
      {normalizedOptions.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              isSelected
                ? "border-brand bg-brand-50/60 shadow-sm"
                : "border-canvas-border bg-canvas-card hover:border-brand-300 hover:bg-canvas-card"
            }`}
          >
            <div className="flex-1 pr-3">
              <span
                className={`block text-sm font-semibold leading-snug ${
                  isSelected ? "text-brand-dark" : "text-brand-dark/90"
                }`}
              >
                {opt.label}
              </span>
              {opt.description && (
                <span className="block text-xs text-canvas-muted mt-0.5">
                  {opt.description}
                </span>
              )}
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected
                  ? "border-brand bg-brand text-canvas"
                  : "border-canvas-border group-hover:border-brand-300 bg-canvas-card"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};
