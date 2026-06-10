import React from "react";
import Link from "next/link";

interface HeaderProps {
  activeTab?: "home" | "methodology" | "for-journalists" | "none";
}

export default function Header({ activeTab = "none" }: HeaderProps) {
  return (
    <header className="border-b border-[#d7e3f0] bg-white sticky top-0 z-50 w-full">
      <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between relative">
        {/* LOGO */}
        <div className="font-serif text-[12px] md:text-[14px] tracking-[0.06em] md:tracking-[0.08em] uppercase text-[#15151a] font-bold">
          <Link
            href="/"
            className="flex flex-col md:flex-row md:items-baseline no-underline text-inherit"
          >
            AI Behavior Index
            <span className="text-[#8a8a95] font-normal tracking-[0.04em] text-[10px] md:text-[12px] md:ml-1.5 normal-case mt-[2px] md:mt-0 block md:inline">
              by OneChat AI
            </span>
          </Link>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex gap-7 font-sans text-[13px] text-[#4a4a55] items-center">
          <Link
            href="/"
            className={`hover:text-[#15151a] transition-colors ${
              activeTab === "home" ? "text-[#15151a] font-semibold" : ""
            }`}
          >
            Explore
          </Link>
          <Link
            href="/methodology/"
            className={`hover:text-[#15151a] transition-colors ${
              activeTab === "methodology" ? "text-[#15151a] font-semibold" : ""
            }`}
          >
            Methodology
          </Link>
          <Link
            href="/for-journalists/"
            className={`hover:text-[#15151a] transition-colors ${
              activeTab === "for-journalists" ? "text-[#15151a] font-semibold" : ""
            }`}
          >
            For Journalists
          </Link>
          <a
            href="/app"
            className="bg-[#6C56E5] hover:bg-[#5b46d6] text-white px-4 py-2 rounded-md font-semibold text-[13px] md:text-[14px] transition-colors ml-2 no-underline"
          >
            Try OneChat AI
          </a>
        </nav>

        {/* MOBILE HAMBURGER MENU (CSS-only details/summary dropdown) */}
        <details className="md:hidden relative group">
          <summary className="list-none [&::-webkit-details-marker]:hidden text-[#15151a] text-[22px] leading-none px-2 py-1 cursor-pointer outline-none flex items-center justify-center select-none">
            ☰
          </summary>
          {/* Dropdown Menu */}
          <div className="absolute top-[120%] right-0 mt-1 w-[220px] bg-white border border-[#d7e3f0] rounded-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
            <nav className="flex flex-col font-sans text-[14px] text-[#4a4a55]">
              <Link
                href="/"
                className={`px-5 py-4 border-b border-[#eaf2fb] hover:bg-[#f9fbfd] hover:text-[#15151a] transition-colors no-underline ${
                  activeTab === "home" ? "text-[#15151a] font-semibold bg-[#f9fbfd]" : ""
                }`}
              >
                Explore
              </Link>
              <Link
                href="/methodology/"
                className={`px-5 py-4 border-b border-[#eaf2fb] hover:bg-[#f9fbfd] hover:text-[#15151a] transition-colors no-underline ${
                  activeTab === "methodology" ? "text-[#15151a] font-semibold bg-[#f9fbfd]" : ""
                }`}
              >
                Methodology
              </Link>
              <Link
                href="/for-journalists/"
                className={`px-5 py-4 border-b border-[#eaf2fb] hover:bg-[#f9fbfd] hover:text-[#15151a] transition-colors no-underline ${
                  activeTab === "for-journalists" ? "text-[#15151a] font-semibold bg-[#f9fbfd]" : ""
                }`}
              >
                For Journalists
              </Link>
              <a
                href="/app"
                className="px-5 py-4 hover:bg-[#f9fbfd] hover:text-[#6C56E5] text-[#6C56E5] font-semibold transition-colors no-underline"
              >
                Try OneChat AI
              </a>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
