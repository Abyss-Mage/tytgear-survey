"use client";

import React from "react";
import { Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface MultiChoiceProps {
  options: (string | Option)[];
  values: string[];
  onChange: (values: string[]) => void;
  name: string;
  maxSelections?: number;
  exclusiveOptions?: string[];
  columns?: 1 | 2;
  instruction?: string;
}

export const MultiChoice: React.FC<MultiChoiceProps> = ({
  options,
  values = [],
  onChange,
  name,
  maxSelections,
  exclusiveOptions = ["None", "None of these"],
  columns = 1,
  instruction,
}) => {
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const checkIsOther = (opt: Option) =>
    opt.value.toLowerCase() === "other" ||
    opt.label.toLowerCase() === "other" ||
    opt.value.toLowerCase().startsWith("other (") ||
    opt.label.toLowerCase().startsWith("other (");

  const handleToggle = (opt: Option, isOther: boolean, currentOtherText: string) => {
    const isExclusive = exclusiveOptions.includes(opt.value);

    const isCurrentlySelected = isOther
      ? values.some((v) => v === opt.value || v.startsWith("Other: "))
      : values.includes(opt.value);

    if (isCurrentlySelected) {
      // Deselect
      if (isOther) {
        onChange(values.filter((v) => v !== opt.value && !v.startsWith("Other: ")));
      } else {
        onChange(values.filter((v) => v !== opt.value));
      }
      return;
    }

    const valueToAdd = isOther
      ? currentOtherText.trim()
        ? `Other: ${currentOtherText.trim()}`
        : "Other"
      : opt.value;

    if (isExclusive) {
      // Selecting exclusive option clears all others
      onChange([valueToAdd]);
      return;
    }

    // Selecting normal option removes any exclusive options
    const filtered = values.filter((v) => !exclusiveOptions.includes(v));

    if (maxSelections && filtered.length >= maxSelections) {
      // Reached limit: don't add more
      return;
    }

    onChange([...filtered, valueToAdd]);
  };

  const handleOtherTextChange = (opt: Option, newText: string) => {
    const newEntry = newText.trim() ? `Other: ${newText}` : "Other";
    const exists = values.some((v) => v === opt.value || v.startsWith("Other: "));
    if (exists) {
      onChange(
        values.map((v) => (v === opt.value || v.startsWith("Other: ") ? newEntry : v))
      );
    } else {
      onChange([...values.filter((v) => !exclusiveOptions.includes(v)), newEntry]);
    }
  };

  const isAtMax = maxSelections ? values.length >= maxSelections : false;

  return (
    <div>
      {/* Header instructions or selection count */}
      {(instruction || maxSelections) && (
        <div className="flex items-center justify-between mb-3 text-xs text-canvas-muted">
          <span>{instruction || (maxSelections ? `Select up to ${maxSelections}` : "Select all that apply")}</span>
          {maxSelections && (
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                values.length === maxSelections
                  ? "bg-brand-100 text-brand"
                  : "bg-canvas-subtle text-canvas-muted"
              }`}
            >
              {values.length} / {maxSelections} selected
            </span>
          )}
        </div>
      )}

      <div
        role="group"
        aria-label={name}
        className={`grid gap-2.5 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {normalizedOptions.map((opt) => {
          const isOther = checkIsOther(opt);
          const otherEntry = isOther
            ? values.find((v) => v === opt.value || v.startsWith("Other: "))
            : undefined;

          const isSelected = isOther ? Boolean(otherEntry) : values.includes(opt.value);
          const isDisabled = !isSelected && isAtMax;

          const otherText =
            otherEntry && otherEntry.startsWith("Other: ")
              ? otherEntry.slice(7)
              : "";

          return (
            <div key={opt.value} className="flex flex-col">
              <button
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => handleToggle(opt, isOther, otherText)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer ${
                  isSelected
                    ? "border-brand bg-brand-50/60 shadow-sm"
                    : isDisabled
                    ? "border-canvas-border/60 bg-canvas-subtle/50 opacity-40 cursor-not-allowed"
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
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? "border-brand bg-brand text-canvas"
                      : "border-canvas-border group-hover:border-brand-300 bg-canvas-card"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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
                    onChange={(e) => handleOtherTextChange(opt, e.target.value)}
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
    </div>
  );
};
