import React from "react";
import { Metadata } from "next";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";
import Chart from "@/src/models/Chart";
import InteractiveChart from "@/src/components/InteractiveChart";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

export const metadata: Metadata = {
  title: "AI Behavior Index | OneChat AI",
  description: "An interactive index of AI usage statistics aggregated from public studies. Search any topic, filter the dashboard, or browse by category.",
};

export default async function Home() {
  await dbConnect();

  // Ensure Topic schema is registered with Mongoose so populate can find it
  const _dummyTopic = Topic.modelName;

  // Fetch categories sorted by position
  const categories = await Category.find({}).sort({ position: 1 }).lean();

  // Fetch charts flagged for homepage display
  const customHomeCharts = await Chart.find({
    displayHome: true,
    status: "active"
  })
    .populate({
      path: "topicId",
      populate: { path: "categoryId" }
    })
    .lean();

  return (
    <div className="bg-white text-[#15151a] font-serif leading-relaxed text-[15px] md:text-[16px] min-h-screen overflow-x-hidden w-full max-w-[100vw]">
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
            <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-sm md:text-base text-[#8a8a95] pointer-events-none">
              ⌕
            </span>
            <input
              type="text"
              name="q"
              className="w-full font-sans text-[14px] md:text-[15px] text-[#15151a] bg-[#eaf2fb] border border-[#d7e3f0] rounded-full py-3 md:py-3.5 pr-4 md:pr-5 pl-10 md:pl-12 outline-none transition-all focus:border-[#088DFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(8,141,255,0.12)] placeholder:text-[#8a8a95]"
              placeholder='Search all topics — e.g. "Gen Z trust", "AI by country", "healthcare AI"'
            />
          </form>
        </div>
      </section>

      {/* DASHBOARD */}
      <main className="max-w-[1340px] mx-auto px-4 md:px-8 py-5 md:py-7 overflow-x-hidden">
        {/* ROW 1: 3 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-4 mb-4">
          {/* Chart Card 1: VBAR */}
          <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col">
            <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
              <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none flex items-center justify-center w-[24px] h-[24px]">
                📊
              </div>
              <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2 max-w-[80%] md:max-w-full">
                Adoption · Global · 2026
              </div>
              <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-[1.25] tracking-[-0.01em] mb-1.5 max-w-[90%] md:max-w-[92%]">
                Weekly AI use by age cohort.
              </div>
              <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%]">
                Share reporting at least weekly use of a generative AI tool.
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] flex-1 flex flex-col justify-center min-h-[220px]">
              <div className="flex items-end justify-around gap-[10px] md:gap-[18px] h-[180px] md:h-[220px] pt-[28px] md:pt-[32px] px-1 md:px-2 pb-[42px] md:pb-[46px] relative">
                <div className="absolute bottom-[42px] md:bottom-[46px] left-0 right-0 h-[2px] bg-[#15151a]"></div>

                <div className="flex flex-col items-center relative flex-1 max-w-[90px]">
                  <div
                    className="w-full rounded-t-[3px] md:rounded-t-[4px] relative bg-[#088DFF]"
                    style={{ height: "124px" }}
                  >
                    <span className="absolute -top-[22px] md:-top-[24px] left-1/2 -translate-x-1/2 font-sans text-[13px] md:text-[16px] font-extrabold text-[#15151a]">
                      68%
                    </span>
                  </div>
                  <div className="absolute -bottom-[34px] md:-bottom-[38px] font-sans text-[9.5px] md:text-[11px] text-[#4a4a55] text-center font-semibold w-full leading-[1.2]">
                    Gen Z
                    <span className="block font-normal text-[#8a8a95] text-[9px] md:text-[10px] mt-[1px]">
                      18-25
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center relative flex-1 max-w-[90px]">
                  <div
                    className="w-full rounded-t-[3px] md:rounded-t-[4px] relative bg-[#088DFF]"
                    style={{ height: "86px" }}
                  >
                    <span className="absolute -top-[22px] md:-top-[24px] left-1/2 -translate-x-1/2 font-sans text-[13px] md:text-[16px] font-extrabold text-[#15151a]">
                      47%
                    </span>
                  </div>
                  <div className="absolute -bottom-[34px] md:-bottom-[38px] font-sans text-[9.5px] md:text-[11px] text-[#4a4a55] text-center font-semibold w-full leading-[1.2]">
                    Millennials
                    <span className="block font-normal text-[#8a8a95] text-[9px] md:text-[10px] mt-[1px]">
                      26-41
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center relative flex-1 max-w-[90px]">
                  <div
                    className="w-full rounded-t-[3px] md:rounded-t-[4px] relative bg-[#088DFF]"
                    style={{ height: "50px" }}
                  >
                    <span className="absolute -top-[22px] md:-top-[24px] left-1/2 -translate-x-1/2 font-sans text-[13px] md:text-[16px] font-extrabold text-[#15151a]">
                      27%
                    </span>
                  </div>
                  <div className="absolute -bottom-[34px] md:-bottom-[38px] font-sans text-[9.5px] md:text-[11px] text-[#4a4a55] text-center font-semibold w-full leading-[1.2]">
                    Gen X
                    <span className="block font-normal text-[#8a8a95] text-[9px] md:text-[10px] mt-[1px]">
                      42-57
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center relative flex-1 max-w-[90px]">
                  <div
                    className="w-full rounded-t-[3px] md:rounded-t-[4px] relative bg-[#088DFF]"
                    style={{ height: "18px" }}
                  >
                    <span className="absolute -top-[22px] md:-top-[24px] left-1/2 -translate-x-1/2 font-sans text-[13px] md:text-[16px] font-extrabold text-[#15151a]">
                      10%
                    </span>
                  </div>
                  <div className="absolute -bottom-[34px] md:-bottom-[38px] font-sans text-[9.5px] md:text-[11px] text-[#4a4a55] text-center font-semibold w-full leading-[1.2]">
                    Boomers
                    <span className="block font-normal text-[#8a8a95] text-[9px] md:text-[10px] mt-[1px]">
                      58-76
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
              <div>
                Source:{" "}
                <a
                  href="#"
                  className="text-[#4a4a55] underline md:underline-offset-auto font-semibold"
                >
                  Pew Research 2026
                </a>
              </div>
              <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase">
                <strong className="font-bold not-italic">OneChat AI</strong>
              </div>
            </div>
          </div>

          {/* Chart Card 2: Tool Share */}
          <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col">
            <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
              <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none flex items-center justify-center w-[24px] h-[24px]">
                🏆
              </div>
              <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">
                Tool Market Share · Global · 2026
              </div>
              <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-[1.25] tracking-[-0.01em] mb-1.5 max-w-[90%] md:max-w-[92%]">
                Top AI tools by user preference.
              </div>
              <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%]">
                Share of users naming each tool as most-used.
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] pt-[12px] md:pt-[14px] flex-1 flex flex-col justify-center min-h-[220px]">
              <div className="py-1 md:py-[6px]">
                {[
                  {
                    name: "ChatGPT",
                    val: "52%",
                    w: "100%",
                    bg: "bg-[#088DFF]",
                  },
                  {
                    name: "Gemini",
                    val: "17%",
                    w: "33%",
                    bg: "bg-[#088DFF]",
                  },
                  {
                    name: "DeepSeek",
                    val: "11%",
                    w: "22%",
                    bg: "bg-[#088DFF]",
                  },
                  { name: "Claude", val: "9%", w: "17%", bg: "bg-[#088DFF]" },
                  {
                    name: "Copilot",
                    val: "6%",
                    w: "12%",
                    bg: "bg-[#088DFF]",
                  },
                  { name: "Other", val: "5%", w: "10%", bg: "bg-[#A8A8B0]" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-[84px_1fr_42px] md:grid-cols-[132px_1fr_56px] gap-[10px] md:gap-[14px] items-center mb-[9px] md:mb-[10px]"
                  >
                    <div className="font-sans text-[11.5px] md:text-[13px] font-semibold text-[#15151a] flex items-center gap-2">
                      {item.name}
                    </div>
                    <div className="bg-[#eaf2fb] h-[22px] md:h-[24px] rounded-[3px] overflow-hidden relative">
                      <div
                        className={`h-full rounded-[3px] flex items-center justify-end pr-2 md:pr-[10px] text-white font-sans text-[10px] md:text-[11px] font-bold min-w-[26px] md:min-w-[30px] ${item.bg}`}
                        style={{ width: item.w }}
                      >
                        {item.val}
                      </div>
                    </div>
                    <div className="font-sans text-[12px] md:text-[14px] font-extrabold text-[#15151a] text-right">
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
              <div>
                Source:{" "}
                <a href="#" className="text-[#4a4a55] underline font-semibold">
                  Morning Consult
                </a>
              </div>
              <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase">
                <strong className="font-bold not-italic">OneChat AI</strong>
              </div>
            </div>
          </div>

          {/* Chart Card 3: LINE */}
          <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col">
            <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
              <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none flex items-center justify-center w-[24px] h-[24px]">
                📈
              </div>
              <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">
                Trend · Global · 2022-2026
              </div>
              <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-[1.25] tracking-[-0.01em] mb-1.5 max-w-[90%] md:max-w-[92%]">
                Weekly AI use over time.
              </div>
              <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%]">
                Share of all adults using AI weekly.
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] flex-1 flex flex-col justify-center min-h-[220px]">
              <div className="pt-[10px] md:pt-[14px] px-[4px] md:px-[6px] pb-[4px] md:pb-[6px]">
                <svg
                  className="w-full h-[150px] md:h-[180px] block overflow-visible"
                  viewBox="0 0 500 180"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#088DFF"
                        stopOpacity="0.28"
                      />
                      <stop
                        offset="100%"
                        stopColor="#088DFF"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <line
                    x1="0"
                    y1="20"
                    x2="500"
                    y2="20"
                    stroke="#eaf2fb"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="65"
                    x2="500"
                    y2="65"
                    stroke="#eaf2fb"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="110"
                    x2="500"
                    y2="110"
                    stroke="#eaf2fb"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="160"
                    x2="500"
                    y2="160"
                    stroke="#15151a"
                    strokeWidth="1.5"
                  />
                  <text
                    x="6"
                    y="16"
                    fontFamily="-apple-system, sans-serif"
                    fontSize="9"
                    fill="#8a8a95"
                    fontWeight="600"
                  >
                    60%
                  </text>
                  <text
                    x="6"
                    y="61"
                    fontFamily="-apple-system, sans-serif"
                    fontSize="9"
                    fill="#8a8a95"
                    fontWeight="600"
                  >
                    40%
                  </text>
                  <text
                    x="6"
                    y="106"
                    fontFamily="-apple-system, sans-serif"
                    fontSize="9"
                    fill="#8a8a95"
                    fontWeight="600"
                  >
                    20%
                  </text>
                  <path
                    d="M 40,140 L 155,128 L 270,98 L 385,72 L 480,48 L 480,160 L 40,160 Z"
                    fill="url(#lg)"
                  />
                  <polyline
                    points="40,140 155,128 270,98 385,72 480,48"
                    stroke="#088DFF"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="40"
                    cy="140"
                    r="4"
                    fill="#fff"
                    stroke="#088DFF"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="155"
                    cy="128"
                    r="4"
                    fill="#fff"
                    stroke="#088DFF"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="270"
                    cy="98"
                    r="4"
                    fill="#fff"
                    stroke="#088DFF"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="385"
                    cy="72"
                    r="4"
                    fill="#fff"
                    stroke="#088DFF"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="480"
                    cy="48"
                    r="6"
                    fill="#088DFF"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex justify-between px-[2px] md:px-[4px] pt-[6px] md:pt-[8px] font-sans text-[10px] md:text-[11px] text-[#8a8a95] font-medium">
                  <span>2022</span>
                  <span>2023</span>
                  <span>2024</span>
                  <span>2025</span>
                  <span>2026</span>
                </div>
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
              <div>
                Source:{" "}
                <a href="#" className="text-[#4a4a55] underline font-semibold">
                  Pew Research
                </a>
                ,{" "}
                <a href="#" className="text-[#4a4a55] underline font-semibold">
                  Stanford AI Index
                </a>
              </div>
              <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase">
                <strong className="font-bold not-italic">OneChat AI</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 mb-4">
          {/* Chart Card 4: Use Cases (Donut) */}
          <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col">
            <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
              <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none flex items-center justify-center w-[24px] h-[24px]">
                📚
              </div>
              <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">
                Use Cases · Global · 2026
              </div>
              <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-[1.25] tracking-[-0.01em] mb-1.5 max-w-[90%] md:max-w-[92%]">
                What people use AI for.
              </div>
              <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%]">
                Top reported use case across all surveyed users.
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] flex-1 flex flex-col justify-center min-h-[220px]">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-[18px] md:gap-[28px] py-[8px] px-0 md:px-[6px]">
                <div
                  className="w-[140px] md:w-[160px] h-[140px] md:h-[160px] rounded-full relative shrink-0"
                  style={{
                    background:
                      "conic-gradient(#088DFF 0deg 241deg, #E5483F 241deg 359deg, #F39323 359deg 476deg, #0468BD 476deg 360deg)",
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[84px] md:w-[96px] h-[84px] md:h-[96px] bg-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                    <div className="font-sans text-[22px] md:text-[24px] font-extrabold text-[#15151a] leading-none">
                      52%
                    </div>
                    <div className="font-sans text-[8.5px] md:text-[9px] tracking-[0.12em] uppercase text-[#8a8a95] font-bold mt-[3px]">
                      Writing
                    </div>
                  </div>
                </div>
                <div className="w-full md:flex-1 font-sans text-[12px]">
                  <div className="grid grid-cols-[14px_1fr_50px] gap-[10px] items-center py-[8px] border-b border-[#eaf2fb]">
                    <span className="w-[12px] h-[12px] rounded-[3px] bg-[#088DFF]"></span>
                    <span className="text-[#15151a] font-semibold">
                      Writing & content
                    </span>
                    <span className="text-right text-[13px] md:text-[14px] font-extrabold text-[#15151a]">
                      52%
                    </span>
                  </div>
                  <div className="grid grid-cols-[14px_1fr_50px] gap-[10px] items-center py-[8px] border-b border-[#eaf2fb]">
                    <span className="w-[12px] h-[12px] rounded-[3px] bg-[#E5483F]"></span>
                    <span className="text-[#15151a] font-semibold">
                      Research & info
                    </span>
                    <span className="text-right text-[13px] md:text-[14px] font-extrabold text-[#15151a]">
                      41%
                    </span>
                  </div>
                  <div className="grid grid-cols-[14px_1fr_50px] gap-[10px] items-center py-[8px] border-b border-[#eaf2fb]">
                    <span className="w-[12px] h-[12px] rounded-[3px] bg-[#F39323]"></span>
                    <span className="text-[#15151a] font-semibold">
                      Schoolwork
                    </span>
                    <span className="text-right text-[13px] md:text-[14px] font-extrabold text-[#15151a]">
                      34%
                    </span>
                  </div>
                  <div className="grid grid-cols-[14px_1fr_50px] gap-[10px] items-center py-[8px]">
                    <span className="w-[12px] h-[12px] rounded-[3px] bg-[#0468BD]"></span>
                    <span className="text-[#15151a] font-semibold">
                      Other
                    </span>
                    <span className="text-right text-[13px] md:text-[14px] font-extrabold text-[#15151a]">
                      28%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
              <div>
                Source:{" "}
                <a href="#" className="text-[#4a4a55] underline font-semibold">
                  Multiple — see full data
                </a>
              </div>
              <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase">
                <strong className="font-bold not-italic">OneChat AI</strong>
              </div>
            </div>
          </div>

          {/* Chart Card 5: Industry */}
          <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col">
            <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
              <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none">
                💼
              </div>
              <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">
                Industry Use Intensity · 2026
              </div>
              <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-[1.25] tracking-[-0.01em] mb-1.5 max-w-[90%] md:max-w-[92%]">
                Weekly AI sessions per active user.
              </div>
              <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%]">
                Average across knowledge work functions globally.
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] pt-[12px] md:pt-[14px] flex-1 flex flex-col justify-center min-h-[220px]">
              <div className="py-1 md:py-[6px]">
                {[
                  { name: "Marketing", val: "4.8×", w: "100%" },
                  { name: "Software", val: "4.4×", w: "92%" },
                  { name: "Design", val: "3.1×", w: "65%" },
                  { name: "Sales", val: "2.6×", w: "54%" },
                  { name: "Finance", val: "1.7×", w: "36%" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-[84px_1fr_42px] md:grid-cols-[132px_1fr_56px] gap-[10px] md:gap-[14px] items-center mb-[9px] md:mb-[10px]"
                  >
                    <div className="font-sans text-[11.5px] md:text-[13px] font-semibold text-[#15151a] flex items-center gap-2">
                      {item.name}
                    </div>
                    <div className="bg-[#eaf2fb] h-[22px] md:h-[24px] rounded-[3px] overflow-hidden relative">
                      <div
                        className="h-full rounded-[3px] flex items-center justify-end pr-2 md:pr-[10px] text-white font-sans text-[10px] md:text-[11px] font-bold min-w-[26px] md:min-w-[30px] bg-[#088DFF]"
                        style={{ width: item.w }}
                      >
                        {item.val}
                      </div>
                    </div>
                    <div className="font-sans text-[12px] md:text-[14px] font-extrabold text-[#15151a] text-right">
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
              <div>
                Source:{" "}
                <a href="#" className="text-[#4a4a55] underline font-semibold">
                  McKinsey Global AI Survey 2026
                </a>
              </div>
              <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase">
                <strong className="font-bold not-italic">OneChat AI</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: 1 Column spanning full width */}
        <div className="grid grid-cols-1 gap-4 lg:gap-4">
          {/* Chart Card 6: Countries */}
          <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col">
            <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
              <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none">
                🌍
              </div>
              <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">
                Geographic Adoption · 2026
              </div>
              <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-[1.25] tracking-[-0.01em] mb-1.5 max-w-[90%] md:max-w-[92%]">
                Top AI tool by country.
              </div>
              <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%]">
                Leading AI tool by user share in each market. Red bars indicate
                non-OpenAI / non-Google leaders.
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] pt-[12px] md:pt-[14px] flex-1 flex flex-col justify-center">
              <div className="py-1 md:py-[6px]">
                {[
                  {
                    country: "🇨🇳 China",
                    sub: "— DeepSeek",
                    val: "71%",
                    w: "100%",
                    bg: "bg-[#E5483F]",
                  },
                  {
                    country: "🇮🇳 India",
                    sub: "— ChatGPT",
                    val: "62%",
                    w: "87%",
                    bg: "bg-[#088DFF]",
                  },
                  {
                    country: "🇺🇸 United States",
                    sub: "— ChatGPT",
                    val: "58%",
                    w: "82%",
                    bg: "bg-[#088DFF]",
                    mobileName: "🇺🇸 U.S.",
                  },
                  {
                    country: "🇬🇧 United Kingdom",
                    sub: "— ChatGPT",
                    val: "54%",
                    w: "76%",
                    bg: "bg-[#088DFF]",
                    mobileName: "🇬🇧 U.K.",
                  },
                  {
                    country: "🇩🇪 Germany",
                    sub: "— ChatGPT",
                    val: "49%",
                    w: "69%",
                    bg: "bg-[#088DFF]",
                  },
                  {
                    country: "🇷🇺 Russia",
                    sub: "— YandexGPT",
                    val: "44%",
                    w: "62%",
                    bg: "bg-[#E5483F]",
                  },
                  {
                    country: "🇯🇵 Japan",
                    sub: "— ChatGPT",
                    val: "38%",
                    w: "54%",
                    bg: "bg-[#088DFF]",
                  },
                ].map((item) => (
                  <div
                    key={item.country}
                    className="grid grid-cols-[84px_1fr_42px] md:grid-cols-[132px_1fr_56px] gap-[10px] md:gap-[14px] items-center mb-[9px] md:mb-[10px]"
                  >
                    <div className="font-sans text-[11.5px] md:text-[13px] font-semibold text-[#15151a] flex items-center md:gap-2">
                      <span className="hidden md:inline">
                        {item.country}{" "}
                        <span className="text-[#8a8a95] font-normal text-[11px]">
                          {item.sub}
                        </span>
                      </span>
                      <span className="md:hidden">
                        {item.mobileName || item.country}
                      </span>
                    </div>
                    <div className="bg-[#eaf2fb] h-[22px] md:h-[24px] rounded-[3px] overflow-hidden relative">
                      <div
                        className={`h-full rounded-[3px] flex items-center justify-end pr-2 md:pr-[10px] text-white font-sans text-[10px] md:text-[11px] font-bold min-w-[26px] md:min-w-[30px] ${item.bg}`}
                        style={{ width: item.w }}
                      >
                        {item.val}
                      </div>
                    </div>
                    <div className="font-sans text-[12px] md:text-[14px] font-extrabold text-[#15151a] text-right">
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
              <div>
                Source:{" "}
                <a href="#" className="text-[#4a4a55] underline font-semibold">
                  Statcounter AI Tools
                </a>{" "}
                +{" "}
                <a href="#" className="text-[#4a4a55] underline font-semibold">
                  Morning Consult
                </a>
              </div>
              <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase">
                <strong className="font-bold not-italic">OneChat AI</strong> ·
                AI Behavior Index
              </div>
            </div>
          </div>
        </div>
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
        <div className="max-w-[1340px] mx-auto">
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
                <div className="absolute top-[18px] md:top-[22px] right-[18px] md:right-[22px] text-[20px] md:text-[22px] leading-none">
                  {insight.icon}
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

      {/* DYNAMIC CUSTOM HOME CHARTS */}
      {customHomeCharts && customHomeCharts.length > 0 && (
        <section className="bg-white py-[32px] md:py-[48px] px-[16px] md:px-[32px] border-t border-[#d7e3f0]">
          <div className="max-w-[1340px] mx-auto">
            <div className="mb-[22px] md:mb-[36px] pb-[14px] md:pb-[16px] border-b border-[#d7e3f0]">
              <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-[6px] md:mb-0">
                Featured Insights
              </div>
              <h2 className="font-serif text-[24px] md:text-[30px] font-normal tracking-[-0.015em] text-[#15151a] mb-[6px] leading-[1.15]">
                Customized dashboard views.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
              {customHomeCharts.map((chart: any) => {
                const topic = chart.topicId;
                const category = topic?.categoryId;
                const categoryName = category?.name || "Insight";
                const iconToUse = chart.icon ? (
                  chart.icon.startsWith('http') || chart.icon.startsWith('/') ? (
                    <img src={chart.icon} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <span>{chart.icon}</span>
                  )
                ) : (
                  <span>📊</span>
                );

                return (
                  <div key={chart._id.toString()} className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col">
                    <div className="px-[20px] md:px-[28px] pt-[20px] md:pt-[24px] pb-[12px] md:pb-[14px] relative">
                      <div className="absolute top-[18px] md:top-[20px] right-[18px] md:right-[22px] text-[22px] md:text-[24px] leading-none flex items-center justify-center w-6 h-6">
                        {iconToUse}
                      </div>
                      <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2 max-w-[80%] md:max-w-full">
                        {categoryName} {topic ? `· ${topic.title}` : ''}
                      </div>
                      <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-[1.25] tracking-[-0.01em] mb-1.5 max-w-[90%] md:max-w-[92%]">
                        {chart.heading || chart.title}
                      </div>
                      {chart.sourceLine && (
                        <div className="font-sans text-[11.5px] md:text-[12px] text-[#4a4a55] leading-[1.5] max-w-[92%]">
                          {chart.sourceLine}
                        </div>
                      )}
                    </div>
                    <div className="px-[20px] md:px-[28px] py-[8px] pb-[16px] md:pb-[18px] flex-1 flex flex-col justify-center min-h-[220px]">
                      <InteractiveChart
                        chartId={chart.chartId}
                        chartType={chart.chartType}
                        data={chart.data}
                      />
                    </div>
                    {topic && (
                      <div className="px-[20px] md:px-[28px] py-[11px] md:py-[12px] pb-[13px] md:pb-[14px] border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                        <div>
                          Source:{" "}
                          <a href={`/ai-behavior-index/${category?.slug}/${topic.slug}/`} className="text-[#4a4a55] underline font-semibold">
                            {chart.sources?.[0]?.sourceName || "See full data"}
                          </a>
                        </div>
                        <a href={`/ai-behavior-index/${category?.slug}/${topic.slug}/`} className="text-[#0468BD] font-bold no-underline">
                          Explore topic →
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="bg-white py-[32px] md:py-[72px] px-[16px] md:px-[32px]">
        <div className="max-w-[1340px] mx-auto">
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
                    <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px] flex items-center justify-start h-[28px]">
                      {cat.iconUrl ? (
                        <img src={cat.iconUrl} alt="" className="h-full object-contain" />
                      ) : (
                        <span>{icons[i % icons.length]}</span>
                      )}
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
              <>
                <a
                  href="#"
                  className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] flex flex-col min-h-auto md:min-h-[220px]"
                >
                  <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px]">
                    👥
                  </div>
                  <div className="font-serif text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-[6px] leading-[1.2]">
                    By Age Group
                  </div>
                  <div className="font-sans text-[10.5px] md:text-[11px] tracking-[0.1em] uppercase text-[#8a8a95] font-semibold mb-[12px] md:mb-[16px]">
                    38 Data Points
                  </div>
                  <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-[14px] md:mb-[18px] flex-1">
                    Adoption rates, preferred tools, frequency of use, and
                    primary use cases across Gen Z, Millennials, Gen X, and
                    Boomers.
                  </div>
                  <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold no-underline">
                    Explore →
                  </span>
                </a>
                <a
                  href="#"
                  className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] flex flex-col min-h-auto md:min-h-[220px]"
                >
                  <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px]">
                    🌍
                  </div>
                  <div className="font-serif text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-[6px] leading-[1.2]">
                    By Country
                  </div>
                  <div className="font-sans text-[10.5px] md:text-[11px] tracking-[0.1em] uppercase text-[#8a8a95] font-semibold mb-[12px] md:mb-[16px]">
                    52 Data Points
                  </div>
                  <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-[14px] md:mb-[18px] flex-1">
                    AI usage across 30+ countries — leading tools by market,
                    adoption rates, paid subscriptions, and trust levels.
                  </div>
                  <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold no-underline">
                    Explore →
                  </span>
                </a>
                <a
                  href="#"
                  className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] flex flex-col min-h-auto md:min-h-[220px]"
                >
                  <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px]">
                    💼
                  </div>
                  <div className="font-serif text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-[6px] leading-[1.2]">
                    By Industry
                  </div>
                  <div className="font-sans text-[10.5px] md:text-[11px] tracking-[0.1em] uppercase text-[#8a8a95] font-semibold mb-[12px] md:mb-[16px]">
                    41 Data Points
                  </div>
                  <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-[14px] md:mb-[18px] flex-1">
                    How marketing, software, design, sales, finance, and
                    healthcare professionals use AI tools at work.
                  </div>
                  <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold no-underline">
                    Explore →
                  </span>
                </a>
                <a
                  href="#"
                  className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] flex flex-col min-h-auto md:min-h-[220px]"
                >
                  <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px]">
                    🎯
                  </div>
                  <div className="font-serif text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-[6px] leading-[1.2]">
                    By Use Case
                  </div>
                  <div className="font-sans text-[10.5px] md:text-[11px] tracking-[0.1em] uppercase text-[#8a8a95] font-semibold mb-[12px] md:mb-[16px]">
                    44 Data Points
                  </div>
                  <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-[14px] md:mb-[18px] flex-1">
                    What people actually use AI for — writing, coding, image
                    generation, research, schoolwork, and more.
                  </div>
                  <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold no-underline">
                    Explore →
                  </span>
                </a>
                <a
                  href="#"
                  className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] flex flex-col min-h-auto md:min-h-[220px]"
                >
                  <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px]">
                    🏆
                  </div>
                  <div className="font-serif text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-[6px] leading-[1.2]">
                    Market Share
                  </div>
                  <div className="font-sans text-[10.5px] md:text-[11px] tracking-[0.1em] uppercase text-[#8a8a95] font-semibold mb-[12px] md:mb-[16px]">
                    36 Data Points
                  </div>
                  <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-[14px] md:mb-[18px] flex-1">
                    How ChatGPT, Claude, Gemini, and other AI tools compare in
                    adoption, retention, and user preference.
                  </div>
                  <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold no-underline">
                    Explore →
                  </span>
                </a>
                <a
                  href="#"
                  className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] flex flex-col min-h-auto md:min-h-[220px]"
                >
                  <div className="text-[26px] md:text-[28px] leading-none mb-[14px] md:mb-[16px]">
                    📈
                  </div>
                  <div className="font-serif text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-[6px] leading-[1.2]">
                    Adoption Trends
                  </div>
                  <div className="font-sans text-[10.5px] md:text-[11px] tracking-[0.1em] uppercase text-[#8a8a95] font-semibold mb-[12px] md:mb-[16px]">
                    36 Data Points
                  </div>
                  <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-[14px] md:mb-[18px] flex-1">
                    How AI usage has changed over time — quarter-by-quarter and
                    year-by-year growth across cohorts and markets.
                  </div>
                  <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold no-underline">
                    Explore →
                  </span>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* JOURNALIST SECTION */}
      <section className="bg-[#eaf2fb] border-y border-[#d7e3f0] py-[36px] md:py-[56px] px-[16px] md:px-[32px]">
        <div className="max-w-[1340px] mx-auto">
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
        <div className="max-w-[1340px] mx-auto bg-white border border-[#d7e3f0] rounded-[4px] p-[20px] px-[22px] md:p-[24px] md:px-[28px]">
          <div className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-[8px]">
            A note on methodology
          </div>
          <p className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] max-w-[900px]">
            Every statistic shown is sourced from a publicly available study,
            survey, or report. We aggregate, organize, and contextualize this
            data — but the underlying research is conducted by the cited
            sources. Click any source link to access the original methodology.
            This index is refreshed quarterly to incorporate new research as it
            becomes available. If you run into any issues or have a study to
            suggest, contact us at{" "}
            <a
              href="mailto:support@onechatai.ai"
              className="text-[#4a4a55] underline"
            >
              support@onechatai.ai
            </a>
            .
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
