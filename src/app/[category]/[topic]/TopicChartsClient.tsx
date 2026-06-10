"use client";

import React, { useState } from "react";
import InteractiveChart from "@/src/components/InteractiveChart";
import EmbedModal from "@/src/components/EmbedModal";

interface ChartData {
  _id: string;
  chartId: string;
  position: number;
  title: string;
  heading?: string;
  icon?: string;
  chartType: "vbar" | "hbar" | "line" | "donut" | "hero_stat" | "timeline" | "text_block";
  data: any;
  sourceLine?: string;
  sources?: any[];
}

export default function TopicChartsClient({
  charts,
  categorySlug,
  topicSlug,
  topicTitle,
}: {
  charts: ChartData[];
  categorySlug: string;
  topicSlug: string;
  topicTitle: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState({ name: "", id: "" });

  const openModal = (name: string, id: string) => {
    setActiveChart({ name, id });
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Add this new function here:
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  const heroStatChart = charts.find((c) => c.chartType === "hero_stat");
  const regularCharts = charts
    .filter((c) => c.chartType !== "hero_stat")
    .sort((a, b) => a.position - b.position);

  return (
    <>
      {/* HERO STAT CARD */}
      {heroStatChart && (
        <div className="bg-gradient-to-br from-[#eaf2fb] to-[#d8e6f5] rounded-xl p-[24px_20px] md:p-[48px_56px] mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-10 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[140px] md:w-[240px] h-[140px] md:h-[240px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(108,86,229,0.08), transparent 70%)",
            }}
          ></div>
          <div className="relative z-10 flex-1">
            <InteractiveChart
              chartId={heroStatChart.chartId}
              chartType="hero_stat"
              data={heroStatChart.data}
            />
          </div>

          {/* Mobile Actions / Desktop Absolute positioning logic combined dynamically */}
          <div className="relative z-10 mt-3 pt-3 border-t border-[#1e3a5f]/15 md:border-none md:mt-0 md:pt-0 flex items-center justify-between gap-2 md:block md:static">
            <div className="text-[10px] md:text-[11px] text-[#888] leading-[1.4] flex-1 md:absolute md:bottom-[20px] md:right-[24px]">
              Source: {heroStatChart.sourceLine || "Compiled by OneChat AI"}
            </div>
            <button
              onClick={() =>
                openModal(
                  heroStatChart.heading || heroStatChart.title,
                  heroStatChart.chartId,
                )
              }
              className="cursor-pointer bg-white border border-[#d0d0d0] text-[#1a1a1a] px-[12px] py-[6px] md:px-[14px] md:py-[6px] rounded-md text-[11.5px] md:text-[12px] font-semibold flex items-center gap-1.5 hover:bg-[#eaf2fb] hover:border-[#1e3a5f] hover:text-[#1e3a5f] md:absolute md:top-[20px] md:right-[24px]"
            >
              <span className="font-mono text-[#6C56E5] font-bold text-[11px]">
                {"</>"}
              </span>{" "}
              Embed
            </button>
          </div>
        </div>
      )}

      {/* CHART GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-6">
        {regularCharts.map((chart, idx) => {
          // Typically Line charts or position 1, 5 take full width like in the HTML design
         const isFullWidth =
  chart.chartType === "line" ||
  chart.chartType === "timeline" ||
  chart.chartType === "text_block" ||
  chart.position === 1 ||
  chart.position === 5;
          return (
            <div
              key={chart._id}
              className={`bg-white border border-[#e5e5e5] rounded-[10px] p-[16px_16px_14px] md:p-[24px_28px] relative transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col ${isFullWidth ? "md:col-span-2" : ""}`}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-1.5 md:mb-2">
                <div className="flex-1">
                  <div className="text-[10px] md:text-[11px] text-[#888] uppercase tracking-[0.6px] md:tracking-[0.8px] font-semibold mb-1">
                    Chart {chart.position} ·{" "}
                    {chart.chartType === "donut" ? "Preference" : "Comparison"}
                  </div>
                  <div className="font-serif text-[15.5px] md:text-[20px] font-bold text-[#1a1a1a] leading-[1.25] flex items-center gap-2">
                    {chart.icon && (
                      <span className="text-lg md:text-xl flex items-center justify-center w-5 h-5 md:w-6 md:h-6 shrink-0">
                        {chart.icon.startsWith("http") ||
                        chart.icon.startsWith("/") ? (
                          <img
                            src={chart.icon}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          chart.icon
                        )}
                      </span>
                    )}
                    <span>{chart.heading || chart.title}</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    openModal(chart.heading || chart.title, chart.chartId)
                  }
                  className="cursor-pointer hidden md:flex bg-white border border-[#d0d0d0] text-[#1a1a1a] px-[14px] py-[6px] rounded-md text-[12px] font-semibold items-center gap-1.5 hover:bg-[#eaf2fb] hover:border-[#1e3a5f] hover:text-[#1e3a5f] whitespace-nowrap"
                >
                  <span className="font-mono text-[#6C56E5] font-bold text-[11px]">
                    {"</>"}
                  </span>{" "}
                  Embed
                </button>
              </div>

              {/* Chart Container */}
             <div
  className={`relative w-full mt-2 md:mt-3 ${
    chart.chartType === "timeline" ? "h-auto max-h-[400px] py-2" :
    chart.chartType === "text_block" ? "h-auto py-4" :
    chart.chartType === "donut" ? "h-[220px] md:h-[320px]" : 
    chart.chartType === "hbar" ? "h-[280px] md:h-[320px]" : "h-[240px] md:h-[320px]"
  }`}
>
                <InteractiveChart
                  chartId={chart.chartId}
                  chartType={chart.chartType}
                  data={chart.data}
                />
              </div>

              {/* Source & Mobile Embed */}
              <div className="mt-2.5 md:mt-4 pt-2 md:pt-3 border-t border-dashed border-[#e5e5e5] text-[10.5px] md:text-[12px] text-[#555] leading-[1.5]">
                <span className="font-semibold text-[#1a1a1a] uppercase tracking-[0.4px] md:tracking-[0.5px] text-[9.5px] md:text-[10.5px]">
                  Source:{" "}
                </span>
                {chart.sources && chart.sources.length > 0 ? (
                  chart.sources.map((src, i) => (
                    <span key={i}>
                      {i > 0 && "; "}
                      {src.sourceUrl ? (
                        <a
                          href={src.sourceUrl}
                          target="_blank"
                          className="text-[#6C56E5] hover:underline"
                        >
                          {src.sourceName}
                        </a>
                      ) : (
                        src.sourceName
                      )}
                    </span>
                  ))
                ) : (
                  <span>{chart.sourceLine}</span>
                )}
              </div>
              <button
                onClick={() =>
                  openModal(chart.heading || chart.title, chart.chartId)
                }
                className="cursor-pointer md:hidden mt-2.5 w-full bg-white border border-[#d0d0d0] text-[#1a1a1a] py-2 rounded-md text-[12px] font-semibold flex items-center justify-center gap-1.5 min-h-[38px]"
              >
                <span className="font-mono text-[#6C56E5] font-bold text-[11px]">
                  {"</>"}
                </span>{" "}
                Embed this chart
              </button>
            </div>
          );
        })}
      </div>
      <EmbedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        chartName={activeChart.name}
        chartId={activeChart.id}
        categorySlug={categorySlug}
        topicSlug={topicSlug}
        topicTitle={topicTitle}
      />
    </>
  );
}
