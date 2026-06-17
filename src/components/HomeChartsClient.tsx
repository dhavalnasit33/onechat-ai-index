"use client";

import React, { useEffect, useState } from "react";
import InteractiveChart from "@/src/components/InteractiveChart";
import RenderIcon from "@/src/components/RenderIcon";
import { apiUrl } from "@/src/lib/basePath";

export default function HomeChartsClient() {
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCharts = async () => {
      try {
        const res = await fetch(apiUrl("/api/charts/featured"));

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const json = await res.json();
        if (json.success) {
          setCharts(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured charts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCharts();
  }, []);

  if (loading) {
    return (
      <main className="max-w-[1340px] mx-auto px-4 py-5 md:py-7">
        <div className="mb-4 md:mb-6">
          <h2 className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#1e3a5f] font-bold text-left">
            Latest charts
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] md:gap-[20px]">
          {/* Detailed Loading Skeletons */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col h-full animate-pulse text-left"
            >
              {/* Skeleton Header */}
              <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
                {/* Icon Placeholder */}
                <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] w-[24px] h-[24px] bg-[#eaf2fb] rounded-md"></div>
                {/* Category Placeholder */}
                <div className="h-[10px] w-[25%] bg-[#eaf2fb] rounded mb-3"></div>
                {/* Title Placeholder */}
                <div className="h-[16px] w-[85%] bg-[#eaf2fb] rounded mb-2"></div>
                <div className="h-[16px] w-[60%] bg-[#eaf2fb] rounded mb-3"></div>
                {/* Source Line Placeholder */}
                <div className="h-[12px] w-[90%] bg-[#f4f8fc] rounded"></div>
              </div>

              {/* Skeleton Chart Box */}
              <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] h-[250px] flex flex-col justify-center block">
                <div className="w-full h-full bg-[#f8fafc] rounded-md border border-[#eaf2fb]"></div>
              </div>

              {/* Skeleton Footer */}
              <div className="mt-auto px-[20px] md:px-[28px] py-[12px] md:py-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center h-[64px] overflow-hidden">
                <div className="h-[12px] w-[60%] bg-[#d7e3f0] rounded"></div>
                <div className="hidden md:block h-[12px] w-[25%] bg-[#d7e3f0] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // If there are no charts, return completely null.
  if (charts.length === 0) {
    return null;
  }

  return (
    <main className="max-w-[1600px] mx-auto px-4 py-5 md:py-7">
      <div className="mb-4 md:mb-6">
        <h2 className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#1e3a5f] font-bold text-left">
          Latest charts
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] md:gap-[20px]">
        {charts.map((chart: any) => {
          const topic = chart.topicId;
          const category = topic?.categoryId;
          const categoryName = category?.name || "Insight";

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

                {/* Subtitle Heading */}
                {chart.heading && (
                  <h4 className="font-sans text-[12px] md:text-[13px] font-medium text-[#8a8a95] leading-[1.3] mb-2 max-w-[90%] md:max-w-[92%]">
                    {chart.heading}
                  </h4>
                )}
                {/* <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%] source-line-link">
                                    Source:{" "}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: chart.sourceLine
                                                ? chart.sourceLine.toLowerCase().startsWith("source:")
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
                                </div> */}
              </div>

              <a
                href={chartLink}
                className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] h-[350px] flex flex-col justify-center"
              >
                <InteractiveChart
                  chartId={chart.chartId}
                  chartType={chart.chartType}
                  data={chart.data}
                  title={chart.title}
                />
              </a>

              {/* <div className="mt-auto px-[20px] md:px-[28px] py-[12px] md:py-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95] h-[64px] overflow-hidden">
                                <div className="flex-1 pr-3 min-w-0">
                                    <div
                                        className="line-clamp-2 leading-[1.5]"
                                        title="Click card to view full source details"
                                    >
                                        Source:{" "}
                                        <span
                                            className="font-semibold source-line-link"
                                            dangerouslySetInnerHTML={{
                                                __html: chart.sourceLine
                                                    ? chart.sourceLine.toLowerCase().startsWith("source:")
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
                                <div className="hidden md:block font-serif text-[11px] tracking-[0.06em] uppercase shrink-0 pt-0.5">
                                    <strong className="font-bold not-italic text-[#6C56E5]">
                                        AI
                                    </strong>
                                    <span className="text-[#1e3a5f] font-bold">
                                        {" "}
                                        Behavior Index
                                    </span>
                                </div>
                            </div> */}
              <div className="mt-auto px-[20px] md:px-[28px] py-[12px] md:py-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95] h-[64px] overflow-hidden">
                <div className="flex-1 pr-3 min-w-0">
                  <div
                    className="line-clamp-2 leading-[1.5]"
                    title="Click card to view full source details"
                  >
                    Source:{" "}
                    <span
                      className="font-semibold source-line-link"
                      dangerouslySetInnerHTML={{
                        __html: (() => {
                          let raw =
                            chart.sourceLine || "Compiled by AI Behavior Index";

                          // 1. Rename old references
                          raw = raw.replace(/OneChat AI/g, "AI Behavior Index");

                          // 2. Remove leading "Source:" even if it's wrapped in HTML
                          raw = raw.replace(/^(<[^>]*>)*\s*source:\s*/i, "$1");

                          // 3. Look for an <a> tag anywhere in the string
                          const linkMatch = raw.match(/<a\b[^>]*>(.*?)<\/a>/i);

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
    </main>
  );
}
