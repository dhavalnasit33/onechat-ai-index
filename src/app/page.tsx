import React from 'react';
import { Search, Menu } from 'lucide-react';
import dbConnect from '@/src/lib/dbConnect';
import Category from '@/src/models/Category';
import Topic from '@/src/models/Topic';
import Chart from '@/src/models/Chart';
import InteractiveChart from '@/src/components/InteractiveChart';

export default async function Home() {
  await dbConnect();

  // Ensure Topic schema is registered with Mongoose so populate can find it
  const _dummyTopic = Topic.modelName;

  // Fetch categories sorted by position
  const categories = await Category.find({}).sort({ position: 1 }).lean();

  // Fetch seeded charts for the featured dashboard
  const chartIds = [
    'how-gen-z-uses-ai-in-daily-life-c1',
    'how-gen-z-uses-ai-in-daily-life-c2',
    'how-gen-z-uses-ai-in-daily-life-c3',
    'how-gen-z-uses-ai-in-daily-life-c4'
  ];
  const seededCharts = await Chart.find({ chartId: { $in: chartIds } }).populate('topicId').lean();
  
  // Map charts by chartId
  const chartMap = seededCharts.reduce((acc: any, chart: any) => {
    acc[chart.chartId] = chart;
    return acc;
  }, {});

  return (
    <div className="bg-white md:bg-[#f9fbfd] text-[#15151a] font-serif leading-relaxed text-[15px] md:text-base min-h-screen">

      {/* WRAPPER: Limits width on desktop, full width on mobile */}
      <div className="bg-white max-w-full md:shadow-sm min-h-screen">

        {/* TOP NAV */}
        <header className="border-b border-[#d7e3f0] bg-white sticky top-0 z-20">
          <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
            <div className="font-serif text-xs md:text-sm tracking-widest uppercase text-[#15151a] font-bold">
              <a href="/ai-behavior-index/">
                AI Behavior Index
                <span className="text-[#8a8a95] font-normal tracking-[0.04em] text-[10px] md:text-xs ml-1 md:ml-1.5 normal-case block md:inline mt-0.5 md:mt-0">by OneChat AI</span>
              </a>
            </div>

            {/* Desktop Links */}
            <nav className="hidden md:flex gap-7 font-sans text-sm text-[#4a4a55]">
              <a href="/ai-behavior-index/" className="hover:text-[#15151a] transition-colors">Home</a>
              <a href="/ai-behavior-index/methodology/" className="hover:text-[#15151a] transition-colors">Methodology</a>
              <a href="/ai-behavior-index/for-journalists/" className="hover:text-[#15151a] transition-colors">For Journalists</a>
            </nav>

            {/* Mobile Hamburger Menu */}
            <button className="md:hidden text-[#15151a] p-1">
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* COMPACT HEADER */}
        <section className="bg-white border-b border-[#d7e3f0] pt-8 md:pt-12 pb-6 md:pb-9 px-5 md:px-8">
          <div className="max-w-[1340px] mx-auto text-center">
            <div className="font-sans text-[9.5px] md:text-[11px] tracking-[0.18em] uppercase text-[#8a8a95] font-semibold mb-3.5 md:mb-4">
              Quarterly · Q2 2026
            </div>
            <h1 className="font-serif text-[34px] md:text-[56px] leading-[1.05] font-bold tracking-tight text-[#15151a] mb-3.5 md:mb-4 max-w-[900px] mx-auto">
              How the world is actually using <em className="italic text-[#088DFF] font-bold not-italic">AI.</em>
            </h1>
            <p className="text-sm md:text-[15px] text-[#4a4a55] max-w-[680px] mx-auto leading-[1.5] mb-5">
              An interactive index of AI usage statistics aggregated from public studies. Search any topic, filter the dashboard below, or browse by category.
            </p>

            <form action="/ai-behavior-index/search/" method="GET" className="relative max-w-[640px] mx-auto md:mt-7">
              <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-sm md:text-base text-[#8a8a95] pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                name="q"
                className="w-full font-sans text-sm md:text-[15px] text-[#15151a] bg-[#eaf2fb] border border-[#d7e3f0] rounded-full py-3 md:py-3.5 pr-4 md:pr-5 pl-10 md:pl-12 outline-none transition-all focus:border-[#088DFF] focus:bg-white focus:ring-[3px] focus:ring-[#088DFF]/10 placeholder:text-[#8a8a95]"
                placeholder="Search all topics…"
              />
            </form>
          </div>
        </section>

        {/* DASHBOARD */}
        <main className="max-w-[1340px] mx-auto p-4 md:p-7 lg:p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 mb-4">

            {/* Chart Card 1: VBAR */}
            <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col mb-4 md:mb-0">
              <div className="p-5 md:p-7 pb-3 relative">
                <div className="absolute top-4 md:top-5 right-4 md:right-5 text-[22px] md:text-2xl leading-none">📊</div>
                <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2 max-w-[80%] md:max-w-full">Adoption · Global · 2026</div>
                <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-tight tracking-tight mb-1.5 max-w-[90%] md:max-w-[92%]">Weekly AI use by age cohort.</div>
                <div className="font-sans text-[11.5px] md:text-xs text-[#4a4a55] leading-[1.5] max-w-[92%]">Share reporting at least weekly use.</div>
              </div>
              <div className="px-5 md:px-7 py-2 pb-4 flex-1 flex flex-col justify-center h-[220px] md:h-[260px]">
                {chartMap['how-gen-z-uses-ai-in-daily-life-c1'] ? (
                  <InteractiveChart
                    chartId="how-gen-z-uses-ai-in-daily-life-c1"
                    chartType="vbar"
                    data={chartMap['how-gen-z-uses-ai-in-daily-life-c1'].data}
                  />
                ) : (
                  <div className="flex items-end justify-around gap-2 md:gap-4 h-full pt-7 md:pt-8 px-1 md:px-2 pb-10 md:pb-11 relative">
                    <div className="absolute bottom-[42px] md:bottom-[46px] left-0 right-0 h-[2px] bg-[#15151a]"></div>
                    <div className="flex flex-col items-center relative flex-1">
                      <div className="w-full rounded-t relative bg-[#088DFF]" style={{ height: '124px' }}>
                        <span className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 font-sans text-[13px] md:text-base font-extrabold text-[#15151a]">68%</span>
                      </div>
                      <div className="absolute -bottom-[34px] md:-bottom-9.5 font-sans text-[9.5px] md:text-[11px] text-[#4a4a55] text-center font-semibold w-full leading-[1.2]">Gen Z<span className="block font-normal text-[#8a8a95] text-[9px] md:text-[10px] mt-[1px]">18-25</span></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-5 md:px-7 py-3 border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                <div>Source: <a href="#" className="text-[#4a4a55] underline font-semibold">Pew Research 2026</a></div>
                <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase"><strong className="font-bold not-italic">OneChat AI</strong></div>
              </div>
            </div>

            {/* Chart Card 2: DONUT */}
            <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col mb-4 md:mb-0">
              <div className="p-5 md:p-7 pb-3 relative">
                <div className="absolute top-4 md:top-5 right-4 md:right-5 text-[22px] md:text-2xl leading-none">🏆</div>
                <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">Tool Share · Global · 2026</div>
                <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-tight tracking-tight mb-1.5 max-w-[90%] md:max-w-[92%]">Top AI tools by user preference.</div>
                <div className="font-sans text-[11.5px] md:text-xs text-[#4a4a55] leading-relaxed max-w-[92%]">Share naming each as most-used.</div>
              </div>
              <div className="px-5 md:px-7 py-2 pb-4 flex-1 flex flex-col justify-center h-[220px] md:h-[260px]">
                {chartMap['how-gen-z-uses-ai-in-daily-life-c3'] ? (
                  <InteractiveChart
                    chartId="how-gen-z-uses-ai-in-daily-life-c3"
                    chartType="donut"
                    data={chartMap['how-gen-z-uses-ai-in-daily-life-c3'].data}
                  />
                ) : (
                  <div className="py-1">
                    {[
                      { name: 'ChatGPT', val: '52%', w: '100%', bg: 'bg-[#088DFF]' },
                      { name: 'Gemini', val: '17%', w: '33%', bg: 'bg-[#088DFF]' }
                    ].map(item => (
                      <div key={item.name} className="grid grid-cols-[84px_1fr_42px] gap-2.5 items-center mb-2">
                        <div className="font-sans text-[11.5px] font-semibold text-[#15151a]">{item.name}</div>
                        <div className="bg-[#eaf2fb] h-[22px] rounded-sm overflow-hidden">
                          <div className={`h-full rounded-sm flex items-center justify-end pr-2 text-white font-sans text-[10px] font-bold min-w-[26px] ${item.bg}`} style={{ width: item.w }}>{item.val}</div>
                        </div>
                        <div className="font-sans text-xs font-extrabold text-[#15151a] text-right">{item.val}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-5 md:px-7 py-3 border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                <div>Source: <a href="#" className="text-[#4a4a55] underline font-semibold">Morning Consult</a></div>
                <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase"><strong className="font-bold not-italic">OneChat AI</strong></div>
              </div>
            </div>

            {/* Chart Card 3: LINE */}
            <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col mb-4 md:mb-0">
              <div className="p-5 md:p-7 pb-3 relative">
                <div className="absolute top-4 md:top-5 right-4 md:right-5 text-[22px] md:text-2xl leading-none">📈</div>
                <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">Trend · Global · 2022-2026</div>
                <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-tight tracking-tight mb-1.5 max-w-[90%] md:max-w-[92%]">Weekly AI use over time.</div>
                <div className="font-sans text-[11.5px] md:text-xs text-[#4a4a55] leading-relaxed max-w-[92%]">Share of all adults using AI weekly.</div>
              </div>
              <div className="px-5 md:px-7 py-2 pb-4 flex-1 flex flex-col justify-center h-[220px] md:h-[260px]">
                {chartMap['how-gen-z-uses-ai-in-daily-life-c2'] ? (
                  <InteractiveChart
                    chartId="how-gen-z-uses-ai-in-daily-life-c2"
                    chartType="line"
                    data={chartMap['how-gen-z-uses-ai-in-daily-life-c2'].data}
                  />
                ) : (
                  <div className="pt-2.5 px-1 pb-1">
                    <svg className="w-full h-[150px] block" viewBox="0 0 320 150" preserveAspectRatio="none">
                      <line x1="0" y1="20" x2="320" y2="20" stroke="#eaf2fb" strokeWidth="1" />
                      <line x1="0" y1="130" x2="320" y2="130" stroke="#15151a" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="px-5 md:px-7 py-3 border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                <div>Source: <a href="#" className="text-[#4a4a55] underline font-semibold">Pew</a>, <a href="#" className="text-[#4a4a55] underline font-semibold">Stanford</a></div>
                <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase"><strong className="font-bold not-italic">OneChat AI</strong></div>
              </div>
            </div>

            {/* Chart Card 4: HBAR */}
            <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col mb-4 md:mb-0">
              <div className="p-5 md:p-7 pb-3 relative">
                <div className="absolute top-4 md:top-5 right-4 md:right-5 text-[22px] md:text-2xl leading-none">📚</div>
                <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">Use Cases · Global · 2026</div>
                <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-tight tracking-tight mb-1.5 max-w-[90%] md:max-w-[92%]">What people use AI for.</div>
                <div className="font-sans text-[11.5px] md:text-xs text-[#4a4a55] leading-relaxed max-w-[92%]">Top reported use case.</div>
              </div>
              <div className="px-5 md:px-7 py-2 pb-4 flex-1 flex flex-col justify-center h-[220px] md:h-[260px]">
                {chartMap['how-gen-z-uses-ai-in-daily-life-c4'] ? (
                  <InteractiveChart
                    chartId="how-gen-z-uses-ai-in-daily-life-c4"
                    chartType="hbar"
                    data={chartMap['how-gen-z-uses-ai-in-daily-life-c4'].data}
                  />
                ) : (
                  <div className="flex flex-col md:flex-row items-center gap-4 py-2">
                    <div className="w-[140px] h-[140px] rounded-full relative shrink-0" style={{ background: 'conic-gradient(#088DFF 0deg 241deg, #E5483F 241deg 359deg, #F39323 359deg 360deg)' }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[84px] h-[84px] bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-5 md:px-7 py-3 border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                <div>Source: <a href="#" className="text-[#4a4a55] underline font-semibold">Pew Research Center (2026)</a></div>
                <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase"><strong className="font-bold not-italic">OneChat AI</strong></div>
              </div>
            </div>

            {/* Chart Card 5: HBAR (Industry Sessions) - Fallback */}
            <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col mb-4 md:mb-0">
              <div className="p-5 md:p-7 pb-3 relative">
                <div className="absolute top-4 md:top-5 right-4 md:right-5 text-[22px] md:text-2xl leading-none">💼</div>
                <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">Industry · 2026</div>
                <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-tight tracking-tight mb-1.5 max-w-[90%] md:max-w-[92%]">Weekly AI sessions per active user.</div>
                <div className="font-sans text-[11.5px] md:text-xs text-[#4a4a55] leading-relaxed max-w-[92%]">By knowledge work function.</div>
              </div>
              <div className="px-5 md:px-7 pt-3 pb-4 flex-1 flex flex-col justify-center">
                <div className="py-1">
                  {[
                    { name: 'Marketing', val: '4.8×', w: '100%' },
                    { name: 'Software', val: '4.4×', w: '92%' },
                    { name: 'Design', val: '3.1×', w: '65%' },
                    { name: 'Sales', val: '2.6×', w: '54%' },
                    { name: 'Finance', val: '1.7×', w: '36%' },
                  ].map(item => (
                    <div key={item.name} className="grid grid-cols-[84px_1fr_42px] gap-2.5 items-center mb-2">
                      <div className="font-sans text-[11.5px] font-semibold text-[#15151a]">{item.name}</div>
                      <div className="bg-[#eaf2fb] h-[22px] rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm flex items-center justify-end pr-2 text-white font-sans text-[10px] font-bold min-w-[26px] bg-[#088DFF]" style={{ width: item.w }}>{item.val}</div>
                      </div>
                      <div className="font-sans text-xs font-extrabold text-[#15151a] text-right">{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 md:px-7 py-3 border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                <div>Source: <a href="#" className="text-[#4a4a55] underline font-semibold">McKinsey 2026</a></div>
                <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase"><strong className="font-bold not-italic">OneChat AI</strong></div>
              </div>
            </div>

            {/* Chart Card 6: Countries - Fallback */}
            <div className="bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col">
              <div className="p-5 md:p-7 pb-3 relative">
                <div className="absolute top-4 md:top-5 right-4 md:right-5 text-[22px] md:text-2xl leading-none">🌍</div>
                <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">Geographic · 2026</div>
                <div className="font-sans text-[15px] md:text-[17px] font-extrabold text-[#15151a] leading-tight tracking-tight mb-1.5 max-w-[90%] md:max-w-[92%]">Top AI tool by country.</div>
                <div className="font-sans text-[11.5px] md:text-xs text-[#4a4a55] leading-relaxed max-w-[92%]">Red bars = non-OpenAI / non-Google leader.</div>
              </div>
              <div className="px-5 md:px-7 pt-3 pb-4 flex-1 flex flex-col justify-center">
                <div className="py-1">
                  {[
                    { country: '🇨🇳 China', val: '71%', w: '100%', bg: 'bg-[#E5483F]' },
                    { country: '🇮🇳 India', val: '62%', w: '87%', bg: 'bg-[#088DFF]' },
                    { country: '🇺🇸 U.S.', val: '58%', w: '82%', bg: 'bg-[#088DFF]' }
                  ].map(item => (
                    <div key={item.country} className="grid grid-cols-[84px_1fr_42px] gap-2.5 items-center mb-2">
                      <div className="font-sans text-[11.5px] font-semibold text-[#15151a]">{item.country}</div>
                      <div className="bg-[#eaf2fb] h-[22px] rounded-sm overflow-hidden">
                        <div className={`h-full rounded-sm flex items-center justify-end pr-2 text-white font-sans text-[10px] font-bold min-w-[26px] ${item.bg}`} style={{ width: item.w }}>{item.val}</div>
                      </div>
                      <div className="font-sans text-xs font-extrabold text-[#15151a] text-right">{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 md:px-7 py-3 border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                <div>Source: <a href="#" className="text-[#4a4a55] underline font-semibold">Statcounter</a></div>
                <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase"><strong className="font-bold not-italic">OneChat AI</strong></div>
              </div>
            </div>
          </div>
        </main>

        {/* DIVIDER */}
        <div className="bg-[#eaf2fb] border-y border-[#d7e3f0] py-7 md:py-9 px-5 md:px-8 text-center mt-2 md:mt-6">
          <div className="max-w-[800px] mx-auto">
            <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#1e3a5f] font-bold mb-2.5">More from the index ↓</div>
            <h2 className="font-serif text-xl md:text-[26px] font-normal tracking-[-0.015em] text-[#15151a] leading-[1.2] mb-1.5">Featured findings, full categories, and journalist resources.</h2>
            <p className="hidden md:block text-sm text-[#4a4a55] max-w-[600px] mx-auto">Curated takes from the data above, plus full category navigation and citation tools.</p>
          </div>
        </div>

        {/* FEATURED INSIGHTS */}
        <section className="bg-[#f9fbfd] border-b border-[#d7e3f0] py-8 md:py-16 px-4 md:px-8">
          <div className="max-w-[1340px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-baseline mb-6 md:mb-9 pb-3 md:pb-4 border-b border-[#d7e3f0]">
              <div>
                <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-1.5 md:mb-0">Featured Findings · Q2 2026</div>
                <h2 className="font-serif text-2xl md:text-[30px] font-normal tracking-[-0.015em] text-[#15151a] mb-1.5 leading-[1.15]">What's shaping how the world uses AI right now.</h2>
                <p className="hidden md:block text-sm text-[#4a4a55] max-w-[640px] mb-8">Six headline statistics curated from the most recent research across all categories. Click any insight to explore the full data.</p>
              </div>
              <div className="hidden md:block font-sans text-xs text-[#8a8a95]">Updated quarterly</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-5">
              {[
                { icon: '📊', kicker: 'Generational Adoption', num: '73', pct: '%', title: 'Gen Z has crossed the weekly-use threshold.', desc: 'Nearly three-quarters of Americans aged 18-25 use a generative AI tool at least once per week.', src: 'Pew', color: 'text-[#088DFF]', link: '/ai-behavior-index/age-group/how-gen-z-uses-ai-in-daily-life/' },
                { icon: '🏆', kicker: 'Tool Market Share', num: '58', pct: '%', title: 'ChatGPT leads Gen Z by a 4-to-1 margin.', desc: 'More than half of 18-25 year olds name ChatGPT as their most-used AI tool.', src: 'Morning Consult', color: 'text-[#E5483F]', link: '/ai-behavior-index/age-group/how-gen-z-uses-ai-in-daily-life/' },
                { icon: '🌍', kicker: 'Geographic Patterns', num: '71', pct: '%', title: 'DeepSeek now dominates AI use in China.', desc: 'Local models lead in two of eight surveyed countries — DeepSeek in China and YandexGPT in Russia.', src: 'Statcounter', color: 'text-[#F39323]', link: '#' },
                { icon: '📚', kicker: 'Use Case Patterns', num: '67', pct: '%', title: 'Schoolwork dominates Gen Z AI use.', desc: 'Two-thirds of Gen Z report using AI for schoolwork, ahead of creative writing and research.', src: 'Common Sense Media', color: 'text-[#088DFF]', link: '/ai-behavior-index/age-group/gen-z-and-schoolwork-the-quiet-ai-revolution/' },
                { icon: '💼', kicker: 'Industry Intensity', num: '5.1', pct: '× / week', isSub: true, title: 'Marketing leads AI intensity at work.', desc: 'Marketers use AI tools 5+ times per week on average — more than any other knowledge work function.', src: 'McKinsey', color: 'text-[#088DFF]', link: '#' },
                { icon: '⚡', kicker: 'Adoption Velocity', num: '+32', pct: 'pts', isSub: true, title: 'Two-year growth for Gen Z weekly use.', desc: 'Gen Z weekly AI use jumped from 41% in 2024 to 73% in 2026 — the steepest cohort growth on record.', src: 'Pew', color: 'text-[#E5483F]', link: '/ai-behavior-index/age-group/how-gen-z-uses-ai-in-daily-life/' },
              ].map((insight, i) => (
                <a key={i} href={insight.link} className="bg-white border border-[#d7e3f0] rounded-md p-5 md:p-6 md:pb-5 flex flex-col transition-all duration-200 hover:shadow-[0_8px_24px_rgba(8,141,255,0.08)] hover:-translate-y-0.5 cursor-pointer relative text-left">
                  <div className="absolute top-4 md:top-5 right-4 md:right-5 text-xl md:text-[22px] leading-none">{insight.icon}</div>
                  <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-3.5 md:mb-4 max-w-[78%] md:max-w-[80%]">{insight.kicker}</div>
                  <div className={`font-serif text-4xl md:text-[56px] leading-none font-normal tracking-[-0.03em] mb-3 md:mb-3.5 ${insight.color}`}>
                    {insight.num}
                    {insight.isSub
                      ? <span className="text-xs md:text-sm text-[#8a8a95] font-sans font-semibold ml-1.5 align-middle tracking-[0.04em]">{insight.pct}</span>
                      : <span className="text-[28px] md:text-[34px] text-[#4a4a55]">{insight.pct}</span>
                    }
                  </div>
                  <div className="font-sans text-sm md:text-[15px] font-bold text-[#15151a] leading-[1.35] mb-2.5 md:mb-3 tracking-[-0.005em]">{insight.title}</div>
                  <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-relaxed mb-3.5 md:mb-4 flex-1">{insight.desc}</div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#eaf2fb] font-sans text-[10.5px] md:text-[11px]">
                    <div className="text-[#8a8a95]">Source: <span className="text-[#4a4a55] underline md:underline-offset-2">{insight.src}</span></div>
                    <span className="text-[#0468BD] font-bold no-underline">Explore →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="bg-white py-8 md:py-[72px] px-4 md:px-8">
          <div className="max-w-[1340px] mx-auto">
            <div className="mb-5 md:mb-9 md:pb-4 border-b md:border-none border-[#d7e3f0] pb-3">
              <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-1.5 md:mb-0">Browse The Full Index</div>
              <h2 className="font-serif text-2xl md:text-[30px] font-normal tracking-[-0.015em] text-[#15151a] mb-1.5 leading-[1.15]">All categories.</h2>
              <p className="text-[13px] md:text-sm text-[#4a4a55] max-w-[640px] md:mb-8">Filter, compare, and explore data across six categories.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
              {categories.map((cat: any, i: number) => {
                const icons = ['👥', '🌍', '💼', '🎯', '🏆', '📈'];
                return (
                  <a href={`/ai-behavior-index/${cat.slug}/`} key={cat._id.toString()} className="bg-white border border-[#d7e3f0] rounded-md p-6 md:p-8 cursor-pointer transition-all duration-200 flex flex-col min-h-auto md:min-h-[220px] hover:border-[#088DFF] hover:shadow-[0_8px_24px_rgba(8,141,255,0.1)] hover:-translate-y-0.5 text-left">
                    <div className="text-[26px] md:text-[28px] leading-none mb-3.5 md:mb-4">{icons[i % icons.length]}</div>
                    <div className="font-serif text-xl md:text-[22px] font-normal tracking-[-0.01em] text-[#15151a] mb-1.5 leading-[1.2]">{cat.name}</div>
                    <div className="font-sans text-[10.5px] md:text-[11px] tracking-[0.1em] uppercase text-[#8a8a95] font-semibold mb-3 md:mb-4">{cat.topicCount} Topics</div>
                    <div className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55] mb-3.5 md:mb-4 flex-1">{cat.description}</div>
                    <span className="font-sans text-[12.5px] md:text-[13px] text-[#0468BD] font-bold no-underline">Explore →</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#d7e3f0] bg-white py-6 md:py-9 px-4 md:px-8 pb-8 md:pb-9">
          <div className="max-w-[1340px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center font-sans text-[11px] md:text-xs text-[#8a8a95]">
            <div className="text-[#4a4a55] mb-4 md:mb-0 leading-[1.5] text-left md:text-left">
              Published by <a href="#" className="text-[#15151a] font-semibold no-underline">OneChat AI</a> <span className="hidden md:inline">— Your Personalized AI Super App, Curated for You</span>
            </div>
            <div className="flex gap-4 md:gap-6">
              <a href="#" className="hover:text-[#4a4a55]">Privacy</a>
              <a href="#" className="hover:text-[#4a4a55]">Terms</a>
              <a href="#" className="hover:text-[#4a4a55]">Contact</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
