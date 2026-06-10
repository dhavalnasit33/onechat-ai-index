import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#d7e3f0] py-6 md:py-9 px-4 md:px-8 pb-8 md:pb-9 w-full">
      <div className="max-w-[1340px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-sans text-[11px] md:text-[12px] text-[#8a8a95]">
        {/* PUBLISHER INFO */}
        <div className="text-[#4a4a55] text-center md:text-left leading-[1.5]">
          Published by{" "}
          <a
            href="https://onechatai.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#15151a] font-semibold no-underline hover:text-[#6C56E5] transition-colors"
          >
            OneChat AI
          </a>{" "}
          <span className="hidden md:inline">
            — Your Personalized AI Super App, Curated for You
          </span>
        </div>

        {/* FOOTER NAV LINKS */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-6">
          <Link
            href="/methodology/"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit"
          >
            Methodology
          </Link>
          <Link
            href="/for-journalists/"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit"
          >
            For Journalists
          </Link>
          <a
            href="#"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
