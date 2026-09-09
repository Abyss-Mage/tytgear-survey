import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder = "Select an option",
  id,
  className = "",
  disabled,
  value,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-brand-dark mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          disabled={disabled}
          className={`appearance-none block w-full rounded-xl border-2 transition-colors duration-150 py-3 pl-3.5 pr-10 text-sm bg-canvas-card focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand ${
            !value ? "text-canvas-muted" : "text-brand-dark font-medium"
          } ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-canvas-border hover:border-brand-300"
          } ${disabled ? "bg-canvas-subtle opacity-60 cursor-not-allowed" : ""} ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-brand-dark">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-canvas-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-canvas-muted">{helperText}</p>
      )}
    </div>
  );
};
