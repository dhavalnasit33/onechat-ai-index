"use client";

import React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className = "", ...props }, ref) => (
  <SwitchPrimitive.Root
    className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--admin-accent)] data-[state=unchecked]:bg-[var(--admin-border)] ${className}`}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0`}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
