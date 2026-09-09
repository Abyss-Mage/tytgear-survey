import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  selected = false,
  interactive = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 bg-canvas-card p-4 sm:p-6 ${
        selected
          ? "border-brand bg-brand-50/40 shadow-sm"
          : "border-canvas-border shadow-card"
      } ${
        interactive
          ? "cursor-pointer hover:border-brand-400 hover:shadow-card-hover active:scale-[0.99]"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
