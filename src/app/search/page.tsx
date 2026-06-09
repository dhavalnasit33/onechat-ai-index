import React from "react";
import { Search, Menu, X } from "lucide-react";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";

interface PageProps {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

// Highlight search terms
function highlightMatch(text: string, query: string): string {
  if (!query || !text) return text;
  const terms = query.split(/\s+/).filter((t) => t.length > 1);
  if (terms.length === 0) return text;

  let result = text;
  terms.forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${escaped})`, "gi");
    result = result.replace(
      re,
      '<mark class="bg-[#fff3a3] text-[#15151a] px-[2px] py-[1px] font-semibold rounded-[2px]">$1</mark>',
    );
  });
  return result;
}

export default async function SearchPage({ searchParams }: PageProps) {
  await dbConnect();

  // Ensure Category schema is registered with Mongoose so populate can find it
  const _dummyCategory = Category.modelName;

  const { q = "", sort = "relevance", page = "1" } = await searchParams;

  const limit = 10;
  const currentPage = parseInt(page) || 1;
  const skip = (currentPage - 1) * limit;

  let topics: any[] = [];
  let totalCount = 0;

  if (q) {
    const filter: any = {
      status: "published",
      $text: { $search: q },
    };

    let sortObj: any = {};
    if (sort === "recent") {
      sortObj = { publishedAt: -1 };
    } else if (sort === "a-z") {
      sortObj = { title: 1 };
    } else {
      sortObj = { score: { $meta: "textScore" } }; // relevance
    }

    try {
      topics = await Topic.find(
        filter,
        sort === "relevance" ? { score: { $meta: "textScore" } } : {},
      )
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate("categoryId", "slug name")
        .lean();

      totalCount = await Topic.countDocuments(filter);
    } catch (error) {
      console.warn("Text search failed, falling back to regex search:", error);
      totalCount = 0;
    }

    // Fallback to regex search if no strict text search matches found
    if (totalCount === 0) {
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const fallbackFilter: any = {
        status: "published",
        $or: [
          { title: { $regex: escapedQ, $options: "i" } },
          { description: { $regex: escapedQ, $options: "i" } },
        ],
      };

      topics = await Topic.find(fallbackFilter)
        .sort(
          sort === "recent"
            ? { publishedAt: -1 }
            : sort === "a-z"
              ? { title: 1 }
              : { dataPointsCount: -1 },
        )
        .skip(skip)
        .limit(limit)
        .populate("categoryId", "slug name")
        .lean();

      totalCount = await Topic.countDocuments(fallbackFilter);
    }
  }

  const totalPages = Math.ceil(totalCount / limit);
  // Icons updated to match the static HTML examples
  const icons = ["📱", "📚", "🛡️", "🏆", "⚡", "🔀", "🤖", "💵", "🎨", "📈"];

  return (
    <div className="bg-[#f0f0f0] md:bg-white text-[#15151a] font-serif min-h-screen flex justify-center md:block">
      {/* MOBILE WRAPPER - Full width on desktop, constrained wrapper effect on mobile if needed */}
      <div className="w-full bg-white min-h-screen shadow-[0_4px_24px_rgba(0,0,0,0.12)] md:shadow-none">
        {/* TOP NAV */}
        <header className="border-b border-[#d7e3f0] bg-white sticky top-0 z-20">
          <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-[14px] flex items-center justify-between">
            <div className="font-serif text-[12px] md:text-[14px] tracking-[0.06em] md:tracking-[0.08em] uppercase text-[#15151a] font-bold">
              <a
                href="/ai-behavior-index/"
                className="no-underline text-inherit block"
              >
                AI Behavior Index
                <span className="text-[#8a8a95] font-normal tracking-[0.04em] text-[10px] md:text-[12px] normal-case block mt-[2px] md:inline md:mt-0 md:ml-1.5">
                  by OneChat AI
                </span>
              </a>
            </div>

            {/* Desktop Links */}
            <nav className="hidden md:flex gap-[28px] font-sans text-[13px] text-[#4a4a55]">
              <a
                href="/ai-behavior-index/"
                className="hover:text-[#15151a] transition-colors"
              >
                Explore
              </a>
              <a
                href="/ai-behavior-index/methodology/"
                className="hover:text-[#15151a] transition-colors"
              >
                Methodology
              </a>
              <a
                href="/ai-behavior-index/for-journalists/"
                className="hover:text-[#15151a] transition-colors"
              >
                For Journalists
              </a>
            </nav>

            {/* Mobile Hamburger Menu */}
            <button className="md:hidden text-[#15151a] p-1 leading-none">
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* BREADCRUMB */}
        <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
          <div className="max-w-[1340px] mx-auto font-sans text-[11px] md:text-[12px] text-[#8a8a95] text-left">
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
          <div className="max-w-[1340px] mx-auto">
            <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-[10px] md:mb-[12px]">
              Search results
            </div>
            <h1 className="font-serif text-[24px] md:text-[36px] leading-[1.15] md:leading-[1.1] font-normal tracking-[-0.015em] text-[#15151a] mb-[6px] md:mb-1">
              Results for{" "}
              <span className="font-bold text-[#0468BD]">
                "{q || "All topics"}"
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
              matching topics{" "}
              <span className="hidden md:inline">across all categories.</span>
            </p>
          </div>
        </section>

        {/* SEARCH TOOLBAR */}
        <div className="bg-white border-b border-[#d7e3f0] px-4 py-[14px] md:px-8 md:py-[18px] sticky top-[53px] md:top-[57px] z-15">
          <div className="max-w-[1340px] mx-auto flex flex-col md:flex-row md:items-center gap-[12px] md:gap-4 flex-wrap">
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
                placeholder="Search all topics…"
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
              <select
                id="sort-select"
                defaultValue={sort}
                className="font-sans text-[12px] md:text-[13px] text-[#15151a] bg-white border border-[#d7e3f0] rounded-full py-[7px] md:py-[8px] px-3 md:px-[14px] cursor-pointer font-medium outline-none hover:border-[#1e3a5f] flex-1 md:flex-none md:max-w-[160px] transition-colors"
              >
                <option value="relevance">Most relevant</option>
                <option value="recent">Most recent</option>
                <option value="a-z">A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="max-w-[920px] mx-auto p-[16px] md:p-[32px]">
          {/* RESULTS LIST */}
          <section className="mb-0 md:mb-8">
            <div className="hidden md:block font-sans text-[10px] tracking-[0.18em] uppercase text-[#8a8a95] font-bold mb-[18px] text-left">
              Matching topics
            </div>

            {topics.length === 0 ? (
              <div className="text-center py-20 text-[#8a8a95] font-sans">
                <p className="text-lg font-medium">No results found.</p>
                <p className="text-sm mt-1">
                  Try searching for other keywords like "Gen Z", "Adoption", or
                  "ChatGPT".
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {topics.map((topic: any, i: number) => {
                  const categorySlug = topic.categoryId?.slug || "unknown";
                  const categoryName =
                    topic.categoryId?.name || "Uncategorized";
                  return (
                    <a
                      key={topic._id.toString()}
                      href={`/ai-behavior-index/${categorySlug}/${topic.slug}/`}
                      className={`group grid grid-cols-[32px_1fr] md:grid-cols-[40px_1fr] gap-[12px] md:gap-[18px] py-[18px] md:py-[22px] border-b border-[#eaf2fb] ${i === topics.length - 1 ? "border-none" : ""} text-left no-underline text-inherit`}
                    >
                      <div className="text-[18px] md:text-[22px] leading-none pt-[3px] md:pt-1">
                        {icons[i % icons.length]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.14em] uppercase text-[#0468BD] font-bold mb-[5px] md:mb-[6px]">
                          {categoryName}
                          <span className="text-[#8a8a95] font-normal mx-[6px] md:mx-[8px]">
                            ·
                          </span>
                          <span className="text-[#8a8a95] font-medium">
                            <span className="hidden md:inline">Updated </span>
                            {topic.publishedAt
                              ? new Date(topic.publishedAt).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" },
                                )
                              : "Q2 2026"}
                          </span>
                        </div>
                        <h3
                          className="font-serif text-[18px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] leading-[1.2] mb-[7px] md:mb-[8px] transition-colors group-hover:text-[#0468BD]"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(topic.title, q),
                          }}
                        />
                        <p
                          className="font-sans text-[12.5px] md:text-[13.5px] text-[#4a4a55] leading-[1.55] mb-[10px] md:mb-[12px]"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(topic.description, q),
                          }}
                        />
                        <div className="font-sans text-[10.5px] md:text-[11px] text-[#8a8a95] flex gap-[12px] md:gap-[14px] flex-wrap">
                          <strong className="text-[#4a4a55] font-semibold">
                            {topic.dataPointsCount} data points
                          </strong>
                          <span>{topic.sourceCount} sources</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </section>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-[4px] md:gap-[6px] py-[24px] md:py-[28px] pb-[28px] md:pb-[40px] font-sans">
              <a
                href={
                  currentPage > 1
                    ? `?page=${currentPage - 1}&q=${q}&sort=${sort}`
                    : "#"
                }
                className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-[10px] md:px-[12px] rounded-md text-[12.5px] md:text-[13px] font-semibold border border-transparent transition-colors ${currentPage === 1 ? "text-[#8a8a95] opacity-50 cursor-not-allowed" : "text-[#4a4a55] hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
              >
                ‹ <span className="hidden md:inline ml-1">Prev</span>
              </a>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <a
                    key={pageNum}
                    href={`?page=${pageNum}&q=${q}&sort=${sort}`}
                    className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-[10px] md:px-[12px] rounded-md text-[12.5px] md:text-[13px] font-semibold border border-transparent transition-colors ${currentPage === pageNum ? "text-white bg-[#1e3a5f] hover:bg-[#1e3a5f]" : "text-[#4a4a55] hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
                  >
                    {pageNum}
                  </a>
                );
              })}
              <a
                href={
                  currentPage < totalPages
                    ? `?page=${currentPage + 1}&q=${q}&sort=${sort}`
                    : "#"
                }
                className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-[10px] md:px-[12px] rounded-md text-[12.5px] md:text-[13px] font-semibold border border-transparent transition-colors ${currentPage === totalPages ? "text-[#8a8a95] opacity-50 cursor-not-allowed" : "text-[#4a4a55] hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
              >
                <span className="hidden md:inline mr-1">Next</span> ›
              </a>
            </nav>
          )}

          {/* METHODOLOGY NOTE */}
          <div className="my-[4px] md:my-[8px] mb-[24px] md:mb-[32px] p-[18px_20px] md:p-[22px_26px] bg-white border border-[#d7e3f0] rounded md:rounded-[4px] text-left">
            <div className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-[8px]">
              A note on methodology
            </div>
            <p className="font-sans text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] max-w-[800px]">
              Every statistic shown is sourced from a publicly available study,
              survey, or report. We aggregate, organize, and contextualize this
              data — but the underlying research is conducted by the cited
              sources. Click any source link to access the original methodology.
              This index is refreshed quarterly to incorporate new research as
              it becomes available. If you run into any issues or have a study
              to suggest, contact us at{" "}
              <a
                href="mailto:support@onechatai.ai"
                className="text-[#4a4a55] underline"
              >
                support@onechatai.ai
              </a>
              .
            </p>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-[#d7e3f0] bg-white p-[24px_16px_32px] md:p-[36px_32px]">
          <div className="max-w-[1340px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center font-sans text-[11px] md:text-[12px] text-[#8a8a95]">
            <div className="text-[#4a4a55] mb-[16px] md:mb-0 leading-[1.5] text-left md:text-left">
              Published by{" "}
              <a href="#" className="text-[#15151a] font-semibold no-underline">
                OneChat AI
              </a>{" "}
              <span className="hidden md:inline">
                — Your Personalized AI Super App, Curated for You
              </span>
            </div>
            <div className="flex gap-[16px] md:gap-[24px]">
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
