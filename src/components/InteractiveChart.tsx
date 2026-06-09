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
  chartType: "vbar" | "hbar" | "line" | "donut" | "hero_stat";
  data: any;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Hero Stat UI mapped perfectly to your gradient card
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
            <span className="font-bold">↑</span> {data.trend.amount}{" "}
            {data.trend.direction === "up" ? "" : ""}
          </div>
        )}
      </>
    );
  }

  // Base options adapted dynamically based on screen size approximations
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

  if (chartType === "vbar") {
    return (
      <Bar
        data={{
          labels: data.data.map((d: any) => d.label),
          datasets: [
            {
              data: data.data.map((d: any) => d.value),
              backgroundColor: data.data.map(
                (d: any, i: number) => d.color || PALETTE[i % PALETTE.length],
              ),
              borderRadius: 4,
              maxBarThickness: isMobile ? 50 : 80,
            },
          ],
        }}
        options={{
          ...commonOptions,
          plugins: { ...commonOptions.plugins, legend: { display: false } },
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

  if (chartType === "hbar") {
    return (
      <Bar
        data={{
          labels: data.data.map((d: any) => d.label),
          datasets: [
            {
              data: data.data.map((d: any) => d.value),
              backgroundColor: data.data.map(
                (d: any, i: number) => d.color || PALETTE[0],
              ),
              borderRadius: 4,
              maxBarThickness: isMobile ? 22 : 28,
            },
          ],
        }}
        options={{
          ...commonOptions,
          indexAxis: "y",
          plugins: { ...commonOptions.plugins, legend: { display: false } },
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

  if (chartType === "donut") {
    return (
      <Doughnut
        data={{
          labels: data.data.map((d: any) => d.label),
          datasets: [
            {
              data: data.data.map((d: any) => d.value),
              backgroundColor: data.data.map(
                (d: any, i: number) => d.color || PALETTE[i % PALETTE.length],
              ),
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
                boxHeight: 12,
              },
            },
          },
        }}
      />
    );
  }

  if (chartType === "line") {
    return (
      <Line
        data={{
          labels: data.series[0].data.map((p: any) => p.x),
          datasets: data.series.map((s: any, i: number) => ({
            label: s.name,
            data: s.data.map((p: any) => p.y),
            borderColor: PALETTE[i % PALETTE.length],
            backgroundColor: `${PALETTE[i % PALETTE.length]}14`,
            borderWidth: 3,
            pointBackgroundColor: PALETTE[i % PALETTE.length],
            tension: 0.3,
            fill: true,
          })),
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
