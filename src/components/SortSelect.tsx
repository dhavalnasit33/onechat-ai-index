"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <div className="relative flex-1 md:flex-none min-w-[170px]">
      <select
        id="sort-select"
        defaultValue={defaultValue}
        onChange={(e) => {
          const url = new URL(window.location.href);
          url.searchParams.set("sort", e.target.value);
          url.searchParams.set("page", "1");
          window.location.href = url.toString();
        }}
        className="appearance-none w-full bg-white border border-[#D9D2FF] rounded-xl py-2 pl-4 pr-10 text-sm font-medium text-[#15151a] outline-none transition-all duration-200 cursor-pointer hover:border-[#6C56E5] focus:border-[#6C56E5] focus:ring-4 focus:ring-[#6C56E5]/10"
      >
        <option value="most-cited">Most cited</option>
        <option value="recent">Most recent</option>
        <option value="a-z">A–Z</option>
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C56E5] pointer-events-none"
      />
    </div>
  );
}
