"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, Layers, Maximize2, Sparkles, Shield } from "lucide-react";

interface ProductDesign {
  name: string;
  imageSrc: string;
  tag?: string;
}

interface ProductSpecProps {
  title: string;
  category: string;
  imageSrc: string;
  designs?: ProductDesign[];
  dimensions?: string;
  surface: string;
  thickness?: string;
  edge: string;
  base: string;
  features: string[];
}

export const ProductSpecCard: React.FC<ProductSpecProps> = ({
  title,
  category,
  imageSrc,
  designs,
  dimensions,
  surface,
  thickness,
  edge,
  base,
  features,
}) => {
  const [selectedDesignIdx, setSelectedDesignIdx] = React.useState(0);
  const activeImage = designs && designs.length > 0 ? designs[selectedDesignIdx].imageSrc : imageSrc;
  const activeDesignName = designs && designs.length > 1 ? designs[selectedDesignIdx].name : null;

  return (
    <div className="p-4 sm:p-6 rounded-2xl border-2 border-brand-200 bg-canvas-card shadow-sm space-y-4">
      {/* Design Switcher Tabs if multiple designs are present */}
      {designs && designs.length > 1 && (
        <div className="flex items-center gap-2 pb-1 border-b border-canvas-border overflow-x-auto">
          <span className="text-[11px] font-bold text-canvas-muted uppercase tracking-wider mr-1 flex-shrink-0">
            Preview Design:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {designs.map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDesignIdx(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedDesignIdx === idx
                    ? "bg-brand text-white shadow-sm"
                    : "bg-canvas-subtle text-brand-dark/80 hover:bg-brand-50 hover:text-brand border border-canvas-border"
                }`}
              >
                <span>{d.name}</span>
                {d.tag && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    selectedDesignIdx === idx ? "bg-white/20 text-white" : "bg-brand-100 text-brand-800"
                  }`}>
                    {d.tag}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="relative w-full sm:w-56 h-44 sm:h-40 flex-shrink-0 bg-canvas-subtle rounded-xl overflow-hidden border border-canvas-border shadow-inner">
          <Image
            src={activeImage}
            alt={activeDesignName || title}
            fill
            sizes="(max-width: 640px) 100vw, 250px"
            className="object-cover transition-opacity duration-200"
            priority
          />
          {dimensions && (
            <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded shadow">
              {dimensions}
            </span>
          )}
          {activeDesignName && (
            <span className="absolute top-2 left-2 text-[10px] font-bold bg-brand-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded shadow">
              {activeDesignName}
            </span>
          )}
        </div>

        <div className="flex-1 text-left">
          <span className="text-[11px] font-semibold text-brand bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 inline-block mb-1">
            {category}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-brand-dark leading-snug">
            {title}
          </h3>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-brand-dark/90">
            {dimensions && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                <span><strong>Size:</strong> {dimensions}</span>
              </div>
            )}
            {thickness && (
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                <span><strong>Thickness:</strong> {thickness}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span><strong>Surface:</strong> {surface}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand flex-shrink-0" />
              <span><strong>Base:</strong> {base}</span>
            </div>
            {edge && (
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <Layers className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                <span><strong>Edge / Finish:</strong> {edge}</span>
              </div>
            )}
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
