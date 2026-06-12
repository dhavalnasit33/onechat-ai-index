import React from "react";
import { Metadata } from "next";
import { Search, Menu, FileText, ChevronDown } from "lucide-react";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  await dbConnect();
  const { category: categorySlug } = await params;
  const category = await Category.findOne({ slug: categorySlug }).lean();

  if (!category) return { title: "Category Not Found | AI Behavior Index" };

  const pageTitle =
    category.metaTitle || `${category.name} | AI Behavior Index`;
  const description =
    category.metaDescription ||
    category.description ||
    `Explore AI usage statistics for ${category.name}.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";
  const ogImageUrl = category.featuredImage || category.iconUrl || "";

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: `${baseUrl}/ai-behavior-index/${categorySlug}/`,
    },
    openGraph: {
      title: pageTitle,
      description: description,
      url: `${baseUrl}/ai-behavior-index/${categorySlug}/`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  await dbConnect();

  const { category: categorySlug } = await params;
  const { q = "", sort = "most-cited", page = "1" } = await searchParams;

  const category = await Category.findOne({ slug: categorySlug }).lean();

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Category Not Found</h1>
          <p className="text-gray-500 mb-4">
            The requested category slug does not exist.
          </p>
          <a href="/ai-behavior-index/" className="text-blue-500 underline">
            Back to index
          </a>
        </div>
      </div>
    );
  }

  // Filter topics
  const filter: any = {
    categoryId: category._id,
    status: "published",
  };

  if (q) {
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: escapedQ, $options: "i" } },
      { description: { $regex: escapedQ, $options: "i" } },
    ];
  }

  // Sorting
  let sortObj: any = {};
  if (sort === "recent") {
    sortObj = { publishedAt: -1 };
  } else if (sort === "a-z") {
    sortObj = { title: 1 };
  } else {
    sortObj = { dataPointsCount: -1 }; // most-cited
  }

  const limit = 12;
  const currentPage = parseInt(page) || 1;
  const skip = (currentPage - 1) * limit;

  const topics = await Topic.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Topic.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  // Emojis mapping for topics
  // const icons = ['📱', '📚', '🛡️', '💼', '👨‍👩‍👧', '📈', '🕰️', '🏥', '🎓', '📖', '💻', '👥'];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/ai-behavior-index/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category.name,
        "item": `${baseUrl}/ai-behavior-index/${category.slug}/`
      }
    ]
  };

  return (
    <div className="bg-[#f0f0f0] md:bg-white text-[#15151a] font-serif min-h-screen flex justify-center md:block">
      {/* SEO Schema Markups */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* MOBILE WRAPPER (Restricts width on mobile to simulate app, expands on desktop) */}
      <div className="w-full max-w-[380px] md:max-w-full bg-white min-h-screen shadow-[0_4px_24px_rgba(0,0,0,0.12)] md:shadow-none">
        {/* TOP NAV */}
        <Header activeTab="none" />

        {/* BREADCRUMB */}
        <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
          <div className="max-w-[1340px] px-4 mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95] text-left">
            <a href="/ai-behavior-index/" className="hover:text-[#15151a]">
              Home
            </a>
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
              action={`/ai-behavior-index/${category.slug}/`}
              method="GET"
              className="relative w-full md:flex-1 md:max-w-[560px]"
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8a8a95] pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                name="q"
                defaultValue={q}
                className="w-full font-sans text-sm text-[#15151a] bg-[#eaf2fb] border border-[#d7e3f0] rounded-full py-2.5 md:py-[11px] pr-4 pl-10 outline-none transition-colors focus:border-[#088DFF] focus:bg-white placeholder:text-[#8a8a95]"
                placeholder={`Search within ${category.name} topics...`}
              />
              <input type="hidden" name="sort" value={sort} />
            </form>

            <div className="hidden md:block w-px h-8 bg-[#d7e3f0] mx-1"></div>

            {/* Sort & Results */}
            {/* Sort & Results */}
            <div className="flex items-center gap-2.5 md:gap-3 w-full md:w-auto">
              <span className="font-sans text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-[#8a8a95] font-bold whitespace-nowrap">
                Sort <span className="hidden md:inline">by</span>
              </span>

              <div className="relative flex-1 md:flex-none min-w-[170px]">
                <select
                  id="sort-select"
                  defaultValue={sort}
                  className="  appearance-none  w-full  bg-white  border  border-[#D9D2FF]  rounded-xl  py-2  pl-4  pr-10  text-sm  font-medium  text-[#15151a]  outline-none  transition-all  duration-200  cursor-pointer  hover:border-[#6C56E5]  focus:border-[#6C56E5]  focus:ring-4  focus:ring-[#6C56E5]/10 "
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
                <span className="hidden md:inline"> topics</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="max-w-[1340px] px-4 mx-auto py-4 md:py-8">
          {/* TOPICS GRID */}
          {topics.length === 0 ? (
            <div className="text-center py-20 text-[#8a8a95] font-sans">
              <p className="text-lg font-medium">
                No topics found matching your filters.
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-[18px] mb-7 md:mb-10">
              {topics.map((topic: any, i: number) => (
                <a
                  href={`/ai-behavior-index/${category.slug}/${topic.slug}/`}
                  key={topic._id.toString()}
                  className="bg-white border border-[#d7e3f0] rounded-md p-[18px] md:p-[22px] md:pb-[18px] flex flex-col cursor-pointer transition-all duration-150 hover:border-[#088DFF] hover:shadow-[0_8px_20px_rgba(8,141,255,0.1)] hover:-translate-y-0.5 md:min-h-[180px] text-left"
                >
                  {/* <div className="text-[20px] md:text-[22px] leading-none mb-2.5 md:mb-3">{icons[i % icons.length]}</div> */}
                  <div className="mb-2.5 md:mb-3 flex items-center justify-start">
                    {topic.iconUrl ? (
                      <img
                        src={topic.iconUrl}
                        alt={topic.title}
                        className="w-8 h-8 object-contain mb-3"
                      />
                    ) : (
                      <div className="mb-3 text-[#8a8a95]">
                        {/* This renders whenever there is no image */}
                        <FileText size={28} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-[17px] font-normal tracking-[-0.01em] text-[#15151a] leading-[1.25] mb-2 md:mb-2.5">
                    {topic.title}
                  </h3>
                  <p className="font-sans text-[12.5px] text-[#4a4a55] leading-[1.5] mb-3 md:mb-3.5 flex-1">
                    {topic.description}
                  </p>
                  <div className="font-sans text-[10.5px] text-[#8a8a95] tracking-[0.04em] pt-2.5 border-t border-[#eaf2fb] flex justify-between items-center">
                    <span>{topic.dataPointsCount} data points</span>
                    <span className="text-[#0468BD] font-bold text-[13px] leading-none">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-1 md:gap-1.5 py-5 md:py-6 pb-8 md:pb-10 font-sans">
              <a
                href={
                  currentPage > 1
                    ? `?page=${currentPage - 1}&q=${q}&sort=${sort}`
                    : "#"
                }
                className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-2.5 md:px-3 rounded-md text-[12.5px] md:text-[13px] text-[#8a8a95] font-semibold border border-transparent ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
              >
                ‹ Prev
              </a>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <a
                    key={pageNum}
                    href={`?page=${pageNum}&q=${q}&sort=${sort}`}
                    className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-2.5 md:px-3 rounded-md text-[12.5px] md:text-[13px] font-semibold border border-transparent ${currentPage === pageNum ? "text-white bg-[#1e3a5f]" : "text-[#4a4a55] hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
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
                className={`inline-flex items-center justify-center min-w-[36px] md:min-w-[38px] h-[36px] md:h-[38px] px-2.5 md:px-3 rounded-md text-[12.5px] md:text-[13px] text-[#8a8a95] font-semibold border border-transparent ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-[#eaf2fb] hover:text-[#15151a]"}`}
              >
                Next ›
              </a>
            </nav>
          )}

          {/* METHODOLOGY NOTE */}
          <div className="mt-1 md:mt-2 mb-6 md:mb-8 p-[18px] md:p-[22px] md:px-[26px] bg-white border border-[#d7e3f0] rounded md:rounded-md text-left">
            <div className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">
              A note on methodology
            </div>
            <p className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] max-w-[800px]">
              Every topic article links its statistics back to publicly
              available studies, surveys, and reports. We aggregate, organize,
              and contextualize this data — but the underlying research is
              conducted by the cited sources. This index is refreshed quarterly.
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
