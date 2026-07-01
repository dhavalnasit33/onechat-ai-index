"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
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
  afterDraw: (chart: any, args: any, options: any) => {
    const { ctx, width, height, chartArea } = chart;

    // CRITICAL FIX: Do not draw the watermark until the chart grid is fully initialized.
    // This stops it from snapping to the far right edge of the card.
    if (!chartArea) return;

    ctx.save();

    const isRenderMode =
      typeof window !== "undefined" &&
      window.location.pathname.includes("/chart-render/");

    const font1 = isRenderMode
      ? "bold 14px sans-serif"
      : "bold 11px sans-serif";
    const font2 = isRenderMode
      ? "normal 11px sans-serif"
      : "normal 9px sans-serif";
    const spacing = isRenderMode ? 16 : 14;

    const textAI = "AI";
    const textBehaviorIndex = " Behavior Index";
    const textURL = "aibehaviorindex.org";

    ctx.textBaseline = "bottom";

    // Calculate Widths
    ctx.font = font1;
    const aiWidth = ctx.measureText(textAI).width;
    const behaviorWidth = ctx.measureText(textBehaviorIndex).width;
    const totalLine1Width = aiWidth + behaviorWidth;

    ctx.font = font2;
    const urlWidth = ctx.measureText(textURL).width;

    // --- HORIZONTAL ALIGNMENT ---
    // Because of the 'if (!chartArea) return;' check above, this is guaranteed
    // to align perfectly flush with the rightmost line of the chart grid (Images 3 & 4).
    const isDonut = options?.isDonut || false;
    const alignX = isDonut ? width - 8 : chartArea.right;

    // --- VERTICAL ALIGNMENT ---
    // Push it safely above the HTML dashed line.
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const marginBottom = isRenderMode ? 36 : isMobile ? 42 : 30;

    const yLine2 = height - marginBottom;
    const yLine1 = yLine2 - spacing;

    // Line 2 (URL)
    const xLine2Start = alignX - urlWidth;
    ctx.fillStyle = "#888888";
    ctx.fillText(textURL, xLine2Start, yLine2);

    // Line 1 (AI Behavior Index)
    const xLine1Start = alignX - totalLine1Width;
    ctx.font = font1;
    ctx.fillStyle = "#6C56E5";
    ctx.fillText(textAI, xLine1Start, yLine1);

    ctx.fillStyle = "#1e3a5f";
    ctx.fillText(textBehaviorIndex, xLine1Start + aiWidth, yLine1);

    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  watermarkPlugin,
);

// Statista Style Palette
const PALETTE = ["#088DFF", "#E5483F", "#F39323", "#0468BD", "#A8A8B0"];

import { ChartData } from "@/src/types";

