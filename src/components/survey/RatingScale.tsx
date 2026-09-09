"use client";

import React from "react";

interface RatingScaleProps {
  value?: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export const RatingScale: React.FC<RatingScaleProps> = ({
  value,
  onChange,
  min = 0,
  max = 10,
  minLabel = "Definitely would not purchase",
  maxLabel = "Extremely likely to purchase",
}) => {
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full">
      {/* 0 to 10 Button Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2">
        {points.map((pt) => {
          const isSelected = value === pt;

          return (
            <button
              key={pt}
              type="button"
              onClick={() => onChange(pt)}
              className={`h-12 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-center border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isSelected
                  ? "bg-brand text-canvas border-brand shadow-sm scale-105"
                  : "bg-canvas-card text-brand-dark/90 border-canvas-border hover:border-brand-400 hover:bg-brand-50/40"
              }`}
            >
              {pt}
            </button>
          );
        })}
      </div>

      {/* Extreme Anchor Labels */}
      <div className="flex items-center justify-between text-xs text-canvas-muted mt-3 font-medium px-1">
        <span className="max-w-[45%] text-left">
          <strong className="text-brand-dark block sm:inline">0:</strong> {minLabel}
        </span>
        <span className="max-w-[45%] text-right">
          <strong className="text-brand-dark block sm:inline">10:</strong> {maxLabel}
        </span>
      </div>
    </div>
  );
};
