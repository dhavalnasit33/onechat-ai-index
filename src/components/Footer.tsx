import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* GLOBAL JOURNALIST SECTION */}
      <section className="w-full bg-[#eaf2fb] border-y border-[#d7e3f0] py-[36px] md:py-[56px] px-[16px] md:px-[32px]">
        <div className="max-w-[1340px] px-4 mx-auto text-left">
          <div className="mb-[22px] md:mb-[36px] pb-[14px] md:pb-[16px] border-b border-[#d7e3f0]">
            <div>
              <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#1e3a5f] font-bold mb-[6px] md:mb-0">
                For Journalists & Researchers
              </div>
              <h2 className="font-serif text-[24px] md:text-[30px] font-normal tracking-[-0.015em] text-[#15151a] mb-[6px] leading-[1.15]">
                Use this data in your work.
              </h2>
              <p className="text-[13px] md:text-[14px] text-[#4a4a55] max-w-[1200px]">
                Every statistic, chart, and graphic in this index is free to use
                and cite, with full source attribution. Can’t easily find what
                you need? Use our search bar to search by keyword, topic, or
                category.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:max-w-[640px] md:mx-auto gap-[20px]">
            <div className="bg-white border border-[#d7e3f0] rounded-[6px] p-[22px] md:p-[26px] md:px-[28px] flex flex-col">
              <div className="text-[20px] md:text-[22px] leading-none mb-[12px]">
                ✉️
              </div>
              <div className="font-sans text-[13.5px] md:text-[14px] font-extrabold text-[#15151a] mb-[6px] tracking-[-0.005em]">
                Talk to our research team
              </div>
              <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.5] mb-[14px] md:mb-[16px] flex-1">
                Need a specific cut of data, an interview, or a quote? Email us
                — we typically respond within one business day.
              </div>
              <a
                href="mailto:research@aibehaviorindex.org"
                className="font-sans text-[11.5px] md:text-[12px] text-[#0468BD] font-bold no-underline break-all"
              >
                research@aibehaviorindex.org →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL METHODOLOGY SECTION */}
      <section className="w-full bg-white py-[28px] md:py-[48px] px-[16px] md:px-[32px] pb-[24px] md:pb-[32px]">
        <div className="max-w-[1340px] px-4 mx-auto ">
          <div className="bg-white border border-[#d7e3f0] rounded-[4px] py-[20px] px-[22px] md:py-[24px] md:px-[28px] text-left">
            <h2 className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-[8px]">
              How the data works
            </h2>
            <p className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] max-w-[900px]">
              Every statistic shown is sourced from a publicly available study,
              survey, or report. We aggregate, organize, and contextualize this
              data — but the underlying research is conducted by the cited
              sources. Click any source link to access the original methodology.
              If you run into any issues or have a study to suggest, contact us
              at{" "}
              <a
                href="mailto:research@aibehaviorindex.org"
                className="text-[#4a4a55] underline"
              >
                research@aibehaviorindex.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* SMALL FOOTER BAR */}
      <footer className="bg-white border-t border-[#d7e3f0] py-6 md:py-8 px-4 w-full">
        <div className="max-w-[1340px] mx-auto flex flex-wrap justify-center items-center gap-x-3 gap-y-2 font-sans text-[11px] md:text-[12px] text-[#8a8a95]">
          <Link
            href="/methodology/"
            className="hover:text-[#15151a] transition-colors no-underline
             relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] 
             after:w-0 after:-translate-x-1/2 after:bg-current after:transition-all after:duration-300 
             hover:after:w-full text-inherit"
          >
            Methodology
          </Link>
          <span className="select-none">·</span>
          <Link
            href="/for-journalists/"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit
              relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] 
             after:w-0 after:-translate-x-1/2 after:bg-current after:transition-all after:duration-300 
             hover:after:w-full 
            "
          >
            For Journalists
          </Link>
          <span className="select-none">·</span>
          <Link
            href="/privacy-policy/"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit 
              relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] 
             after:w-0 after:-translate-x-1/2 after:bg-current after:transition-all after:duration-300 
             hover:after:w-full "
          >
            Privacy Policy
          </Link>
          <span className="select-none">·</span>
          <Link
            href="/terms-of-service/"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit
              relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] 
             after:w-0 after:-translate-x-1/2 after:bg-current after:transition-all after:duration-300 
             hover:after:w-full 
            "
          >
            Terms of Service
          </Link>
          <span className="select-none">·</span>
          <a
            href="mailto:research@aibehaviorindex.org"
            className="hover:text-[#15151a] transition-colors no-underline text-inherit relative inline-block after:absolute after:left-1/2 after:bottom-0 after:h-[2px] 
             after:w-0 after:-translate-x-1/2 after:bg-current after:transition-all after:duration-300 
             hover:after:w-full"
          >
            Contact
          </a>
          <span className="select-none">·</span>
          <span>© 2026 AI Behavior Index</span>
        </div>
      </footer>
    </div>
  );
}
