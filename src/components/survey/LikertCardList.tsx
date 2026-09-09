"use client";

import React from "react";
import { ProductInfo, LikertRating } from "@/types/survey";

interface LikertCardListProps {
  products: ProductInfo[];
  ratings: Record<string, LikertRating>;
  onChange: (productId: string, rating: LikertRating) => void;
}

const LIKERT_OPTIONS: { value: LikertRating; label: string; shortLabel: string }[] = [
  { value: "Very interested", label: "Very interested", shortLabel: "Very Int." },
  { value: "Interested", label: "Interested", shortLabel: "Interested" },
  { value: "Neutral", label: "Neutral", shortLabel: "Neutral" },
  { value: "Not very interested", label: "Not very interested", shortLabel: "Not Very" },
  { value: "Not interested", label: "Not interested", shortLabel: "Not Int." },
];

export const LikertCardList: React.FC<LikertCardListProps> = ({
  products,
  ratings,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {products
        .filter((p) => p.active)
        .sort((a, b) => a.display_order - b.display_order)
        .map((product) => {
          const currentRating = ratings[product.id] || "Neutral";

          return (
            <div
              key={product.id}
              className="p-4 sm:p-5 rounded-2xl border-2 border-canvas-border bg-canvas-card shadow-sm hover:border-brand-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-brand-dark">
                    {product.name}
                  </h4>
                  {product.description && (
                    <p className="text-xs text-canvas-muted mt-0.5">
                      {product.description}
                    </p>
                  )}
                </div>
                <span className="text-[11px] font-medium text-brand bg-brand-50 px-2 py-0.5 rounded self-start sm:self-auto border border-brand-100">
                  {product.category}
                </span>
              </div>

              {/* Likert Selection Bar */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {LIKERT_OPTIONS.map((opt) => {
                  const isSelected = currentRating === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onChange(product.id, opt.value)}
                      title={opt.label}
                      className={`py-2 px-1 rounded-xl text-center transition-all duration-150 border flex flex-col items-center justify-center min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        isSelected
                          ? "bg-brand text-canvas font-semibold border-brand shadow-sm scale-[1.02]"
                          : "bg-canvas hover:bg-canvas-subtle text-brand-dark/80 border-canvas-border hover:border-brand-200"
                      }`}
                    >
                      <span className="hidden sm:inline text-xs leading-tight">
                        {opt.label}
                      </span>
                      <span className="sm:hidden text-[10px] leading-tight font-medium">
                        {opt.shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};
