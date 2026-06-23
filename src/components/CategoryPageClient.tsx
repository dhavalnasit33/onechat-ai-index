"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import InteractiveChart from "@/src/components/InteractiveChart";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

import { apiUrl } from "@/src/lib/basePath";
import RenderIcon from "./RenderIcon";

interface CategoryPageClientProps {
  category: any;
  initialCharts: any[];
  initialTotalCount: number;
  initialTotalPages: number;
}

export default function CategoryPageClient({
  category,
  initialCharts,
  initialTotalCount,
  initialTotalPages,
}: CategoryPageClientProps) {
  const [charts, setCharts] = useState(initialCharts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("most-cited");
  const [loading, setLoading] = useState(false);

  const initialRender = useRef(true);

  // Function to fetch data client-side
  const fetchCharts = async (
    page: number,
    searchQuery: string,
    sortOrder: string,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        q: searchQuery,
        sort: sortOrder,
      });
      const res = await fetch(
        apiUrl(`/api/categories/${category.slug}/charts?${params.toString()}`),
      );
      const json = await res.json();
      if (json.success) {
        setCharts(json.data);
        setTotalCount(json.totalCount);
        setTotalPages(json.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch charts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on submit or empty
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCharts(1, q, sort);
  };

  // Trigger search on input change with optional debounce or immediate on empty
  const handleSearchChange = (val: string) => {
    setQ(val);
    if (!val) {
      setCurrentPage(1);
      fetchCharts(1, "", sort);
    }
  };

  // Trigger sort change
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
    fetchCharts(1, q, newSort);
  };

  // Trigger page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    fetchCharts(newPage, q, sort);
    // Scroll to top of content
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const skip = (currentPage - 1) * 12;
  const limit = 12;

  return (
    <div className="bg-[#f0f0f0] md:bg-white text-[#15151a] font-serif min-h-screen flex justify-center md:block">
      {/* MOBILE WRAPPER */}
      <div className="w-full max-w-[380px] md:max-w-full bg-white min-h-screen shadow-[0_4px_24px_rgba(0,0,0,0.12)] md:shadow-none">
        {/* TOP NAV */}
        <Header activeTab="none" />

        {/* BREADCRUMB */}
        <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
          <div className="max-w-[1340px] px-4 mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95] text-left">
            <Link href="/" className="hover:text-[#15151a]">
              Home
            </Link>
            <span className="mx-1.5 md:mx-2 opacity-50">›</span>
            <span className="hidden md:inline">Browse by Category</span>
            <span className="md:hidden">Categories</span>
            <span className="mx-1.5 md:mx-2 opacity-50">›</span>
            <span className="text-[#15151a] font-semibold">
              {category.name}
            </span>
          </div>
        </div>

        {/* CATEGORY HEADER */}
        <section className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 pt-6 pb-7 md:pt-10 md:pb-11 text-left">
          <div className="max-w-[1340px] px-4 mx-auto">
            <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-3 md:mb-3.5">
              Category
            </div>
            <h1 className="font-serif text-[32px] md:text-[52px] leading-[1.05] font-bold tracking-[-0.02em] text-[#15151a] mb-3 md:mb-3.5 max-w-[880px]">
              Explore AI usage{" "}
              {category.name.toLowerCase().startsWith("by") ? "" : "by "}
              <em className="italic text-[#088DFF] font-bold not-italic">
                {category.name.toLowerCase()}.
              </em>
            </h1>
            <p className="text-[13.5px] md:text-base text-[#4a4a55] max-w-[760px] leading-[1.55]">
              {category.description} Browse in-depth topic articles, each citing
              original research.
            </p>
          </div>
        </section>

        {/* SEARCH + SORT TOOLBAR */}
        <div className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 py-3.5 md:py-5 sticky top-[53px] md:top-[57px] z-15">
          <div className="max-w-[1340px] px-4 mx-auto flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            {/* Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full md:flex-1 md:max-w-[560px]"
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8a8a95] pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={q}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full font-sans text-sm text-[#15151a] bg-[#eaf2fb] border border-[#d7e3f0] rounded-full py-2.5 md:py-[11px] pr-4 pl-10 outline-none transition-colors focus:border-[#088DFF] focus:bg-white placeholder:text-[#8a8a95]"
                placeholder={`Search within ${category.name} topics...`}
              />
            </form>

            <div className="hidden md:block w-px h-8 bg-[#d7e3f0] mx-1"></div>

            {/* Sort & Results */}
            <div className="flex items-center gap-2.5 md:gap-3 w-full md:w-auto">
              <span className="font-sans text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-[#8a8a95] font-bold whitespace-nowrap">
                Sort <span className="hidden md:inline">by</span>
              </span>

              <div className="relative flex-1 md:flex-none min-w-[170px]">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
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

              <div className="font-sans text-[11px] md:text-xs text-[#8a8a95] ml-auto whitespace-nowrap">
                <span className="hidden md:inline">Showing </span>
                <strong className="text-[#15151a] font-bold">
                  {totalCount === 0 ? 0 : skip + 1}–
                  {Math.min(skip + limit, totalCount)}
                </strong>{" "}
                of{" "}
                <strong className="text-[#15151a] font-bold">
                  {totalCount}
                </strong>
                <span className="hidden md:inline"> charts</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="max-w-[1600px] px-4 mx-auto py-4 md:py-8">
          {/* CHARTS GRID / SKELETON */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[14px] md:gap-[20px] mb-7 md:mb-10">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col h-full animate-pulse text-left"
                >
                  <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px]">
                    <div className="h-3 w-1/3 bg-[#eaf2fb] rounded mb-2"></div>
                    <div className="h-5 w-3/4 bg-[#eaf2fb] rounded mb-1.5"></div>
                  </div>
                  <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] h-[250px] flex flex-col justify-center items-center">
                    <div className="h-[200px] w-full bg-[#f8fafc] rounded"></div>
                  </div>
                  <div className="mt-auto px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center">
                    <div className="h-3 w-1/2 bg-[#d7e3f0] rounded"></div>
                    <div className="h-3 w-1/4 bg-[#d7e3f0] rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : charts.length === 0 ? (
            <div className="text-center py-20 text-[#8a8a95] font-sans">
              <p className="text-lg font-medium">
                No charts found matching your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[14px] md:gap-[20px] mb-7 md:mb-10">
              {charts.map((chart: any) => {
                const topic = chart.topicId as any;
                const chartLink = topic
                  ? `/${category.slug}/${topic.slug}/#chart-${chart.chartId}`
                  : "#";

                return (
                  <div
                    key={chart._id.toString()}
                    className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-[0_8px_24px_rgba(8,141,255,0.08)] hover:-translate-y-[2px] text-left"
                  >
                    <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
                      {/* Icon */}
                      <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none flex items-center justify-center w-[24px] h-[24px]">
                        <RenderIcon
                          icon={chart.icon || "📊"}
                          size={24}
                          className="text-[#8a8a95]"
                        />
                      </div>

                      {/* Category + Topic */}
                      <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2 max-w-[80%] md:max-w-[85%]">
                        {category.name} {topic ? `· ${topic.title}` : ""}
                      </div>

                      {/* Title */}
                      <Link
                        href={chartLink}
                        className="hover:text-[#6C56E5] transition-colors block"
                      >
                        <h2 className="font-serif text-[14px] md:text-[16px] font-bold text-[#15151a] leading-[1.2] tracking-[-0.01em] mb-1 max-w-[90%] md:max-w-[92%]">
                          {chart.title}
                        </h2>
                      </Link>

                      {/* Subtitle / Heading */}
                      {chart.heading && (
                        <h3 className="font-sans text-[12px] md:text-[13px] font-medium text-[#8a8a95] leading-[1.3] max-w-[90%] md:max-w-[92%]">
                          {chart.heading}
                        </h3>
                      )}
                    </div>

                    <Link
                      href={chartLink}
                      className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] h-[350px] flex flex-col justify-center"
                    >
                      <InteractiveChart
                        chartId={chart.chartId}
                        chartType={chart.chartType}
                        data={chart.data}
                        title={chart.title}
                      />
                    </Link>

                    {/* <div className="mt-auto px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                      <div className="flex-1 min-w-0 pr-4 text-left">
                        <div className="line-clamp-3 leading-[1.5] min-h-[45px] md:min-h-[48px]">
                          Source:{" "}
                          <span
                            className="font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: chart.sourceLine
                                ? chart.sourceLine
                                    .toLowerCase()
                                    .startsWith("source:")
                                  ? chart.sourceLine
                                      .substring(7)
                                      .replace(/OneChat AI/g, "AI Behavior Index")
                                      .trim()
                                  : chart.sourceLine.replace(
                                      /OneChat AI/g,
                                      "AI Behavior Index",
                                    )
                                : "Compiled by AI Behavior Index",
                            }}
                          />
                        </div>
                      </div>
                      <div className="font-serif text-[11px] tracking-[0.06em] uppercase font-bold text-[#1e3a5f] shrink-0 pt-[2px]">
                        <span className="text-[#6C56E5]">AI</span> Behavior Index
                      </div>
                    </div> */}
                    <div className="mt-auto px-[20px] md:px-[28px] py-[12px] md:py-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px]  h-[64px] overflow-hidden">
                      {/* text-[#8a8a95] */}
                      <div className="flex-1 pr-3 min-w-0">
                        <div
                          className="line-clamp-2 leading-[1.5]"
                          title="Click card to view full source details"
                        >
                          Source:{" "}
                          <span
                            className="font-semibold rich-text-content "
                            dangerouslySetInnerHTML={{
                              __html: (() => {
                                let raw =
                                  chart.sourceLine ||
                                  "Compiled by AI Behavior Index";

                                // 1. Rename old references
                                raw = raw.replace(
                                  /OneChat AI/g,
                                  "AI Behavior Index",
                                );

                                // 2. Remove leading "Source:" even if it's wrapped in HTML
                                raw = raw.replace(
                                  /^(<[^>]*>)*\s*source:\s*/i,
                                  "$1",
                                );

                                // 3. Look for an <a> tag anywhere in the string
                                const linkMatch =
                                  raw.match(/<a\b[^>]*>(.*?)<\/a>/i);

                                if (linkMatch) {
                                  // If a link exists, throw away the rest of the text and ONLY show the link!
                                  raw = linkMatch[0];
                                }

                                return raw;
                              })(),
                            }}
                          />
                        </div>
                      </div>
                      <div className="hidden md:block font-serif text-[11px] tracking-[0.06em] uppercase shrink-0 pt-0.5">
                        <strong className="font-bold not-italic text-[#6C56E5]">
                          AI
                        </strong>
                        <span className="text-[#1e3a5f] font-bold">
                          {" "}
                          Behavior Index
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <nav className="flex justify-center items-center gap-1 md:gap-1.5 py-5 md:py-6 pb-8 md:pb-10 font-sans">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-2.5 md:px-3 rounded-md text-[12.5px] md:text-[13px] text-[#8a8a95] font-semibold border border-transparent transition-all duration-150 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
              >
                ‹ Prev
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-2.5 md:px-3 rounded-md text-[12.5px] md:text-[13px] font-semibold border border-transparent transition-all duration-150 ${currentPage === pageNum ? "text-white bg-[#1e3a5f]" : "text-[#4a4a55] hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-2.5 md:px-3 rounded-md text-[12.5px] md:text-[13px] text-[#8a8a95] font-semibold border border-transparent transition-all duration-150 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
              >
                Next ›
              </button>
            </nav>
          )}
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
