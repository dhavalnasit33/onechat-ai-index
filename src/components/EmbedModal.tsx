"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ChartData } from "@/src/types";

export default function EmbedModal({
  isOpen,
  onClose,
  chart,
  categorySlug,
  topicSlug,
  topicTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  chart: ChartData | null;
  categorySlug: string;
  topicSlug: string;
  topicTitle: string;
}) {
  const [activeTab, setActiveTab] = useState<"html" | "markdown" | "citation">(
    "html",
  );
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !chart) return null;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";
  const chartName = chart.heading || chart.title;
  const chartId = chart.chartId;

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const getCleanSourceLine = () => {
    let src = chart.sourceLine || "";
    if (!src) return "Compiled by AI Behavior Index";
    src = src.replace(/OneChat AI/g, "AI Behavior Index");
    return src.toLowerCase().startsWith("source:") ? src : `Source: ${src}`;
  };

  const getHtmlCode = () => {
    if (chart.chartType === "hero_stat") {
      const trendHtml = chart.data?.trend
        ? `\n  <div style="display: inline-flex; align-items: center; gap: 4px; background-color: #ffffff; color: #1d5436; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; border: 1px solid #c7e7d4; margin-bottom: 12px;">\n    <span>↑</span> ${chart.data.trend.amount}\n  </div>`
        : "";
      const prefixHtml = chart.data?.prefix ? `<span style="font-size: 28px; font-weight: bold; margin-right: 2px; color: #1e3a5f; align-baseline: middle;">${chart.data.prefix}</span>` : "";
      const isSmallSuffix = chart.data?.suffixSize === "small";
      const suffixHtml = chart.data?.suffix 
        ? `<span style="${isSmallSuffix ? "font-size: 16px; font-weight: normal; font-family: sans-serif;" : "font-size: 36px; font-weight: 600;"} color: #1e3a5f; margin-left: 2px; align-baseline: middle;">${chart.data.suffix}</span>` 
        : "";
      return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 1px solid #e5e5e5; border-radius: 12px; padding: 24px; max-width: 480px; background: linear-gradient(135deg, #eaf2fb 0%, #d8e6f5 100%); box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; box-sizing: border-box;">\n  <div style="font-family: Georgia, Cambria, 'Times New Roman', Times, serif; font-size: 56px; font-weight: bold; line-height: 1; color: #1e3a5f; margin: 0 0 8px; display: flex; align-items: baseline; justify-content: center; flex-wrap: wrap;">\n    ${prefixHtml}${chart.data?.value}${suffixHtml}\n  </div>\n  <div style="font-size: 14px; color: #1a1a1a; font-weight: 500; line-height: 1.45; margin: 0 0 14px;">\n    ${chart.data?.label}\n  </div>${trendHtml}\n  <div style="border-top: 1px solid rgba(30, 58, 95, 0.15); padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #666; gap: 12px; text-align: left;">\n    <span style="max-width: 75%; line-height: 1.35;">${getCleanSourceLine()}</span>\n    <a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId}" target="_blank" style="color: #6C56E5; font-weight: 600; text-decoration: none; white-space: nowrap; margin-left: auto;">\n      View index\n    </a>\n  </div>\n</div>`;
    }
    return `<a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId}" target="_blank">\n  <img src="${baseUrl}/chart-images/${chartId}.png" alt="${chartName}. — AI Behavior Index" width="600" height="400" loading="lazy" style="max-width: 100%; height: auto; border: 1px solid #e5e5e5;" />\n</a>\n<p style="font-size: 12px; color: #666; margin-top: 4px;">\n  Source: <a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId}" target="_blank">AI Behavior Index</a>\n</p>`;
  };

  const getMarkdownCode = () => {
    if (chart.chartType === "hero_stat") {
      const trendText = chart.data?.trend ? `\n> **↑ ${chart.data.trend.amount}**\n>` : "";
      const displayVal = `${chart.data?.prefix || ""}${chart.data?.value}${chart.data?.suffix || ""}`;
      return `> ### **${displayVal}**\n> **${chart.data?.label}**\n>${trendText}\n> *[${stripHtml(getCleanSourceLine())}](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId})*`;
    }
    return `[![${chartName}. — AI Behavior Index](${baseUrl}/chart-images/${chartId}.png)](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId})\n\n*Source: [AI Behavior Index](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId})*`;
  };

  const getCitationCode = () =>
    `AI Behavior Index. (2026). "${topicTitle}." Retrieved from ${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/`;

  const copyCode = async () => {
    const codeToCopy =
      activeTab === "html"
        ? getHtmlCode()
        : activeTab === "markdown"
          ? getMarkdownCode()
          : getCitationCode();
    await navigator.clipboard.writeText(codeToCopy);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/55 z-[200] flex items-end md:items-center justify-center transition-opacity"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white w-full max-w-[640px] rounded-t-[16px] md:rounded-xl max-h-[88vh] overflow-y-auto relative flex flex-col transition-transform animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
          <div className="w-[40px] h-[4px] bg-[#d0d0d0] rounded-full mx-auto mt-2.5 mb-1 md:hidden"></div>

          <div className="p-[12px_18px_16px] md:p-[20px_28px] border-b border-[#e5e5e5] flex justify-between items-center">
            <h2 className="font-serif text-[16px] md:text-[19px] text-[#1a1a1a]">
              Embed this chart
            </h2>
            <button
              className="cursor-pointer text-[#888] hover:text-[#1a1a1a] hover:bg-[#fafafc] rounded p-1 leading-none"
              onClick={onClose}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="p-[16px_18px_24px] md:p-[24px_28px]">
            {/* Chart Image Preview */}
            <div className="mb-4 border border-[#e5e5e5] rounded-md overflow-hidden bg-[#fafafc] flex flex-col p-3">
              <div className="text-[10px] uppercase tracking-[0.6px] font-bold text-[#888] mb-2">
                Preview
              </div>
              <div className="flex items-center justify-center bg-white border border-[#e5e5e5] rounded p-2 min-h-[120px] w-full">
                {chart.chartType === "hero_stat" ? (
                  <div className="bg-gradient-to-br from-[#eaf2fb] to-[#d8e6f5] rounded-xl p-[24px_20px] text-center relative overflow-hidden w-full max-w-[480px] border border-[#e5e5e5]">
                    <div className="font-serif text-[44px] md:text-[56px] font-bold leading-none text-[#1e3a5f] mb-2 flex items-baseline justify-center flex-wrap">
                      {chart.data?.prefix && (
                        <span className="text-[24px] font-bold mr-0.5 align-baseline text-[#1e3a5f]">
                          {chart.data.prefix}
                        </span>
                      )}
                      <span>{chart.data?.value}</span>
                      {chart.data?.suffix && (
                        <span
                          className={`font-semibold ml-0.5 align-baseline text-[#1e3a5f] ${
                            chart.data.suffixSize === "small"
                              ? "text-[16px] font-sans font-normal"
                              : "text-[32px]"
                          }`}
                        >
                          {chart.data.suffix}
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] md:text-[14px] text-[#1a1a1a] font-medium leading-[1.45] mb-4">
                      {chart.data?.label}
                    </div>
                    {chart.data?.trend && (
                      <div className="inline-flex items-center gap-1 bg-white text-[#1d5436] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#c7e7d4] mb-4">
                        <span>↑</span> {chart.data.trend.amount}
                      </div>
                    )}
                    <div className="border-t border-[#1e3a5f]/15 pt-3 flex justify-between items-center text-[10.5px] text-[#666] gap-3">
                      <span 
                        className="text-left max-w-[75%] leading-[1.35] source-line-link"
                        dangerouslySetInnerHTML={{ __html: getCleanSourceLine() }}
                      />
                      <span className="text-[#6C56E5] font-semibold hover:underline whitespace-nowrap ml-auto">
                        View index
                      </span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={`${baseUrl}/chart-images/${chartId}.png`}
                    alt={`${chartName} Preview`}
                    className="max-h-[160px] w-auto object-contain"
                    onError={(e) => {
                      // fallback if not yet generated or error
                      e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23888'>Preview Loading...</text></svg>";
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bg-[#fafafc] rounded-md p-[12px_14px] md:p-4 mb-3.5 md:mb-5 text-[12px] md:text-[13px]">
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.6px] font-bold text-[#888] mb-1">
                Embedding
              </div>
              <div className="font-semibold text-[#1a1a1a]">{chartName}</div>
            </div>

            <div className="flex border-b border-[#e5e5e5] mb-3 md:mb-4">
              {["html", "markdown", "citation"].map((tab) => (
                <button
                  key={tab}
                  className={`cursor-pointer flex-1 md:flex-none px-3 py-2 text-[11.5px] md:text-[13px] font-semibold border-b-2 capitalize transition-colors ${activeTab === tab ? "text-[#6C56E5] border-[#6C56E5]" : "text-[#888] border-transparent"}`}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <pre className="bg-[#1a1a2e] text-[#e6e6f0] p-[12px_14px] md:p-[16px_18px] rounded-md font-mono text-[10.5px] md:text-[12px] leading-[1.5] md:leading-[1.55] whitespace-pre-wrap break-all max-h-[200px] md:max-h-[240px] overflow-y-auto">
              {activeTab === "html"
                ? getHtmlCode()
                : activeTab === "markdown"
                  ? getMarkdownCode()
                  : getCitationCode()}
            </pre>

            <div className="mt-3.5 md:mt-4 flex justify-end">
              <button
                className="cursor-pointer w-full md:w-auto bg-[#6C56E5] text-white px-5 py-3 md:py-2.5 rounded-lg md:rounded-md font-semibold text-[14px] md:text-[13px] hover:bg-[#4c3aae] transition-colors"
                onClick={copyCode}
              >
                Copy code
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-[24px] md:bottom-[32px] left-1/2 -translate-x-1/2 bg-[#1d5436] text-white px-[18px] md:px-[22px] py-[10px] md:py-[12px] rounded-md text-[12px] md:text-[13px] font-semibold z-[300] shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-200 pointer-events-none ${showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        Copied to clipboard!
      </div>
    </>
  );
}
