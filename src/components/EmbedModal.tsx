"use client";
import React, { useState, useEffect } from "react";

export default function EmbedModal({
  isOpen,
  onClose,
  chartName,
  chartId,
  categorySlug,
  topicSlug,
  topicTitle,
}: any) {
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

  if (!isOpen) return null;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";

  const getHtmlCode = () =>
    `<a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId}" target="_blank">\n  <img src="${baseUrl}/chart-images/${chartId}.png" alt="${chartName} — OneChat AI Behavior Index" width="600" height="400" style="max-width: 100%; height: auto; border: 1px solid #e5e5e5;" />\n</a>\n<p style="font-size: 11px; color: #666; margin-top: 4px;">\n  Source: <a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/" target="_blank">OneChat AI Behavior Index</a>\n</p>`;
  const getMarkdownCode = () =>
    `[![${chartName}](${baseUrl}/chart-images/${chartId}.png)](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId})\n\n*Source: [OneChat AI Behavior Index](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/)*`;
  const getCitationCode = () =>
    `OneChat AI. (2026). "${topicTitle}." AI Behavior Index.\nRetrieved from ${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/`;

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
              className="text-[24px] text-[#888] hover:text-[#1a1a1a] hover:bg-[#fafafc] rounded px-2 leading-none"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          <div className="p-[16px_18px_24px] md:p-[24px_28px]">
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
                  className={`flex-1 md:flex-none px-3 py-2 text-[11.5px] md:text-[13px] font-semibold border-b-2 capitalize transition-colors ${activeTab === tab ? "text-[#6C56E5] border-[#6C56E5]" : "text-[#888] border-transparent"}`}
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
                className="w-full md:w-auto bg-[#6C56E5] text-white px-5 py-3 md:py-2.5 rounded-lg md:rounded-md font-semibold text-[14px] md:text-[13px] hover:bg-[#4c3aae] transition-colors"
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
