import React from "react";
import { Metadata } from "next";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";
import Chart from "@/src/models/Chart";
import InteractiveChart from "@/src/components/InteractiveChart";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import RenderIcon from "@/src/components/RenderIcon";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Behavior Index | OneChat AI",
  description:
    "An interactive index of AI usage statistics aggregated from public studies. Search any topic, filter the dashboard, or browse by category.",
};

export default async function Home() {
  await dbConnect();

  // Fetch categories sorted by position and calculate topic counts dynamically
  const categoriesRaw = await Category.find({}).sort({ position: 1 }).lean();
  const categories = await Promise.all(
    categoriesRaw.map(async (cat: any) => {
      const topicCount = await Topic.countDocuments({
        categoryId: cat._id,
        status: "published",
      });
      return {
        ...cat,
        topicCount,
      };
    }),
  );

  // Fetch charts flagged for homepage display
  const customHomeCharts = await Chart.find({
    displayHome: true,
    status: "active",
  })
    .populate({
      path: "topicId",
      populate: { path: "categoryId" },
    })
    .lean();

  return (
    <div className="bg-white text-[#15151a] font-serif leading-relaxed text-[15px] md:text-[16px] min-h-screen w-full">
      {/* TOP NAV */}
      <Header activeTab="home" />

      {/* COMPACT HEADER */}
      <section className="bg-white border-b border-[#d7e3f0] pt-8 md:pt-12 pb-6 md:pb-9 px-5 md:px-8 text-center">
        <div className="max-w-[1340px] mx-auto">
          <div className="font-sans text-[9.5px] md:text-[11px] tracking-[0.18em] uppercase text-[#8a8a95] font-semibold mb-3.5 md:mb-4">
            Quarterly updates · Last refreshed Q2 2026
          </div>
          <h1 className="font-serif text-[34px] md:text-[56px] leading-[1.05] font-bold tracking-[-0.02em] text-[#15151a] mb-3.5 md:mb-4 max-w-[900px] mx-auto">
            How the world is actually using{" "}
            <em className="italic text-[#088DFF] font-bold not-italic">AI.</em>
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#4a4a55] max-w-[680px] mx-auto leading-[1.5] md:leading-[1.55] mb-5 md:mb-0">
            An interactive index of AI usage statistics aggregated from public
            studies. Search any topic, filter the dashboard below, or browse by
            category.
          </p>

          <form
            action="/ai-behavior-index/search/"
            method="GET"
            className="relative max-w-[640px] mx-auto md:mt-7"
          >
            <Search
              size={18}
              className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-[#8a8a95] pointer-events-none"
            />
            <input
              type="text"
              name="q"
              className="w-full font-sans text-[14px] md:text-[15px] truncate md:truncate-none text-[#15151a] bg-[#eaf2fb] border border-[#d7e3f0] rounded-full py-3 md:py-3.5 pr-4 md:pr-5 pl-10 md:pl-12 outline-none transition-all focus:border-[#088DFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(8,141,255,0.12)] placeholder:text-[#8a8a95]"
              placeholder='Search all topics — e.g. "Gen Z trust", "AI by country", "healthcare AI"'
            />
          </form>
        </div>
      </section>

      {/* DASHBOARD */}
      <main className="max-w-[1340px] mx-auto px-4  py-5 md:py-7">
        {customHomeCharts && customHomeCharts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] md:gap-[20px]">
            {customHomeCharts.map((chart: any) => {
              const topic = chart.topicId;
              const category = topic?.categoryId;
              const categoryName = category?.name || "Insight";
              const iconToUse = (
                <RenderIcon
                  icon={chart.icon || "📊"}
                  size={24}
                  className="text-[#8a8a95]"
                />
              );

              const chartLink =
                category?.slug && topic?.slug
                  ? `/ai-behavior-index/${category.slug}/${topic.slug}/`
                  : "#";

              return (
                <div
                  key={chart._id.toString()}
                  className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_8px_24px_rgba(8,141,255,0.08)] hover:-translate-y-[2px] text-left"
                >
                  <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
                    <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none flex items-center justify-center w-[24px] h-[24px]">
                      {iconToUse}
                    </div>
                    <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2 max-w-[80%] md:max-w-full">
                      {categoryName} {topic ? `· ${topic.title}` : ""}
                    </div>
                    <a
                      href={chartLink}
                      className="hover:text-[#088DFF] transition-colors block"
                    >
                      <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-[1.25] tracking-[-0.01em] mb-1.5 max-w-[90%] md:max-w-[92%]">
                        {chart.heading || chart.title}
                      </div>
                    </a>
                    <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%]">
                      {chart.sourceLine || "Compiled by OneChat AI"}
                    </div>
                  </div>
                  <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] flex-1 flex flex-col justify-center min-h-[220px]">
                    <InteractiveChart
                      chartId={chart.chartId}
                      chartType={chart.chartType}
                      data={chart.data}
                    />
                  </div>
                  <div className="px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                    <div>
                      Source:{" "}
                      {chart.sources && chart.sources.length > 0 ? (
                        chart.sources.map((src: any, idx: number) => (
                          <span key={idx}>
                            {idx > 0 && ", "}
                            {src.sourceUrl ? (
                              <a
                                href={src.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4a4a55] underline font-semibold"
                              >
                                {src.sourceName}
                              </a>
                            ) : (
                              <span className="font-semibold">
                                {src.sourceName}
                              </span>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="font-semibold">
                          {chart.sourceLine || "Multiple"}
                        </span>
                      )}
                    </div>
                    <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase">
                      <strong className="font-bold not-italic">
                        OneChat AI
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>No data Found</>
        )}
      </main>

      {/* DIVIDER */}
      <div className="bg-[#eaf2fb] border-y border-[#d7e3f0] py-[28px] md:py-[36px] px-[20px] md:px-[32px] text-center mt-[0px] md:mt-[24px]">
        <div className="max-w-[800px] mx-auto">
          <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#1e3a5f] font-bold mb-[10px]">
            More from the index ↓
          </div>
          <h2 className="font-serif text-[20px] md:text-[26px] font-normal tracking-[-0.015em] text-[#15151a] leading-[1.2] mb-[6px]">
            Featured findings, full category browsing, and resources for
            journalists.
          </h2>
          <p className="text-[13px] md:text-[14px] text-[#4a4a55] max-w-[600px] mx-auto">
            Curated takes from the data above, plus full category navigation and
            citation tools.
          </p>
        </div>
      </div>

      {/* FEATURED INSIGHTS */}
      <section className="bg-[#f9fbfd] border-b border-[#d7e3f0] py-[32px] md:py-[64px] px-[16px] md:px-[32px]">
        <div className="max-w-[1340px] px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-baseline mb-[22px] md:mb-[36px] pb-[14px] md:pb-[16px] border-b border-[#d7e3f0]">
            <div>
              <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-[6px] md:mb-0">
                Featured Findings · Q2 2026
              </div>
              <h2 className="font-serif text-[24px] md:text-[30px] font-normal tracking-[-0.015em] text-[#15151a] mb-[6px] leading-[1.15]">
                What's shaping how the world uses AI right now.
              </h2>
              <p className="text-[13px] md:text-[14px] text-[#4a4a55] max-w-[640px] mb-0 md:mb-[32px] hidden md:block">
                Six headline statistics curated from the most recent research
                across all categories. Click any insight to explore the full
                data.
              </p>
            </div>
            <div className="hidden md:block font-sans text-[12px] text-[#8a8a95]">
              Updated quarterly
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px] md:gap-[20px]">
            {[
              {
                icon: "📊",
                kicker: "Generational Adoption",
                num: "73",
                pct: "%",
                title: "Gen Z has crossed the weekly-use threshold.",
                desc: "Nearly three-quarters of Americans aged 18-25 use a generative AI tool at least once per week — a 32-point jump in two years.",
                src: "Pew Research",
                color: "text-[#088DFF]",
                link: "#",
              },
              {
                icon: "🏆",
                kicker: "Tool Market Share",
                num: "58",
                pct: "%",
                title: "ChatGPT leads Gen Z by a 4-to-1 margin.",
                desc: "More than half of 18-25 year olds name ChatGPT as their most-used AI, followed by Gemini (14%) and Claude (9%).",
                src: "Morning Consult",
                color: "text-[#E5483F]",
                link: "#",
              },
              {
                icon: "🌍",
                kicker: "Geographic Patterns",
                num: "71",
                pct: "%",
                title: "DeepSeek now dominates AI use in China.",
                desc: "Local models lead in two of eight surveyed countries — DeepSeek in China (71%) and YandexGPT in Russia (44%).",
                src: "Statcounter",
                color: "text-[#F39323]",
                link: "#",
              },
              {
                icon: "📚",
                kicker: "Use Case Patterns",
                num: "67",
                pct: "%",
                title: "Schoolwork dominates Gen Z AI use.",
                desc: "Two-thirds of Gen Z report using AI for schoolwork, well ahead of creative writing (44%) and personal research (38%).",
                src: "Common Sense Media",
                color: "text-[#088DFF]",
                link: "#",
              },
              {
                icon: "💼",
                kicker: "Industry Intensity",
                num: "5.1",
                pct: "× / week",
                isSub: true,
                title: "Marketing leads AI intensity at work.",
                desc: "Marketers use AI tools 5+ times per week on average — more than any other knowledge work function tracked.",
                src: "McKinsey",
                color: "text-[#088DFF]",
                link: "#",
              },
              {
                icon: "⚡",
                kicker: "Adoption Velocity",
                num: "+32",
                pct: "pts",
                isSub: true,
                title: "Two-year growth for Gen Z weekly use.",
                desc: "Gen Z weekly AI use jumped from 41% in 2024 to 73% in 2026 — the steepest cohort growth recorded in any survey.",
                src: "Pew Research",
                color: "text-[#E5483F]",
                link: "#",
              },
            ].map((insight, i) => (
              <a
                key={i}
                href={insight.link}
                className="bg-white border border-[#d7e3f0] rounded-[6px] p-[22px] md:p-[26px] md:px-[28px] md:pb-[22px] flex flex-col transition-all duration-200 hover:shadow-[0_8px_24px_rgba(8,141,255,0.08)] hover:-translate-y-[2px] cursor-pointer relative text-left"
              >
                <div className="absolute top-[18px] md:top-[22px] right-[18px] md:right-[22px] text-[#0468BD]">
                  <RenderIcon icon={insight.icon} size={22} />
                </div>
                <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-[14px] md:mb-[16px] max-w-[78%] md:max-w-[80%]">
                  {insight.kicker}
                </div>
                <div
                  className={`font-serif text-[48px] md:text-[56px] leading-none font-normal tracking-[-0.03em] mb-[12px] md:mb-[14px] ${insight.color}`}
                >
                  {insight.num}
                  {insight.isSub ? (
                    <span className="text-[12px] md:text-[14px] text-[#8a8a95] font-sans font-semibold ml-[5px] md:ml-[6px] align-middle tracking-[0.04em]">
                      {insight.pct}
                    </span>
                  ) : (
                    <span className="text-[28px] md:text-[34px] text-[#4a4a55]">
                      {insight.pct}
                    </span>
                  )}
                </div>
                <div className="font-sans text-[14px] md:text-[15px] font-bold text-[#15151a] leading-[1.35] mb-[10px] md:mb-[12px] tracking-[-0.005em]">
                  {insight.title}
                </div>
                <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.5] mb-[14px] md:mb-[18px] flex-1">
                  {insight.desc}
                </div>
                <div className="flex justify-between items-center pt-[12px] md:pt-[14px] border-t border-[#eaf2fb] font-sans text-[10.5px] md:text-[11px]">
                  <div className="text-[#8a8a95]">
                    Source:{" "}
                    <span className="text-[#4a4a55] underline md:underline-offset-[2px]">
                      {insight.src}
                    </span>
                  </div>
                  <span className="text-[#0468BD] font-bold no-underline">
                    Explore →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white py-[32px] md:py-[72px] px-[16px] md:px-[32px]">
        <div className="max-w-[1340px] px-4 mx-auto">
          <div className="mb-[22px] md:mb-[36px] pb-[14px] md:pb-[16px] border-b border-[#d7e3f0] md:border-none md:pb-0">
            <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-[6px] md:mb-0">
              Browse The Full Index
            </div>
            <h2 className="font-serif text-[24px] md:text-[30px] font-normal tracking-[-0.015em] text-[#15151a] mb-[6px] leading-[1.15]">
              All categories.
            </h2>
            <p className="text-[13px] md:text-[14px] text-[#4a4a55] max-w-[640px] md:mb-[32px]">
              Filter, compare, and explore data across six categories of AI
              usage and behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[12px] md:gap-[20px]">
            {categories.length > 0 ? (
              categories.map((cat: any, i: number) => {
                const icons = ["👥", "🌍", "💼", "🎯", "🏆", "📈"];
                return (
                  <a
                    href={`/ai-behavior-index/${cat.slug}/`}
                    key={cat._id.toString()}
                    className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] cursor-pointer transition-all duration-200 flex flex-col min-h-auto md:min-h-[220px] hover:border-[#088DFF] hover:shadow-[0_8px_24px_rgba(8,141,255,0.1)] hover:-translate-y-[2px] text-left"
                  >
                    <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px] flex items-center justify-start h-[28px] text-[#0468BD]">
                      <RenderIcon
                        icon={cat.iconUrl || icons[i % icons.length]}
                        size={28}
                      />
                    </div>
                    <div className="font-serif text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-[6px] leading-[1.2]">
                      {cat.name}
                    </div>
                    <div className="font-sans text-[10.5px] md:text-[11px] tracking-[0.1em] uppercase text-[#8a8a95] font-semibold mb-[12px] md:mb-[16px]">
                      {cat.topicCount} Topics
                    </div>
                    <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-[14px] md:mb-[18px] flex-1">
                      {cat.description}
                    </div>
                    <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold no-underline">
                      Explore →
                    </span>
                  </a>
                );
              })
            ) : (
              // Fallbacks if no categories from DB
              <>No Data Found</>
            )}
          </div>
        </div>
      </section>

      {/* JOURNALIST SECTION */}
      <section className="bg-[#eaf2fb] border-y border-[#d7e3f0] py-[36px] md:py-[56px] px-[16px] md:px-[32px]">
        <div className="max-w-[1340px] px-4 mx-auto">
          <div className="mb-[22px] md:mb-[36px] pb-[14px] md:pb-[16px] border-b border-[#d7e3f0]">
            <div>
              <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#1e3a5f] font-bold mb-[6px] md:mb-0">
                For Journalists & Researchers
              </div>
              <h2 className="font-serif text-[24px] md:text-[30px] font-normal tracking-[-0.015em] text-[#15151a] mb-[6px] leading-[1.15]">
                Use this data in your work.
              </h2>
              <p className="text-[13px] md:text-[14px] text-[#4a4a55] max-w-[640px]">
                Every statistic in this index is free to cite, with full source
                attribution. We make it easy to find what you need.
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
                href="mailto:support@onechatai.ai"
                className="font-sans text-[11.5px] md:text-[12px] text-[#0468BD] font-bold no-underline break-all"
              >
                support@onechatai.ai →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="bg-white py-[28px] md:py-[48px] px-[16px] md:px-[32px] pb-[24px] md:pb-[32px]">
        <div className="max-w-[1340px] px-4 mx-auto ">
          <div className="bg-white border border-[#d7e3f0] rounded-[4px] py-[20px] px-[22px] md:py-[24px] md:px-[28px]">
            <div className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-[8px]">
              A note on methodology
            </div>
            <p className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] max-w-[900px]">
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
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
