"use client";

import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className = "", align = "end", sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPortal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={`z-50 min-width-[140px] overflow-hidden rounded-[var(--admin-radius-sm)] border border-[var(--admin-border-subtle)] bg-[var(--admin-surface)] p-1.5 shadow-[var(--admin-shadow)] text-[var(--admin-text)] animate-scale-in focus:outline-none ${className}`}
      {...props}
    />
  </DropdownMenuPortal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className = "", ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-semibold rounded-[6px] cursor-pointer outline-none transition-colors data-[highlighted]:bg-[var(--admin-surface-2)] data-[highlighted]:text-[var(--admin-accent)] focus:bg-[var(--admin-surface-2)] focus:text-[var(--admin-accent)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
