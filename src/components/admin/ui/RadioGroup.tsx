"use client";

import React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

export const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className = "", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={`grid gap-2 ${className}`}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className = "", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={`aspect-square h-4.5 w-4.5 rounded-full border border-[var(--admin-border)] text-[var(--admin-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--admin-accent)] transition-colors cursor-pointer ${className}`}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center relative after:content-[''] after:block after:w-2 after:height-2 after:rounded-full after:bg-[var(--admin-accent)]" />
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
