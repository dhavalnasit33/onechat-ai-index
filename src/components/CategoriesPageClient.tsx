"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import RenderIcon from "@/src/components/RenderIcon";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  topicCount: number;
}

interface CategoriesPageClientProps {
  categories: Category[];
}

// ─── Main Client Component ────────────────────────────────────────
export default function CategoriesPageClient({
  categories,
}: CategoriesPageClientProps) {
  const [query, setQuery] = useState("");

  // Client-side filter — instant, no network round-trip needed
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.description ?? "").toLowerCase().includes(q)
    );
  }, [query, categories]);

  const handleClear = () => setQuery("");

  return (
    <>
      {/* ── SEARCH BAR ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 py-3.5 md:py-5 sticky top-[53px] md:top-[57px] z-10">
        <div className="max-w-[1340px] px-4 mx-auto flex items-center gap-3 md:gap-4">
          <div className="relative w-full max-w-[520px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a95] pointer-events-none">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full font-sans text-sm text-[#15151a] bg-[#eaf2fb] border border-[#d7e3f0] rounded-full py-2.5 md:py-[11px] pl-10 pr-9 outline-none transition-colors focus:border-[#088DFF] focus:bg-white placeholder:text-[#8a8a95]"
              placeholder="Search categories — e.g. &quot;industry&quot;, &quot;age group&quot;…"
              aria-label="Search categories"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a8a95] hover:text-[#15151a] transition-colors"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Result count */}
          <span className="hidden md:inline font-sans text-[12px] text-[#8a8a95] whitespace-nowrap shrink-0">
            {query ? (
              <>
                <strong className="text-[#15151a]">{filtered.length}</strong> of{" "}
                <strong className="text-[#15151a]">{categories.length}</strong> categories
              </>
            ) : (
              <>
                <strong className="text-[#15151a]">{categories.length}</strong> categories
              </>
            )}
          </span>
        </div>
      </div>

      {/* ── GRID ───────────────────────────────────────────────── */}
      <main className="max-w-[1340px] mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] md:gap-[20px]">
          {filtered.length > 0 ? (
            filtered.map((cat) => (
              <Link
                href={`/${cat.slug}/`}
                key={cat._id}
                className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] cursor-pointer transition-all duration-200 flex flex-col min-h-auto md:min-h-[220px] hover:border-[#088DFF] hover:shadow-[0_8px_24px_rgba(8,141,255,0.1)] hover:-translate-y-[2px] text-left no-underline group"
              >
                <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px] flex items-center justify-start h-[28px] text-[#0468BD]">
                  <RenderIcon icon={cat.iconUrl} size={28} />
                </div>
                <h2 className="font-serif text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-[6px] leading-[1.2] group-hover:text-[#088DFF] transition-colors">
                  {cat.name}
                </h2>
                <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-[14px] md:mb-[18px] flex-1">
                  {cat.description}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold">
                    Explore →
                  </span>
                  {cat.topicCount > 0 && (
                    <span className="font-sans text-[10.5px] md:text-[11px] text-[#8a8a95] uppercase tracking-[0.12em] font-semibold">
                      {cat.topicCount} topic{cat.topicCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </Link>
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-20 text-[#8a8a95] font-sans">
              <p className="text-lg font-medium mb-1">
                No categories match &ldquo;{query}&rdquo;
              </p>
              <p className="text-sm">
                <button
                  onClick={handleClear}
                  className="text-[#0468BD] hover:underline font-medium"
                >
                  Clear search
                </button>{" "}
                to see all categories.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}