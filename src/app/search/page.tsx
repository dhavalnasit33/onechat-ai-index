import React from "react";
import { Metadata } from "next";
import { Search, X, ChevronDown } from "lucide-react";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";
import Chart from "@/src/models/Chart";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import RenderIcon from "@/src/components/RenderIcon";
import InteractiveChart from "@/src/components/InteractiveChart";
import { EXCLUDED_DISPLAY_CHART_TYPES } from "@/src/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";
  return {
    title:
      "Search for AI Research, Data, Charts & Statistics - AI Behavior Index.",
    description:
      "Search the AI Behavior Index for research, data, charts, and statistics on AI adoption and use. Find the AI numbers you need — free to view, download, and embed.",
    alternates: {
      canonical: q
        ? `${baseUrl}/ai-behavior-index/search/?q=${encodeURIComponent(q)}`
        : `${baseUrl}/ai-behavior-index/search/`,
    },
  };
}

interface PageProps {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  await dbConnect();

  // Ensure Category schema is registered with Mongoose so populate can find it
  const _dummyCategory = Category.modelName;

  const { q = "", sort = "relevance", page = "1" } = await searchParams;

  const limit = 12; // Adjusted to 12 so the grid of 3 looks balanced
  const currentPage = parseInt(page) || 1;
  const skip = (currentPage - 1) * limit;

  let totalCount = 0;
  let charts: any[] = [];

  // 1. Build the search filter
  const chartFilter: any = {
    status: "active",
    chartType: { $nin: EXCLUDED_DISPLAY_CHART_TYPES },
  };

  if (q) {
    // Split the query into individual keywords
    const keywords = q
      .trim()
      .split(/\s+/)
      .filter((k) => k.length > 1);

    if (keywords.length > 0) {
      // Create regexes for each keyword
      const regexes = keywords.map(
        (k) => new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      );

      // Find any Topics whose title matches ANY of the keywords
      const matchedTopics = await Topic.find(
        { status: "published", $or: regexes.map((re) => ({ title: re })) },
        "_id",
      ).lean();
      const matchedTopicIds = matchedTopics.map((t: any) => t._id);

      // Filter charts: chart title matches ANY keyword OR chart belongs to matched topic
      chartFilter.$or = [
        ...regexes.map((re) => ({ title: re })),
        ...regexes.map((re) => ({ heading: re })),
        { topicId: { $in: matchedTopicIds } },
      ];
    }
  }

  // 2. Build the Sort logic
  let sortObj: any = { createdAt: -1 }; // Default to most recent for relevance
  if (sort === "a-z") {
    sortObj = { title: 1 };
  }

