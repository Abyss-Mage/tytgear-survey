import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] select-none";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 min-h-[38px]",
    md: "text-sm px-5 py-2.5 min-h-[46px]",
    lg: "text-base px-6 py-3.5 min-h-[52px]",
  };

  const variantStyles = {
    primary:
      "bg-brand text-canvas hover:bg-brand-hover active:bg-brand-dark shadow-sm hover:shadow-md",
    secondary:
      "bg-canvas-subtle text-brand-dark hover:bg-canvas-border active:bg-canvas-subtle",
    outline:
      "border-2 border-brand text-brand hover:bg-brand-50 active:bg-brand-100",
    ghost:
      "text-brand hover:bg-brand-50 active:bg-brand-100",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
