"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, Layers, Maximize2, Sparkles, Shield } from "lucide-react";

interface ProductSpecProps {
  title: string;
  category: string;
  imageSrc: string;
  dimensions: string;
  surface: string;
  thickness: string;
  edge: string;
  base: string;
  features: string[];
}

export const ProductSpecCard: React.FC<ProductSpecProps> = ({
  title,
  category,
  imageSrc,
  dimensions,
  surface,
  thickness,
  edge,
  base,
  features,
}) => {
  return (
    <div className="p-4 sm:p-6 rounded-2xl border-2 border-brand-200 bg-canvas-card shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="relative w-full sm:w-48 h-36 flex-shrink-0 bg-canvas-subtle rounded-xl overflow-hidden border border-canvas-border shadow-inner">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 200px"
            className="object-cover"
            priority
          />
          <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded">
            {dimensions}
          </span>
        </div>

        <div className="flex-1 text-left">
          <span className="text-[11px] font-semibold text-brand bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 inline-block mb-1">
            {category}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-brand-dark leading-snug">
            {title}
          </h3>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-brand-dark/90">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span><strong>Size:</strong> {dimensions}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span><strong>Thickness:</strong> {thickness}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span><strong>Surface:</strong> {surface}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span><strong>Base:</strong> {base}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Bullets */}
      <div className="pt-3 border-t border-canvas-border/70 flex flex-wrap gap-2 text-xs text-canvas-muted">
        {features.map((feat, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 bg-canvas-subtle/70 px-2.5 py-1 rounded-md text-brand-dark font-medium"
          >
            <CheckCircle2 className="w-3 h-3 text-brand" />
            <span>{feat}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