export default function InteractiveChart({
  chartType,
  data,
  title,
}: {
  chartId: string;
  chartType: ChartData["chartType"];
  data: any;
  title: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isRenderMode =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/chart-render/");

  const formatLabel = (lbl: any) => {
    if (typeof lbl === "string") {
      const clean = lbl.replace(/\\n/g, "\n");
      if (clean.includes("\n")) {
        return clean.split("\n");
      }
      if (clean.length > 20 && clean.includes(" ")) {
        const words = clean.split(" ");
        const mid = Math.ceil(words.length / 2);
        return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
      }
    }
    return lbl;
  };

  if (!mounted) {
    return (
      <div className="min-h-[220px] flex items-center justify-center text-xs text-gray-400 font-sans">
        Loading chart...
      </div>
    );
  }

  const getValueAxisOptions = (
    axisLabel?: string,
    isRight: boolean = false,
  ) => {
    const prefix = isRight ? data?.y1Prefix || "" : data?.yPrefix || "";
    let suffix = "%";
    const ySuffixVal = isRight ? data?.y1Suffix : data?.ySuffix;
    const yFormatVal = isRight ? data?.y1Format : data?.yFormat;
    const yMaxVal = isRight ? data?.y1Max : data?.yMax;

    if (ySuffixVal !== undefined) {
      suffix = ySuffixVal;
    } else if (yFormatVal === "raw") {
      suffix = "";
    } else if (yFormatVal === "percentage") {
      suffix = "%";
    } else {
      const hasLargeValues = (() => {
        if (data?.data && Array.isArray(data.data)) {
          return data.data.some((d: any) => (d.value ?? 0) > 100);
        }
        if (data?.series && Array.isArray(data.series)) {
          return data.series.some(
            (s: any) =>
              s.data &&
              Array.isArray(s.data) &&
              s.data.some((dp: any) => (dp.y ?? dp.value ?? 0) > 100),
          );
        }
        return false;
      })();
      if (hasLargeValues) {
        suffix = "";
      }
    }

    let maxVal: number | undefined = undefined;
    if (yMaxVal !== undefined) {
      if (yMaxVal === "auto" || yMaxVal === "") {
        maxVal = undefined;
      } else {
        const num = Number(yMaxVal);
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
            const belongsToAxis = isRight ? s.useRightAxis : !s.useRightAxis;
            if (belongsToAxis && s.data && Array.isArray(s.data)) {
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

    let minVal: number | undefined = undefined;
    if (data?.useLogarithmicScale) {
      let datasetMin = Infinity;
      if (data?.data && Array.isArray(data.data)) {
        data.data.forEach((d: any) => {
          const v = Number(d.value);
          if (!isNaN(v) && v > 0 && v < datasetMin) datasetMin = v;
        });
      }
      if (data?.series && Array.isArray(data.series)) {
        data.series.forEach((s: any) => {
          if (s.data && Array.isArray(s.data)) {
            s.data.forEach((dp: any) => {
              const v = Number(dp.y ?? dp.value);
              if (!isNaN(v) && v > 0 && v < datasetMin) datasetMin = v;
            });
          }
        });
      }
      if (datasetMin !== Infinity) {
        const power = Math.floor(Math.log10(datasetMin));
        minVal = Math.pow(10, power - 1);
      }
    }

    const customLabels = isRight ? data?.customValueLabels1 : data?.customValueLabels;

    return {
      type: data?.useLogarithmicScale ? ("logarithmic" as const) : ("linear" as const),
      beginAtZero: data?.useLogarithmicScale ? false : true,
      min: minVal,
      max: maxVal,
      ticks: {
        display: data?.hideValueTicks ? false : true,
        callback: (value: any) => {
          if (customLabels && Array.isArray(customLabels)) {
            const index = Math.round(value);
            
            // Check if the dataset has values that require 1-indexing (i.e. > customLabels.length - 1)
            const hasValuesAboveLengthMinusOne = (() => {
              if (data.data && Array.isArray(data.data)) {
                return data.data.some((d: any) => Number(d.value) > customLabels.length - 1);
              }
              if (data.series && Array.isArray(data.series)) {
                return data.series.some((s: any) =>
                  s.data && Array.isArray(s.data) && s.data.some((dp: any) => Number(dp.y ?? dp.value) > customLabels.length - 1)
                );
              }
              return false;
            })();

            if (hasValuesAboveLengthMinusOne) {
              if (index === 0) return "";
              return customLabels[index - 1] ?? "";
            } else {
              return customLabels[index] ?? "";
            }
          }
          if (data?.useLogarithmicScale) {
            const log10 = Math.log10(value);
            if (Math.abs(log10 - Math.round(log10)) > 1e-9) {
              return "";
            }
            if (value >= 1e6) return `${prefix}${value / 1e6}M${suffix}`;
            if (value >= 1e3) return `${prefix}${value / 1e3}k${suffix}`;
            return `${prefix}${value}${suffix}`;
          }
          if (typeof value === "number" && value >= 1e3) {
            if (value >= 1e6) return `${prefix}${value / 1e6}M${suffix}`;
            return `${prefix}${value / 1e3}k${suffix}`;
          }
          return `${prefix}${value}${suffix}`;
        },
        stepSize: customLabels && Array.isArray(customLabels) ? 1 : undefined,
        font: { size: isRenderMode ? 14 : isMobile ? 10 : 12 },
      },
      grid: { color: "#f0f0f0" },
      title: {
        display: !!axisLabel,
        text: axisLabel || "",
        font: { size: isRenderMode ? 14 : isMobile ? 10 : 11, weight: "bold" },
      },
    };
  };

  // 1. HERO STAT UI
  if (chartType === "hero_stat") {
    // Determine suffix size formatting
    const isSmallSuffix = data.suffixSize === "small";

    return (
      <>
        <div className="font-serif text-[56px] md:text-[96px] font-bold leading-none text-[#1e3a5f] tracking-[-1px] md:tracking-[-2px] flex items-baseline flex-wrap">
          {data.prefix && (
            <span className="text-[32px] md:text-[56px] font-bold mr-1 align-baseline select-none">
              {data.prefix}
            </span>
          )}
          <span>{data.value}</span>
          {data.suffix && (
            <span
              className={`font-semibold ml-1 align-baseline text-[#1e3a5f] ${
                isSmallSuffix
                  ? "text-[20px] md:text-[32px] font-sans font-normal"
                  : "text-[40px] md:text-[80px]"
              }`}
            >
              {data.suffix}
            </span>
          )}
        </div>
        <div className="text-[14px] md:text-[19px] text-[#1a1a1a] mt-2 md:mt-3 font-medium leading-[1.4] max-w-[680px]">
          {data.label}
        </div>
        {/* {data.trend && (
          <div className="inline-flex items-center gap-1 bg-white text-[#1d5436] text-[11px] md:text-[13px] font-semibold px-[10px] py-[4px] md:px-[14px] md:py-[6px] rounded-full border border-[#c7e7d4] mt-2.5 md:mt-4">
            <span className="font-bold">↑</span> {data.trend.amount}
          </div>
        )} */}
        {data.trend && data.trend.amount && (
          <div
            className="inline-flex items-center gap-1 text-[11px] md:text-[13px] font-semibold px-[10px] py-[4px] md:px-[14px] md:py-[6px] rounded-full border mt-2.5 md:mt-4"
            style={{
              backgroundColor: data.trend.bgColor || "white",
              color: data.trend.textColor || (data.trend.direction === "down" ? "#b91c1c" : data.trend.direction === "up" ? "#1d5436" : "#4a4a55"),
              borderColor: data.trend.borderColor || data.trend.textColor || (data.trend.direction === "down" ? "#fca5a5" : data.trend.direction === "up" ? "#c7e7d4" : "#d7e3f0"),
            }}
          >
            {data.trend.direction === "up" && (
              <span className="font-bold">↑</span>
            )}
            {data.trend.direction === "down" && (
              <span className="font-bold">↓</span>
            )}
            {data.trend.amount}
          </div>
        )}
      </>
    );
  }
  // Helper to parse hex colors into rgba
  const getRgbaColor = (hex: string, alpha: number) => {
    if (!hex) return `rgba(229, 72, 63, ${alpha})`; // default #E5483F
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return `rgba(229, 72, 63, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // 2. TIMELINE MILESTONES UI (Image 2 & 3)
  if (chartType === "timeline") {
    const colors = ["#E5483F", "#F39323", "#088DFF", "#0468BD", "#10B981"];
    return (
      <div className="relative w-full text-left pb-12">
        <div className="flex flex-col gap-6 pr-2">
          {data.events?.map((event: any, idx: number) => {
            const eventColor = event.color || colors[idx % colors.length];
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
                    let text = desc;
                    let src = event.source || "";
                    if (!src && sourceIndex !== -1) {
                      text = desc.substring(0, sourceIndex).trim();
                      src = desc.substring(sourceIndex).trim();
                    }
                    return (
                      <>
                        <p className="text-[11.5px] md:text-[12.5px] text-[#555] leading-relaxed">
                          {text}
                        </p>
                        {src && (
                          <span className="text-[10px] text-gray-400 mt-1.5 block italic font-sans">
                            {src.toLowerCase().startsWith("source:")
                              ? src
                              : `Source: ${src}`}
                          </span>
                        )}
                      </>
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
    const quotes = data.quotes || [
      { text: data.text || data.value || "", author: data.author || "" },
    ];

    const isLegacy = !data.borderColor;
    const themeColor = data.color || "#E5483F";
    const borderColor = isLegacy ? themeColor : data.borderColor || "#E5483F";
    const bgCol = isLegacy
      ? getRgbaColor(themeColor, 0.05)
      : data.color || "#fdf2f2";
    const borderCol = isLegacy
      ? getRgbaColor(themeColor, 0.2)
      : getRgbaColor(borderColor, 0.2);

    return (
      <div
        style={{
          border: `1px solid ${borderCol}`,
          borderLeft: `3px solid ${borderColor}`,
          backgroundColor: bgCol,
        }}
        className=" p-5 text-left h-full flex flex-col gap-4 justify-center"
      >
        {quotes.map((quote: any, idx: number) => {
          const isHTML =
            quote.text &&
            (quote.text.includes("<div>") ||
              quote.text.includes("<p>") ||
              quote.text.includes("<br>") ||
              quote.text.includes("<strong>") ||
              quote.text.includes("<em>") ||
              quote.text.includes("<pre>") ||
              quote.text.includes("<code>") ||
              quote.text.includes("href="));

          return (
            <div
              key={idx}
              className="border-l-2 pl-4 py-1.5 first:mt-0 last:mb-0"
              style={{
                borderColor: getRgbaColor(borderColor, 0.3),
                ["--code-border-color" as any]: borderColor,
              }}
            >
              {isHTML ? (
                <div
                  className="font-serif text-[13.5px] md:text-[15px] text-[#555] leading-relaxed rich-text-content [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:mb-1 [&_blockquote]:pl-4 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:italic [&_pre]:border-l-[var(--code-border-color)] [&_pre]:border-l-4 [&_pre]:bg-gray-100/80 [&_pre]:p-3 [&_pre]:rounded-r [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-3 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:font-mono"
                  dangerouslySetInnerHTML={{ __html: quote.text }}
                />
              ) : (
                <p className="italic font-serif text-[13.5px] md:text-[15px] text-[#555] leading-relaxed">
                  {quote.text ? `"${quote.text}"` : ""}
                </p>
              )}
              {quote.author && (
                <span className="text-[11px] text-[#888] mt-0.5 block font-sans font-medium">
                  — {quote.author}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // 8. LIST BLOCK UI (Tailwinds / Headwinds / Multi-columns)
  if (chartType === "list_block") {
    // If the data contains multiple lists, render them side-by-side inside a standard card
    if (data.lists && Array.isArray(data.lists)) {
      return (
        <div className="bg-white border border-[#e5e5e5] rounded-[10px] p-[16px_16px_14px] md:p-[24px_28px] relative transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col text-left h-full w-full">
          {title && (
            <h2 className="font-serif text-[17px] md:text-[21px] font-bold text-[#1a1a1a] mb-4 md:mb-5 leading-[1.25]">
              {title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1">
            {data.lists.map((list: any, listIdx: number) => {
              const listThemeColor =
                list.borderColor || PALETTE[listIdx % PALETTE.length];
              const listBgCol =
                list.color || getRgbaColor(listThemeColor, 0.05);
              const listBorderCol = getRgbaColor(listThemeColor, 0.2);
              const bullet = list.bulletType === "circle" ? "●" : "→";

              return (
                <div
                  key={listIdx}
                  style={{
                    border: `1px solid ${listBorderCol}`,
                    borderLeft: `3px solid ${listThemeColor}`,
                    backgroundColor: listBgCol,
                  }}
                  className="rounded-lg p-5 md:p-6 flex flex-col overflow-y-auto"
                >
                  {list.title && (
                    <h3
                      style={{ color: list.titleColor || listThemeColor }}
                      className="font-sans text-[11px] md:text-[12px] tracking-[0.08em] uppercase font-bold mb-4"
                    >
                      {list.title}
                    </h3>
                  )}
                  <ul className="flex flex-col gap-3.5 m-0 p-0 list-none">
                    {(list.items || []).map((item: any, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-[13px] md:text-[14px] text-[#333] leading-relaxed"
                      >
                        <span
                          style={{ color: listThemeColor }}
                          className={`shrink-0 leading-none ${
                            list.bulletType === "circle"
                              ? "text-[12px] mt-[4px]"
                              : "text-[14px] font-bold mt-[2px]"
                          }`}
                        >
                          {bullet}
                        </span>
                        <div>
                          {item.boldText && (
                            <span className="font-bold text-[#1a1a1a] mr-1.5">
                              {item.boldText}
                            </span>
                          )}
                          <span
                            className="rich-text-content"
                            dangerouslySetInnerHTML={{ __html: item.text }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Default single list block fallback
    const items = data.items || [];
    const isLegacy = !data.borderColor;
    const themeColor = data.color || "#10B981"; // default green fallback
    const borderColor = isLegacy ? themeColor : data.borderColor || "#10B981";
    const bgCol = isLegacy
      ? getRgbaColor(themeColor, 0.05)
      : data.color || "#ecfdf5";
    const borderCol = isLegacy
      ? getRgbaColor(themeColor, 0.2)
      : getRgbaColor(borderColor, 0.2);
    const bullet = data.bulletType === "circle" ? "●" : "→";

    return (
      <div
        style={{
          border: `1px solid ${borderCol}`,
          borderLeft: `3px solid ${borderColor}`,
          backgroundColor: bgCol,
        }}
        className="rounded-lg p-5 md:p-6 text-left h-full flex flex-col overflow-y-auto"
      >
        {/* Render the title inside the block */}
        {title && (
          <h3
            style={{ color: borderColor }}
            className="font-serif text-[18px] md:text-[22px] font-bold mb-4 leading-tight"
          >
            {title}
          </h3>
        )}
        <ul className="flex flex-col gap-3.5 m-0 p-0 list-none">
          {items.map((item: any, idx: number) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-[13.5px] md:text-[15px] text-[#333] leading-relaxed"
            >
              <span
                style={{ color: borderColor }}
                className={`shrink-0 leading-none ${
                  data.bulletType === "circle"
                    ? "text-[12px] mt-[4px]"
                    : "text-[15px] font-bold mt-[2px]"
                }`}
              >
                {bullet}
              </span>
              <div>
                {item.boldText && (
                  <span className="font-bold text-[#1a1a1a] mr-1.5">
                    {item.boldText}
                  </span>
                )}
                <span
                  className="rich-text-content"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            </li>
          ))}
        </ul>
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
        bottom: isMobile ? 75 : 70,
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
        callbacks: {
          title: (tooltipItems: any) => {
            const idx = tooltipItems[0].dataIndex;
            let originalLabel = "";

            if (data?.data && Array.isArray(data.data) && data.data[idx]) {
              originalLabel = data.data[idx].label || "";
            } else if (data?.labels && Array.isArray(data.labels) && data.labels[idx]) {
              originalLabel = data.labels[idx] || "";
            } else {
              originalLabel = tooltipItems[0].label;
            }

            if (Array.isArray(originalLabel)) {
              originalLabel = originalLabel.join(" ");
            } else if (typeof originalLabel === "string") {
              originalLabel = originalLabel.replace(/\\n/g, " ").replace(/\n/g, " ");
            }

            let xVal = originalLabel;
            if (data?.tooltipTitleTemplate) {
              return data.tooltipTitleTemplate.replace("{x}", xVal);
            }
            const xLabel = data?.xLabel || "";
            const xLabelLower = xLabel.toLowerCase();
            if (xLabelLower.includes("year") && xLabelLower.includes("since")) {
              return `Year ${xVal} since launch`;
            }
            return xVal;
          },
          label: (tooltipItem: any) => {
            const datasetLabel = tooltipItem.dataset.label || "";
            const rawValue = tooltipItem.raw;

            // Look up the original item to see if there is custom tooltip text
            const item = (() => {
              if (data?.data && Array.isArray(data.data)) {
                return data.data[tooltipItem.dataIndex];
              }
              if (data?.series && Array.isArray(data.series)) {
                const s = data.series[tooltipItem.datasetIndex];
                const xVal = tooltipItem.label;
                const match = s?.data?.find(
                  (dp: any) => String(dp.x) === String(xVal),
                );
                return match || s?.data?.[tooltipItem.dataIndex];
              }
              return null;
            })();

            if (item) {
              const customVal =
                item.tooltip || item.hoverVal || item.tooltipVal;
              if (customVal) {
                if (chartType === "donut" && tooltipItem.label) {
                  return `${tooltipItem.label}: ${customVal}`;
                }
                return datasetLabel
                  ? `${datasetLabel}: ${customVal}`
                  : customVal;
              }
            }

            const useRight =
              !!tooltipItem.dataset.yAxisID &&
              tooltipItem.dataset.yAxisID === "y1";
            const prefix = useRight
              ? data?.y1Prefix || ""
              : data?.yPrefix || "";

            let suffix = "%";
            const ySuffixVal = useRight ? data?.y1Suffix : data?.ySuffix;
            const yFormatVal = useRight ? data?.y1Format : data?.yFormat;

            if (ySuffixVal !== undefined) {
              suffix = ySuffixVal;
            } else if (yFormatVal === "raw") {
              suffix = "";
            } else if (yFormatVal === "percentage") {
              suffix = "%";
            } else {
              const hasLargeValues = (() => {
                if (data?.data && Array.isArray(data.data)) {
                  return data.data.some((d: any) => (d.value ?? 0) > 100);
                }
                if (data?.series && Array.isArray(data.series)) {
                  return data.series.some((s: any) =>
                    s.data?.some((dp: any) => (dp.y ?? dp.value ?? 0) > 100),
                  );
                }
                return false;
              })();
              if (hasLargeValues) suffix = "";
            }

            let formattedValue = `${prefix}${rawValue}${suffix}`;

            if (
              data?.tooltipValueSuffix !== undefined &&
              data.tooltipValueSuffix !== null
            ) {
              if (data.tooltipValueSuffix !== "") {
                formattedValue += ` ${data.tooltipValueSuffix}`;
              }
            } else {
              const titleLower = (data?.title || "").toLowerCase();
              const yLabelLower = (data?.yLabel || "").toLowerCase();
              const isUsAdoption =
                (yLabelLower.includes("adopt") && titleLower.includes("us")) ||
                (titleLower.includes("adopt") && titleLower.includes("us"));

              if (isUsAdoption) {
                formattedValue += " US adoption";
              }
            }

            if (chartType === "donut" && tooltipItem.label) {
              return `${tooltipItem.label}: ${formattedValue}`;
            }
            return datasetLabel
              ? `${datasetLabel}: ${formattedValue}`
              : formattedValue;
          },
        },
      },
    },
  };

  // 4. VERTICAL BAR CHART (Supports flat or grouped bars side-by-side)
  if (chartType === "vbar") {
    const isGrouped = !!data.series;
    const chartLabels = (
      isGrouped ? data.labels : data.data?.map((d: any) => d.label) || []
    ).map(formatLabel);
    const datasets = isGrouped
      ? data.series.map((s: any, i: number) => ({
          label: s.name,
          data: s.data.map((dp: any) => dp.y),
          backgroundColor: s.color || PALETTE[i % PALETTE.length],
          borderRadius: 4,
          maxBarThickness: isMobile ? 24 : 45,
          barPercentage: 0.92,
          categoryPercentage: chartLabels.length < 4 ? 0.45 : 0.8,
          yAxisID: s.useRightAxis ? "y1" : "y",
        }))
      : [
          {
            data: data.data?.map((d: any) => d.value) || [],
            backgroundColor:
              data.data?.map(
                (d: any, i: number) => d.color || PALETTE[i % PALETTE.length],
              ) || [],
            borderRadius: 4,
            maxBarThickness: isMobile ? 40 : 60,
            barPercentage: 0.8,
            categoryPercentage: chartLabels.length < 4 ? 0.45 : 0.6,
          },
        ];

    return (
      <Bar
        data={{ labels: chartLabels, datasets }}
        options={{
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              display: isGrouped,
              position: "bottom",
              labels: {
                font: { size: isRenderMode ? 13 : 12, weight: "600" },
              },
            },
          },
          scales: {
            y: {
              ...getValueAxisOptions(data?.yLabel),
              stacked: !!data.stacked,
            },
            ...(data.enableRightYAxis
              ? {
                  y1: {
                    ...getValueAxisOptions(data?.y1Label, true),
                    type: "linear" as const,
                    position: "right" as const,
                    grid: { drawOnChartArea: false },
                    stacked: !!data.stacked,
                  },
                }
              : {}),
            x: {
              grid: { display: false },
              ticks: { font: { size: isRenderMode ? 14 : isMobile ? 10 : 12 } },
              stacked: !!data.stacked,
            },
          },
        }}
      />
    );
  }

  // 5. HORIZONTAL BAR CHART (Supports flat or grouped horizontal bars)
  if (chartType === "hbar") {
    const isGrouped = !!data.series;
    const chartLabels = (
      isGrouped ? data.labels : data.data?.map((d: any) => d.label) || []
    ).map(formatLabel);
    const datasets = isGrouped
      ? data.series.map((s: any, i: number) => ({
          label: s.name,
          data: s.data.map((dp: any) => dp.y),
          backgroundColor: s.color || PALETTE[i % PALETTE.length],
          borderRadius: 4,
          maxBarThickness: isMobile ? 24 : 40,
          barPercentage: 0.92,
          categoryPercentage: chartLabels.length < 4 ? 0.45 : 0.8,
        }))
      : [
          {
            data: data.data?.map((d: any) => d.value) || [],
            backgroundColor:
              data.data?.map((d: any, i: number) => d.color || PALETTE[0]) ||
              [],
            borderRadius: 4,
            maxBarThickness: isMobile ? 28 : 36,
            barPercentage: 0.8,
            categoryPercentage: chartLabels.length < 4 ? 0.45 : 0.6,
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
            legend: {
              display: isGrouped,
              position: "bottom",
              labels: {
                font: { size: isRenderMode ? 13 : 12, weight: "600" },
              },
            },
          },
          scales: {
            x: {
              ...getValueAxisOptions(data?.yLabel),
              stacked: !!data.stacked,
            },
            y: {
              grid: { display: false },
              ticks: {
                font: { size: isRenderMode ? 14 : isMobile ? 10.5 : 12 },
              },
              stacked: !!data.stacked,
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
                font: {
                  size: isRenderMode ? 13 : isMobile ? 10 : 12,
                  weight: "500",
                },
                boxWidth: 12,
              },
            },
            watermark: {
              isDonut: true,
            },
          },
        }}
      />
    );
  }

  // 7. LINE TREND CHART
  if (chartType === "line") {
    // Use data.labels directly if defined, otherwise generate and sort if numeric
    const sortedLabels = (() => {
      if (data.labels && Array.isArray(data.labels)) {
        return [...data.labels];
      }
      const allXValues = Array.from(
        new Set(
          data.series?.flatMap((s: any) => s.data?.map((p: any) => p.x)) || [],
        ),
      ).filter(Boolean);

      const isAllNumeric = allXValues.every((x: any) => !isNaN(Number(x)));
      if (isAllNumeric) {
        return allXValues.sort((a: any, b: any) => Number(a) - Number(b));
      }
      return allXValues; // Keep original order of appearance if not all numeric
    })();

    // Filter labels based on custom xMax limit
    const filteredLabels = (() => {
      let labs = sortedLabels;
      if (data.xMax !== undefined && data.xMax !== "" && data.xMax !== null) {
        const xMaxNum = Number(data.xMax);
        if (!isNaN(xMaxNum)) {
          labs = labs.filter((label: any) => {
            const num = Number(label);
            return isNaN(num) || num <= xMaxNum;
          });
        }
      }
      return labs;
    })();

    return (
      <Line
        data={{
          labels: filteredLabels.map(formatLabel),
          datasets:
            data.series?.map((s: any, i: number) => ({
              label: s.name,
              data: filteredLabels.map((xVal: any) => {
                const match = s.data?.find(
                  (p: any) => String(p.x) === String(xVal),
                );
                return match && match.y !== undefined && match.y !== ""
                  ? Number(match.y)
                  : null;
              }),
              segmentStyles: filteredLabels.map((xVal: any) => {
                const match = s.data?.find(
                  (p: any) => String(p.x) === String(xVal),
                );
                return match ? match.segmentStyle || "solid" : "solid";
              }),
              borderColor: s.color || PALETTE[i % PALETTE.length],
              backgroundColor: `${s.color || PALETTE[i % PALETTE.length]}14`,
              borderWidth: 3,
              pointBackgroundColor: s.color || PALETTE[i % PALETTE.length],
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: data.stepped ? 0 : 0.3,
              stepped: data.stepped || false,
              fill: true,
              spanGaps: false,
              yAxisID: s.useRightAxis ? "y1" : "y",
              segment: {
                borderDash: (ctx: any) => {
                  const index =
                    ctx.p0DataIndex !== undefined
                      ? ctx.p0DataIndex
                      : ctx.p0?.$context?.index;
                  if (index === undefined) return undefined;
                  const xVal = filteredLabels[index];
                  const match = s.data?.find(
                    (p: any) => String(p.x) === String(xVal),
                  );
                  const targetStyle = match ? match.segmentStyle : "solid";
                  if (targetStyle === "dashed") {
                    return [6, 6];
                  }
                  if (targetStyle === "dotted") {
                    return [2, 3];
                  }
                  return undefined;
                },
              },
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
                font: {
                  size: isRenderMode ? 13 : isMobile ? 11 : 12,
                  weight: "600",
                },
              },
            },
          },
          scales: {
            y: getValueAxisOptions(data?.yLabel),
            ...(data.enableRightYAxis
              ? {
                  y1: {
                    ...getValueAxisOptions(data?.y1Label, true),
                    type: "linear" as const,
                    position: "right" as const,
                    grid: { drawOnChartArea: false },
                  },
                }
              : {}),
            x: {
              grid: { display: false },
              ticks: { font: { size: isRenderMode ? 14 : isMobile ? 10 : 12 } },
              title: {
                display: !!data.xLabel,
                text: data.xLabel,
                font: {
                  size: isRenderMode ? 14 : isMobile ? 10 : 11,
                  weight: "bold",
                },
              },
            },
          },
        }}
      />
    );
  }

  return null;
}
