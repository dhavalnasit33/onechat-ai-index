"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

const watermarkPlugin = {
  id: "watermark",
  afterDraw: (chart: any) => {
    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;

    ctx.save();

    const textAI = "AI";
    const textBehaviorIndex = " Behavior Index";
    const textURL = "aibehaviorindex.org";

    ctx.textBaseline = "bottom";

    // Line 1 Font
    ctx.font = "bold 11px sans-serif";
    const aiWidth = ctx.measureText(textAI).width;
    const behaviorWidth = ctx.measureText(textBehaviorIndex).width;
    const totalLine1Width = aiWidth + behaviorWidth;

    // Line 2 Font
    ctx.font = "normal 9px sans-serif";
    const urlWidth = ctx.measureText(textURL).width;

    const marginRight = 16;
    const marginBottom = 8;

    // Y positions
    const yLine2 = height - marginBottom;
    const yLine1 = yLine2 - 12;

    // Line 2 (URL)
    const xLine2Start = width - marginRight - urlWidth;
    ctx.fillStyle = "#888888";
    ctx.fillText(textURL, xLine2Start, yLine2);

    // Line 1 (AI Behavior Index)
    const xLine1Start = width - marginRight - totalLine1Width;
    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = "#6C56E5";
    ctx.fillText(textAI, xLine1Start, yLine1);

    ctx.fillStyle = "#1e3a5f";
    ctx.fillText(textBehaviorIndex, xLine1Start + aiWidth, yLine1);

    ctx.restore();
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  watermarkPlugin
);

// Statista Style Palette
const PALETTE = ["#088DFF", "#E5483F", "#F39323", "#0468BD", "#A8A8B0"];

import { ChartData } from "@/src/types";

export default function InteractiveChart({
  chartType,
  data,
}: {
  chartId: string;
  chartType: ChartData["chartType"];
  data: any;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const getValueAxisOptions = (axisLabel?: string) => {
    const prefix = data?.yPrefix || "";
    let suffix = "%";
    if (data?.ySuffix !== undefined) {
      suffix = data.ySuffix;
    } else {
      const hasLargeValues = (() => {
        if (data?.data && Array.isArray(data.data)) {
          return data.data.some((d: any) => (d.value ?? 0) > 100);
        }
        if (data?.series && Array.isArray(data.series)) {
          return data.series.some((s: any) =>
            s.data && Array.isArray(s.data) && s.data.some((dp: any) => (dp.y ?? dp.value ?? 0) > 100)
          );
        }
        return false;
      })();
      if (hasLargeValues) {
        suffix = "";
      }
    }

    let maxVal: number | undefined = undefined;
    if (data?.yMax !== undefined) {
      if (data.yMax === "auto" || data.yMax === "") {
        maxVal = undefined;
      } else {
        const num = Number(data.yMax);
        maxVal = isNaN(num) ? undefined : num;
      }
    } else {
      const maxInDataset = (() => {
        let currentMax = 0;
        if (data?.data && Array.isArray(data.data)) {
          data.data.forEach((d: any) => {
            const v = Number(d.value);
            if (!isNaN(v) && v > currentMax) currentMax = v;
          });
        }
        if (data?.series && Array.isArray(data.series)) {
          data.series.forEach((s: any) => {
            if (s.data && Array.isArray(s.data)) {
              s.data.forEach((dp: any) => {
                const v = Number(dp.y ?? dp.value);
                if (!isNaN(v) && v > currentMax) currentMax = v;
              });
            }
          });
        }
        return currentMax;
      })();

      if (maxInDataset <= 100 && suffix === "%") {
        maxVal = 100;
      } else {
        maxVal = undefined;
      }
    }

    return {
      beginAtZero: true,
      max: maxVal,
      ticks: {
        callback: (value: any) => {
          return `${prefix}${value}${suffix}`;
        },
        font: { size: isMobile ? 10 : 12 },
      },
      grid: { color: "#f0f0f0" },
      title: {
        display: !!axisLabel,
        text: axisLabel || "",
        font: { size: isMobile ? 10 : 11, weight: "bold" },
      },
    };
  };

  // 1. HERO STAT UI
  if (chartType === "hero_stat") {
    return (
      <>
        <div className="font-serif text-[56px] md:text-[96px] font-bold leading-none text-[#1e3a5f] tracking-[-1px] md:tracking-[-2px]">
          {data.value}
        </div>
        <div className="text-[14px] md:text-[19px] text-[#1a1a1a] mt-2 md:mt-3 font-medium leading-[1.4]">
          {data.label}
        </div>
        {data.trend && (
          <div className="inline-flex items-center gap-1 bg-white text-[#1d5436] text-[11px] md:text-[13px] font-semibold px-[10px] py-[4px] md:px-[14px] md:py-[6px] rounded-full border border-[#c7e7d4] mt-2.5 md:mt-4">
            <span className="font-bold">↑</span> {data.trend.amount}
          </div>
        )}
      </>
    );
  }

  // 2. TIMELINE MILESTONES UI (Image 2 & 3)
  if (chartType === "timeline") {
    const colors = ["#E5483F", "#F39323", "#088DFF", "#0468BD", "#10B981"];
    return (
      <div className="relative w-full text-left pb-12">
        <div className="flex flex-col gap-6 pr-2">
          {data.events?.map((event: any, idx: number) => {
            const eventColor = colors[idx % colors.length];
            return (
              <div key={idx} className="flex gap-4 items-start relative">
                <div 
                  className="min-w-[75px] text-[11px] font-bold uppercase tracking-wider pt-0.5"
                  style={{ color: eventColor }}
                >
                  {event.date}
                </div>
                <div className="relative border-l border-[#e5e5e5] pl-5 flex-1 pb-1">
                  <div 
                    className="absolute w-4 h-4 rounded-full bg-white -left-[8.5px] top-[4px]"
                    style={{ border: `3px solid ${eventColor}` }}
                  />
                  <h4 className="font-sans text-[13.5px] md:text-[14.5px] font-bold text-[#1a1a1a] mb-1">
                    {event.title}
                  </h4>
                  {(() => {
                    const desc = event.description || "";
                    const sourceIndex = desc.toLowerCase().indexOf("source:");
                    if (sourceIndex !== -1) {
                      const text = desc.substring(0, sourceIndex).trim();
                      const src = desc.substring(sourceIndex).trim();
                      return (
                        <>
                          <p className="text-[11.5px] md:text-[12.5px] text-[#555] leading-relaxed">
                            {text}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1.5 block italic font-sans">
                            {src}
                          </span>
                        </>
                      );
                    }
                    return (
                      <p className="text-[11.5px] md:text-[12.5px] text-[#555] leading-relaxed">
                        {desc}
                      </p>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-0 right-4 text-right select-none pointer-events-none">
          <div className="text-[11px] font-bold leading-tight">
            <span className="text-[#6C56E5]">AI</span>
            <span className="text-[#1e3a5f]"> Behavior Index</span>
          </div>
          <div className="text-[9px] text-[#888] leading-tight">
            aibehaviorindex.org
          </div>
        </div>
      </div>
    );
  }

  // 3. TEXT BLOCK / HYPE CALLOUT UI (Image 3)
  if (chartType === "text_block") {
    return (
      <div className="border border-[#E5483F]/20 bg-[#E5483F]/5 rounded-lg p-5 text-left border-l-[3px] border-l-[#E5483F] h-full flex flex-col justify-center">
        <p className="italic font-serif text-[13.5px] md:text-[15px] text-[#333] leading-relaxed">
          "{data.text || data.value}"
        </p>
        {data.author && (
          <span className="text-[11px] text-gray-500 mt-2.5 block font-sans font-medium">
            — {data.author}
          </span>
        )}
      </div>
    );
  }

  // Base configurations for Chart.js canvases
  const commonOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: "easeOutQuart" },
    layout: {
      padding: {
        bottom: 45,
      },
    },
    plugins: {
      tooltip: {
        padding: isMobile ? 8 : 10,
        backgroundColor: "rgba(26, 26, 46, 0.95)",
        titleFont: { size: isMobile ? 12 : 13, weight: "600" },
        bodyFont: { size: isMobile ? 11 : 12 },
        cornerRadius: 5,
        boxPadding: 5,
        displayColors: true,
      },
    },
  };

  // 4. VERTICAL BAR CHART (Supports flat or grouped bars side-by-side)
  if (chartType === "vbar") {
    const isGrouped = !!data.series;
    const chartLabels = isGrouped
      ? data.labels
      : data.data?.map((d: any) => d.label) || [];
    const datasets = isGrouped
      ? data.series.map((s: any, i: number) => ({
        label: s.name,
        data: s.data.map((dp: any) => dp.y),
        backgroundColor: s.color || PALETTE[i % PALETTE.length],
        borderRadius: 4,
        maxBarThickness: isMobile ? 24 : 40,
      }))
      : [
        {
          data: data.data?.map((d: any) => d.value) || [],
          backgroundColor:
            data.data?.map(
              (d: any, i: number) => d.color || PALETTE[i % PALETTE.length],
            ) || [],
          borderRadius: 4,
          maxBarThickness: isMobile ? 50 : 80,
        },
      ];

    return (
      <Bar
        data={{ labels: chartLabels, datasets }}
        options={{
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: { display: isGrouped, position: "bottom" },
          },
          scales: {
            y: getValueAxisOptions(data?.yLabel),
            x: {
              grid: { display: false },
              ticks: { font: { size: isMobile ? 10 : 12 } },
            },
          },
        }}
      />
    );
  }

  // 5. HORIZONTAL BAR CHART (Supports flat or grouped horizontal bars)
  if (chartType === "hbar") {
    const isGrouped = !!data.series;
    const chartLabels = isGrouped
      ? data.labels
      : data.data?.map((d: any) => d.label) || [];
    const datasets = isGrouped
      ? data.series.map((s: any, i: number) => ({
        label: s.name,
        data: s.data.map((dp: any) => dp.y),
        backgroundColor: s.color || PALETTE[i % PALETTE.length],
        borderRadius: 4,
        maxBarThickness: isMobile ? 14 : 20,
      }))
      : [
        {
          data: data.data?.map((d: any) => d.value) || [],
          backgroundColor:
            data.data?.map((d: any, i: number) => d.color || PALETTE[0]) ||
            [],
          borderRadius: 4,
          maxBarThickness: isMobile ? 22 : 28,
        },
      ];

    return (
      <Bar
        data={{ labels: chartLabels, datasets }}
        options={{
          ...commonOptions,
          indexAxis: "y",
          plugins: {
            ...commonOptions.plugins,
            legend: { display: isGrouped, position: "bottom" },
          },
          scales: {
            x: getValueAxisOptions(data?.yLabel),
            y: {
              grid: { display: false },
              ticks: { font: { size: isMobile ? 10.5 : 12 } },
            },
          },
        }}
      />
    );
  }

  // 6. DONUT CHART
  if (chartType === "donut") {
    return (
      <Doughnut
        data={{
          labels: data.data?.map((d: any) => d.label) || [],
          datasets: [
            {
              data: data.data?.map((d: any) => d.value) || [],
              backgroundColor:
                data.data?.map(
                  (d: any, i: number) => d.color || PALETTE[i % PALETTE.length],
                ) || [],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        }}
        options={{
          ...commonOptions,
          cutout: "62%",
          plugins: {
            ...commonOptions.plugins,
            legend: {
              display: true,
              position: isMobile ? "bottom" : "right",
              labels: {
                padding: isMobile ? 8 : 14,
                font: { size: isMobile ? 10 : 12, weight: "500" },
                boxWidth: 12,
              },
            },
          },
        }}
      />
    );
  }

  // 7. LINE TREND CHART
  if (chartType === "line") {
    return (
      <Line
        data={{
          labels: data.series?.[0]?.data?.map((p: any) => p.x) || [],
          datasets:
            data.series?.map((s: any, i: number) => ({
              label: s.name,
              data: s.data.map((p: any) => p.y),
              borderColor: s.color || PALETTE[i % PALETTE.length],
              backgroundColor: `${s.color || PALETTE[i % PALETTE.length]}14`,
              borderWidth: 3,
              pointBackgroundColor: s.color || PALETTE[i % PALETTE.length],
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.3,
              fill: true,
            })) || [],
        }}
        options={{
          ...commonOptions,
          interaction: { mode: "index", intersect: false },
          plugins: {
            ...commonOptions.plugins,
            legend: {
              display: true,
              position: "bottom",
              labels: {
                padding: 12,
                font: { size: isMobile ? 11 : 12, weight: "600" },
              },
            },
          },
          scales: {
            y: getValueAxisOptions(data?.yLabel),
            x: {
              grid: { display: false },
              ticks: { font: { size: isMobile ? 10 : 12 } },
              title: {
                display: !!data.xLabel,
                text: data.xLabel,
                font: { size: isMobile ? 10 : 11, weight: "bold" },
              },
            },
          },
        }}
      />
    );
  }

  return null;
}
