"use client";

import React from "react";

interface PriceSliderProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  accentColor?: string;
  badgeText?: string;
}

export const PriceSlider: React.FC<PriceSliderProps> = ({
  label,
  description,
  value,
  min,
  max,
  step = 25,
  onChange,
  badgeText,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="p-4 sm:p-5 rounded-2xl border-2 border-canvas-border bg-canvas-card shadow-sm hover:border-brand-300 transition-colors space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          {badgeText && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-brand bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md inline-block mb-1">
              {badgeText}
            </span>
          )}
          <h4 className="text-sm font-bold text-brand-dark leading-tight">{label}</h4>
          <p className="text-xs text-canvas-muted mt-0.5 leading-relaxed">{description}</p>
        </div>

        {/* Live Currency Display */}
        <div className="bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-xl text-right flex-shrink-0">
          <span className="text-xs font-semibold text-brand-600 block">Your Price</span>
          <span className="text-base sm:text-lg font-mono font-extrabold text-brand">
            ₹{value.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Slider Track and Thumb */}
      <div className="pt-2">
        <div className="relative flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2.5 bg-canvas-subtle rounded-lg appearance-none cursor-pointer accent-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            style={{
              background: `linear-gradient(to right, #4F766F 0%, #4F766F ${percentage}%, #DCD8CC ${percentage}%, #DCD8CC 100%)`,
            }}
          />
        </div>

        {/* Range boundary labels */}
        <div className="flex justify-between text-[11px] font-mono text-canvas-muted mt-1.5 px-0.5">
          <span>₹{min.toLocaleString("en-IN")}</span>
          <span className="font-sans font-medium text-brand-700">Slide to adjust</span>
          <span>₹{max.toLocaleString("en-IN")}+</span>
        </div>
      </div>
    </div>
  );
};
