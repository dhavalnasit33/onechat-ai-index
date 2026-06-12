import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#d7e3f0] py-6 md:py-8 px-4 w-full">
      <div className="max-w-[1340px] mx-auto flex flex-wrap justify-center items-center gap-x-3 gap-y-2 font-sans text-[11px] md:text-[12px] text-[#8a8a95]">
        <Link
          href="/methodology/"
          className="hover:text-[#15151a] transition-colors no-underline text-inherit"
        >
          Methodology
        </Link>
        <span className="select-none">·</span>
        <Link
          href="/for-journalists/"
          className="hover:text-[#15151a] transition-colors no-underline text-inherit"
        >
          For Journalists
        </Link>
        <span className="select-none">·</span>
        <a
          href="mailto:research@aibehaviorindex.org"
          className="hover:text-[#15151a] transition-colors no-underline text-inherit"
        >
          Contact
        </a>
        <span className="select-none">·</span>
        <span>© 2026 AI Behavior Index</span>
      </div>
    </footer>
  );
}
