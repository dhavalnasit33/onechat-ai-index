"use client";

import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

export const Checkbox = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className = "", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`peer h-[18px] w-[18px] shrink-0 rounded-[4px] border border-[var(--admin-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--admin-accent)] data-[state=checked]:border-[var(--admin-accent)] data-[state=checked]:text-white transition-colors cursor-pointer ${className}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-3.5 w-3.5 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
