"use client";

import React from "react";

interface Preset {
  label: string;
  min: number;
  max: number;
}

interface BudgetRangeSliderProps {
  label: string;
  description: string;
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  step?: number;
  presets?: Preset[];
  onChange: (minVal: number, maxVal: number) => void;
}

export const BudgetRangeSlider: React.FC<BudgetRangeSliderProps> = ({
  label,
  description,
  minValue,
  maxValue,
  min,
  max,
  step = 25,
  presets,
  onChange,
}) => {
  const minPercent = Math.min(100, Math.max(0, ((minValue - min) / (max - min)) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((maxValue - min) / (max - min)) * 100));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val <= maxValue) {
      onChange(val, maxValue);
    } else {
      onChange(maxValue, val);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val >= minValue) {
      onChange(minValue, val);
    } else {
      onChange(val, minValue);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border-2 border-canvas-border bg-canvas-card shadow-sm hover:border-brand-300 transition-colors space-y-4">
      {/* Header & Live Price Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-brand bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md inline-block mb-1">
            Budget Range
          </span>
          <h4 className="text-base font-bold text-brand-dark leading-snug">{label}</h4>
          <p className="text-xs text-canvas-muted mt-0.5 leading-relaxed">{description}</p>
        </div>

        {/* Live Currency Range Readout */}
        <div className="bg-brand-50 border-2 border-brand-200 px-4 py-2 rounded-2xl text-left sm:text-right flex-shrink-0">
          <span className="text-[11px] font-semibold text-brand-700 block">Your Budget Range</span>
          <span className="text-lg sm:text-xl font-mono font-black text-brand tracking-tight">
            ₹{minValue.toLocaleString("en-IN")} &ndash; ₹{maxValue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Dual Slider Control */}
      <div className="pt-2 space-y-2">
        <div className="relative h-7 flex items-center">
          {/* Background Track */}
          <div className="absolute w-full h-3 bg-canvas-subtle rounded-full border border-canvas-border" />

          {/* Highlighted Range Bar */}
          <div
            className="absolute h-3 bg-brand rounded-full transition-all duration-75"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(2, maxPercent - minPercent)}%`,
            }}
          />

          {/* Min Input Slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={handleMinChange}
            aria-label="Minimum budget"
            className="absolute w-full h-3 appearance-none bg-transparent pointer-events-none cursor-pointer z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-dark [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-canvas [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-dark [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-canvas [&::-moz-range-thumb]:shadow-md"
          />

          {/* Max Input Slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={handleMaxChange}
            aria-label="Maximum budget"
            className="absolute w-full h-3 appearance-none bg-transparent pointer-events-none cursor-pointer z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-canvas [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-canvas [&::-moz-range-thumb]:shadow-md"
          />
        </div>

        {/* Boundary & Helper Labels */}
        <div className="flex justify-between text-xs font-mono text-canvas-muted px-1">
          <span>₹{min.toLocaleString("en-IN")}</span>
          <span className="font-sans font-medium text-brand text-[11px]">
            Drag handles to expand or narrow your budget
          </span>
          <span>₹{max.toLocaleString("en-IN")}+</span>
        </div>
      </div>

      {/* Quick Budget Presets */}
      {presets && presets.length > 0 && (
        <div className="pt-2 border-t border-canvas-border/60">
          <div className="text-[11px] font-semibold text-canvas-muted mb-2">
            Or select a quick budget tier:
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => {
              const isActive = minValue === preset.min && maxValue === preset.max;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset.min, preset.max)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? "bg-brand text-canvas border-brand shadow-sm"
                      : "bg-canvas-subtle/70 text-brand-dark border-canvas-border hover:border-brand-300 hover:bg-canvas"
                  }`}
                >
                  {preset.label} (₹{preset.min}&ndash;₹{preset.max})
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
