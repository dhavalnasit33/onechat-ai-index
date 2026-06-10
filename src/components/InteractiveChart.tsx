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
);

// Statista Style Palette
const PALETTE = ["#088DFF", "#E5483F", "#F39323", "#0468BD", "#A8A8B0"];

export default function InteractiveChart({
  chartType,
  data,
}: {
  chartId: string;
  chartType:
    | "vbar"
    | "hbar"
    | "line"
    | "donut"
    | "hero_stat"
    | "timeline"
    | "text_block";
  data: any;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
    return (
      <div className="flex flex-col gap-5 overflow-y-auto h-full pr-2 text-left custom-scrollbar">
        {data.events?.map((event: any, idx: number) => (
          <div key={idx} className="flex gap-4 items-start relative pb-1">
            <div className="min-w-[75px] text-[11px] font-bold uppercase tracking-wider text-[#088DFF] pt-0.5">
              {event.date}
            </div>
            <div className="relative border-l border-[#e5e5e5] pl-4 flex-1">
              <div className="absolute w-2 h-2 rounded-full bg-[#088DFF] -left-[4.5px] top-[7px]" />
              <h4 className="font-sans text-[13.5px] md:text-[14.5px] font-bold text-[#1a1a1a] mb-1">
                {event.title}
              </h4>
              <p className="text-[11.5px] md:text-[12.5px] text-[#555] leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
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
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (v) => v + "%",
                font: { size: isMobile ? 10 : 12 },
              },
              grid: { color: "#f0f0f0" },
            },
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
            x: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (v) => v + "%",
                font: { size: isMobile ? 10 : 12 },
              },
              grid: { color: "#f0f0f0" },
            },
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
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (v) => v + "%",
                font: { size: isMobile ? 10 : 12 },
              },
              grid: { color: "#f0f0f0" },
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: isMobile ? 10 : 12 } },
            },
          },
        }}
      />
    );
  }

  return null;
}
