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
        const isOther =
          opt.value.toLowerCase() === "other" ||
          opt.label.toLowerCase() === "other" ||
          opt.value.toLowerCase().startsWith("other (") ||
          opt.label.toLowerCase().startsWith("other (");

        const isSelected = isOther
          ? value === opt.value || (value ? value.startsWith("Other:") : false)
          : value === opt.value;

        const otherText =
          isOther && value && value.startsWith("Other: ")
            ? value.slice(7)
            : "";

        return (
          <div key={opt.value} className="flex flex-col">
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                if (isOther) {
                  onChange(otherText.trim() ? `Other: ${otherText.trim()}` : "Other");
                } else {
                  onChange(opt.value);
                }
              }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer ${
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

            {isSelected && isOther && (
              <div
                className="mt-2 pl-0.5 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => {
                    const text = e.target.value;
                    onChange(text.trim() ? `Other: ${text}` : "Other");
                  }}
                  placeholder="Please specify..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border-2 border-brand-300 bg-canvas-card text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-canvas-muted shadow-sm transition-all"
                  autoFocus
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

