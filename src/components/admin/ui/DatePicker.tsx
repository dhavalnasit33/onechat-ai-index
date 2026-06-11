"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = value ? new Date(value) : undefined;
  
  const [currentView, setCurrentView] = React.useState(() => {
    return selectedDate && !isNaN(selectedDate.getTime()) 
      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) 
      : new Date();
  });

  const year = currentView.getFullYear();
  const month = currentView.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const handleSelectDay = (date: Date) => {
    // Avoid timezone offsets shifting selected date
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    const formatted = local.toISOString().split("T")[0];
    onChange?.(formatted);
    setOpen(false);
  };

  const nextMonth = () => {
    setCurrentView(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentView(new Date(year, month - 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate || isNaN(selectedDate.getTime())) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-left text-sm font-normal text-[var(--admin-text)] transition-all focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CalendarIcon className="h-4 w-4 text-[var(--admin-text-muted)]" />
          {value ? (
            new Date(value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          ) : (
            <span className="text-[var(--admin-text-dim)]">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--admin-border)] hover:bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-semibold text-[var(--admin-text)]">
              {monthNames[month]} {year}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--admin-border)] hover:bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[var(--admin-text-muted)] pb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-8 w-8" />;
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center cursor-pointer
                    ${isSelected(day)
                      ? "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)]"
                      : isToday(day)
                        ? "bg-[var(--admin-surface-3)] text-[var(--admin-text)] hover:bg-[var(--admin-surface-2)]"
                        : "text-[var(--admin-text)] hover:bg-[var(--admin-surface-2)]"
                    }
                  `}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
