"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { DesignInfo } from "@/types/survey";

interface ImageChoiceProps {
  designs: DesignInfo[];
  mode: "single" | "multi";
  value?: string;
  values?: string[];
  maxSelections?: number;
  onSingleChange?: (val: string) => void;
  onMultiChange?: (vals: string[]) => void;
  instruction?: string;
}

export const ImageChoice: React.FC<ImageChoiceProps> = ({
  designs,
  mode,
  value,
  values = [],
  maxSelections,
  onSingleChange,
  onMultiChange,
  instruction,
}) => {
  const handleSelect = (id: string) => {
    if (mode === "single" && onSingleChange) {
      onSingleChange(id);
      return;
    }

    if (mode === "multi" && onMultiChange) {
      if (values.includes(id)) {
        onMultiChange(values.filter((v) => v !== id));
      } else {
        if (maxSelections && values.length >= maxSelections) {
          return;
        }
        onMultiChange([...values, id]);
      }
    }
  };

  const isAtMax = mode === "multi" && maxSelections ? values.length >= maxSelections : false;

  return (
    <div>
      {/* Header instructions */}
      {(instruction || (mode === "multi" && maxSelections)) && (
        <div className="flex items-center justify-between mb-3 text-xs text-canvas-muted">
          <span>{instruction || (maxSelections ? `Select up to ${maxSelections}` : "Choose your preferred design")}</span>
          {mode === "multi" && maxSelections && (
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {designs
          .filter((d) => d.active)
          .sort((a, b) => a.display_order - b.display_order)
          .map((design) => {
            const isSelected =
              mode === "single" ? value === design.name : values.includes(design.name);
            const isDisabled = mode === "multi" && !isSelected && isAtMax;

            return (
              <button
                key={design.id}
                type="button"
                role={mode === "single" ? "radio" : "checkbox"}
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => handleSelect(design.name)}
                className={`relative group text-left rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isSelected
                    ? "border-brand ring-2 ring-brand/30 shadow-card-hover scale-[1.02]"
                    : isDisabled
                    ? "border-canvas-border/60 opacity-40 cursor-not-allowed"
                    : "border-canvas-border hover:border-brand-400 hover:shadow-card bg-canvas-card"
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full bg-canvas-subtle overflow-hidden">
                  <Image
                    src={design.image_url}
                    alt={design.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Selection Indicator Badge */}
                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-brand bg-brand text-canvas shadow-md"
                        : "border-white/80 bg-black/30 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Neutral Label */}
                <div className="p-2.5 bg-canvas-card text-center border-t border-canvas-border/50">
                  <span
                    className={`block text-xs font-bold ${
                      isSelected ? "text-brand" : "text-brand-dark"
                    }`}
                  >
                    {design.name}
                  </span>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};