  // 3. Fetch the Charts
  totalCount = await Chart.countDocuments(chartFilter);
  const rawCharts = await Chart.find(chartFilter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "topicId",
      populate: { path: "categoryId" },
    })
    .lean();

  // Serialize to prevent Next.js client-component ObjectID errors
  charts = JSON.parse(JSON.stringify(rawCharts));

  const totalPages = Math.ceil(totalCount / limit);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/ai-behavior-index/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Search Results",
        item: `${baseUrl}/ai-behavior-index/search/?q=${encodeURIComponent(q)}`,
      },
    ],
  };

  return (
    <div className="bg-[#f0f0f0] md:bg-white text-[#15151a] font-serif min-h-screen flex justify-center md:block">
      {/* SEO Schema Markups */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* MOBILE WRAPPER */}
      <div className="w-full bg-white min-h-screen shadow-[0_4px_24px_rgba(0,0,0,0.12)] md:shadow-none">
        {/* TOP NAV */}
        <Header activeTab="none" />

        {/* BREADCRUMB */}
        <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
          <div className="max-w-[1340px] px-4 mx-auto font-sans text-[11px] md:text-[12px] text-[#8a8a95] text-left">
            <a
              href="/ai-behavior-index/"
              className="hover:text-[#15151a] transition-colors"
            >
              Home
            </a>
            <span className="mx-1.5 md:mx-2 opacity-50">›</span>
            <span className="text-[#15151a] font-semibold">Search results</span>
          </div>
        </div>

        {/* SEARCH HEADER */}
        <section className="bg-white border-b border-[#eaf2fb] px-4 md:px-8 pt-5 pb-4 md:pt-8 md:pb-[22px] text-left">
          <div className="max-w-[1340px] px-4 mx-auto">
            <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#6C56E5] font-bold mb-[10px] md:mb-[12px]">
              Search results
            </div>
            <h1 className="font-serif text-[24px] md:text-[36px] leading-[1.15] md:leading-[1.1] font-normal tracking-[-0.015em] text-[#15151a] mb-[6px] md:mb-1">
              Results for{" "}
              <span className="font-bold text-[#6C56E5]">
                "{q || "All charts"}"
              </span>
            </h1>
            <p className="font-sans text-[12px] md:text-[13px] text-[#8a8a95]">
              <span className="hidden md:inline">Showing </span>
              <strong className="text-[#15151a] font-semibold">
                {totalCount === 0 ? 0 : skip + 1}–
                {Math.min(skip + limit, totalCount)}
              </strong>{" "}
              of{" "}
              <strong className="text-[#15151a] font-semibold">
                {totalCount}
              </strong>{" "}
              matching charts{" "}
              <span className="hidden md:inline">across all categories.</span>
            </p>
          </div>
        </section>

        {/* SEARCH TOOLBAR */}
        <div className="bg-white border-b border-[#d7e3f0] px-4 py-[14px] md:px-8 md:py-[18px] sticky top-[53px] md:top-[57px] z-15">
          <div className="max-w-[1340px] px-4 mx-auto flex flex-col md:flex-row md:items-center gap-[12px] md:gap-4 flex-wrap">
            {/* Input Wrap */}
            <form
              action="/ai-behavior-index/search/"
              method="GET"
              className="relative w-full md:flex-1 md:max-w-[640px]"
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8a8a95] pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                name="q"
                defaultValue={q}
                className="w-full font-sans text-[14px] text-[#15151a] bg-[#eaf2fb] border border-[#d7e3f0] rounded-full py-[11px] pl-[40px] md:pl-[42px] pr-[40px] md:pr-[44px] outline-none transition-colors focus:border-[#088DFF] focus:bg-white"
                placeholder="Search all charts…"
              />
              <input type="hidden" name="sort" value={sort} />
              {q && (
                <a
                  href="/ai-behavior-index/search/"
                  className="absolute right-[12px] md:right-[14px] top-1/2 -translate-y-1/2 text-[#8a8a95] hover:bg-[#eaf2fb] hover:text-[#15151a] p-1 rounded-full transition-colors leading-none"
                >
                  <X size={14} strokeWidth={2.5} />
                </a>
              )}
            </form>

            <div className="hidden md:block w-px h-8 bg-[#d7e3f0] mx-1 align-self-stretch"></div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-[10px] md:gap-4 w-full md:w-auto">
              <span className="font-sans text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-[#8a8a95] font-bold whitespace-nowrap">
                Sort <span className="hidden md:inline">by</span>
              </span>
              <div className="relative min-w-[180px]">
                <select
                  id="sort-select"
                  defaultValue={sort}
                  className="appearance-none w-full bg-white border-2 border-[#D9D2FF] rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 outline-none transition-all duration-200 hover:border-[#6C56E5] focus:border-[#6C56E5] focus:ring-4 focus:ring-[#6C56E5]/10 cursor-pointer"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="recent">Most Recent</option>
                  <option value="a-z">A → Z</option>
                </select>

                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C56E5] pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="p-[16px] md:p-[32px]">
          <div className="max-w-[1600px] px-4 mx-auto ">
            <section className="mb-0 md:mb-8">
              {charts.length === 0 ? (
                <div className="text-center py-20 text-[#8a8a95] font-sans">
                  <p className="text-lg font-medium">No charts found.</p>
                  <p className="text-sm mt-1">
                    Try searching for other keywords like "Gen Z", "Adoption",
                    or "ChatGPT".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] md:gap-[20px]">
                  {charts.map((chart: any) => {
                    const topic = chart.topicId;
                    const category = topic?.categoryId;
                    const categoryName = category?.name || "Insight";

                    const chartLink =
                      category?.slug && topic?.slug
                        ? `/ai-behavior-index/${category.slug}/${topic.slug}/#chart-${chart.chartId}`
                        : "#";

                    return (
                      <div
                        key={chart._id.toString()}
                        className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_8px_24px_rgba(8,141,255,0.08)] hover:-translate-y-[2px] text-left"
                      >
                        <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
                          <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none flex items-center justify-center w-[24px] h-[24px]">
                            <RenderIcon
                              icon={chart.icon || "📊"}
                              size={24}
                              className="text-[#8a8a95]"
                            />
                          </div>
                          <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2 max-w-[80%] md:max-w-[85%]">
                            {categoryName} {topic ? `· ${topic.title}` : ""}
                          </div>
                          <a
                            href={chartLink}
                            className="hover:text-[#088DFF] transition-colors block"
                          >
                            <h3 className="font-serif text-[14px] md:text-[16px] font-bold text-[#15151a] leading-[1.2] tracking-[-0.01em] mb-1 max-w-[90%] md:max-w-[92%]">
                              {chart.title}
                            </h3>
                          </a>

                          {/* Heading / Subtitle (Smaller/Gray) */}
                          {chart.heading && (
                            <h4 className="font-sans text-[12px] md:text-[13px] font-medium text-[#8a8a95] leading-[1.3] mb-2 max-w-[92%]">
                              {chart.heading}
                            </h4>
                          )}
                        </div>

                        {/* Interactive Chart Box linked to Topic page */}
                        <a
                          href={chartLink}
                          className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] h-[350px] flex flex-col justify-center block"
                        >
                          <InteractiveChart
                            chartId={chart.chartId}
                            chartType={chart.chartType}
                            data={chart.data}
                            title={chart.title}
                          />
                        </a>

                        <div className="mt-auto px-[20px] md:px-[28px] py-[12px] md:py-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95] h-[64px] overflow-hidden">
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
                                    raw = raw.replace(
                                      /OneChat AI/g,
                                      "AI Behavior Index",
                                    );
                                    raw = raw.replace(
                                      /^(<[^>]*>)*\s*source:\s*/i,
                                      "$1",
                                    );
                                    const linkMatch =
                                      raw.match(/<a\b[^>]*>(.*?)<\/a>/i);
                                    if (linkMatch) {
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
            </section>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <nav className="flex justify-center items-center gap-2 py-8 font-sans">
                {/* Previous */}
                <a
                  href={
                    currentPage > 1
                      ? `?page=${currentPage - 1}&q=${q}&sort=${sort}`
                      : "#"
                  }
                  className={`inline-flex items-center justify-center h-10 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-[#6C56E5] border border-[#D9D2FF] hover:bg-[#F4F1FF]"
                  }`}
                >
                  ← <span className="hidden md:inline ml-2">Previous</span>
                </a>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;

                  return (
                    <a
                      key={pageNum}
                      href={`?page=${pageNum}&q=${q}&sort=${sort}`}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-[#6C56E5] text-white shadow-md shadow-[#6C56E5]/30"
                          : "text-gray-700 border border-[#E5E7EB] hover:border-[#6C56E5] hover:bg-[#F4F1FF] hover:text-[#6C56E5]"
                      }`}
                    >
                      {pageNum}
                    </a>
                  );
                })}

                {/* Next */}
                <a
                  href={
                    currentPage < totalPages
                      ? `?page=${currentPage + 1}&q=${q}&sort=${sort}`
                      : "#"
                  }
                  className={`inline-flex items-center justify-center h-10 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-[#6C56E5] border border-[#D9D2FF] hover:bg-[#F4F1FF]"
                  }`}
                >
                  <span className="hidden md:inline mr-2">Next</span> →
                </a>
              </nav>
            )}
          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>

      {/* Script to trigger sorting submit */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        document.getElementById('sort-select')?.addEventListener('change', (e) => {
          const url = new URL(window.location.href);
          url.searchParams.set('sort', e.target.value);
          url.searchParams.set('page', '1');
          window.location.href = url.toString();
        });
      `,
        }}
      />
    </div>
  );
}
