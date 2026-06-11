"use client";

import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export const AlertDialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-[#15151a]/40 backdrop-blur-sm transition-opacity duration-200 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out ${className}`}
    {...props}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

export const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <AlertDialogPrimitive.Content
        ref={ref}
        className={`relative w-full max-w-md bg-[var(--admin-surface)] border border-[var(--admin-border-subtle)] rounded-[var(--admin-radius)] shadow-[var(--admin-shadow-lg)] p-6 transition-all duration-200 data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out focus:outline-none ${className}`}
        {...props}
      />
    </div>
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export const AlertDialogHeader = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex flex-col space-y-2 text-left mb-6" {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={`text-lg font-bold text-[var(--admin-text)] ${className}`}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

export const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={`text-sm text-[var(--admin-text-muted)] ${className}`}
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

export const AlertDialogFooter = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex justify-end gap-3" {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

export const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={`inline-flex items-center justify-center rounded-[var(--admin-radius-sm)] px-4 py-2 text-sm font-semibold text-white bg-[var(--admin-danger)] hover:bg-[rgba(239,68,68,0.9)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--admin-danger)] focus:ring-offset-2 cursor-pointer ${className}`}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={`inline-flex items-center justify-center rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm font-semibold text-[var(--admin-text)] hover:bg-[var(--admin-surface-2)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] focus:ring-offset-2 cursor-pointer ${className}`}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
