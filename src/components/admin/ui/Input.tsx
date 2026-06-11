import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={`w-full px-3.5 py-2.5 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[var(--admin-radius-sm)] text-[var(--admin-text)] text-sm font-sans placeholder:text-[var(--admin-text-dim)] transition-all focus:border-[var(--admin-accent)] focus:shadow-[0_0_0_3px_var(--admin-accent-glow)] outline-none focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
