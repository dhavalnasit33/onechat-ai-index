import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        className={`w-full min-h-[100px] px-3.5 py-2.5 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[var(--admin-radius-sm)] text-[var(--admin-text)] text-sm font-sans placeholder:text-[var(--admin-text-dim)] transition-all focus:border-[var(--admin-accent)] focus:shadow-[0_0_0_3px_var(--admin-accent-glow)] outline-none focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-vertical ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
