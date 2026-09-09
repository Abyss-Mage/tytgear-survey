import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  prefixText,
  id,
  className = "",
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-brand-dark mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {prefixText && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-canvas-muted font-medium text-sm">
            {prefixText}
          </div>
        )}
        <input
          id={inputId}
          disabled={disabled}
          className={`block w-full rounded-xl border-2 transition-colors duration-150 py-3 text-sm text-brand-dark placeholder:text-canvas-muted bg-canvas-card focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand ${
            prefixText ? "pl-9 pr-3.5" : "px-3.5"
          } ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-canvas-border hover:border-brand-300"
          } ${disabled ? "bg-canvas-subtle opacity-60 cursor-not-allowed" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-canvas-muted">{helperText}</p>
      )}
    </div>
  );
};
