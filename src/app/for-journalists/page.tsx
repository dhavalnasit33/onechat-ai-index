import React from 'react';
import { Menu, Copy, Download, Share2 } from 'lucide-react';

export const metadata = {
  title: 'Resources for Journalists | AI Behavior Index | OneChat AI',
  description: 'Guidelines, download options, and embed instructions for journalists citing the AI Behavior Index.',
};

export default function ForJournalistsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onechatai.ai';

  return (
    <div className="bg-[#f9fbfd] min-h-screen text-[#15151a]">
      {/* SITE HEADER */}
      <header className="border-b border-[#d7e3f0] bg-white sticky top-0 z-20">
        <div className="max-w-[1340px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="font-serif text-xs md:text-sm tracking-widest uppercase text-[#15151a] font-bold">
            <a href="/ai-behavior-index/">
              AI Behavior Index
              <span className="text-[#8a8a95] font-normal tracking-[0.04em] text-[10px] md:text-xs ml-1 md:ml-1.5 normal-case block md:inline mt-0.5 md:mt-0">by OneChat AI</span>
            </a>
          </div>
          <nav className="hidden md:flex gap-7 font-sans text-sm text-[#4a4a55]">
            <a href="/ai-behavior-index/" className="hover:text-[#15151a] transition-colors">Home</a>
            <a href="/ai-behavior-index/methodology/" className="hover:text-[#15151a] transition-colors">Methodology</a>
            <a href="/ai-behavior-index/for-journalists/" className="text-[#15151a] font-semibold transition-colors">For Journalists</a>
          </nav>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
        <div className="max-w-[1340px] mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95] text-left">
          <a href="/ai-behavior-index/" className="hover:text-[#15151a]">Home</a>
          <span className="mx-1.5 md:mx-2 opacity-50">›</span>
          <span className="text-[#15151a] font-semibold">For Journalists</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 pt-6 pb-8 md:pt-10 md:pb-12 text-left">
        <div className="max-w-[800px] mx-auto">
          <span className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-3 block">
            Media kit & Licensing
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#15151a] leading-tight mb-4">
            Resources for Journalists
          </h1>
          <p className="font-serif text-[#4a4a55] text-lg leading-relaxed max-w-[720px]">
            We make it simple for writers, reporters, and research analysts to cite AI behavior trends. Feel free to embed, copy, or screenshot any chart.
          </p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="max-w-[800px] mx-auto px-4 py-10 md:py-16 text-left">
        <article className="prose prose-blue max-w-none font-serif text-[15px] md:text-[16.5px] leading-relaxed text-[#2a2a35] space-y-8">

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              1. Direct Embeds (Interactive Widgets)
            </h2>
            <p>
              Every chart on the index comes with a preconfigured HTML embed widget. The widget contains a responsive `iframe` that automatically adapts to your CMS width and functions cleanly on desktop and mobile screens.
            </p>
            <p>
              To embed a chart, click the <strong>"Embed Chart"</strong> button underneath any chart on a topic page, copy the code snippet, and paste it directly into your CMS (WordPress Custom HTML block, Webflow Embed element, ghost editor, etc.).
            </p>
            <div className="bg-[#f0f4f8] border border-[#d7e3f0] rounded p-5 font-sans text-sm text-[#4a4a55] space-y-2">
              <strong className="text-[#15151a] font-bold block">Example Embed Snippet:</strong>
              <code className="block bg-white border border-[#d7e3f0] p-3 rounded text-xs select-all text-[#1a2b4c] font-mono break-all leading-normal">
                {`<iframe src="${baseUrl}/api/embed/chart-id" width="100%" height="420" frameborder="0"></iframe><p style="font-size:11px;color:#8a8a95">Chart by <a href="${baseUrl}/ai-behavior-index/" style="color:#0468BD">AI Behavior Index</a></p>`}
              </code>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              2. Static Image Attribution (PNG/SVG)
            </h2>
            <p>
              If your CMS does not support iframe embeds, you can utilize the static image option. In the embed modal, you will find a link to the chart's static PNG image hosted on our content delivery network. 
            </p>
            <p>
              You may hotlink the image directly or download and re-upload it to your servers, provided you include the correct attribution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              3. Citation Guidelines
            </h2>
            <p>
              When citing data points from the AI Behavior Index, please follow these guidelines to credit both the primary research organization and the index:
            </p>
            <ul className="list-disc pl-5 font-sans text-sm md:text-[15px] space-y-3 text-[#4a4a55]">
              <li>
                <strong>Web/Blog Citation:</strong> Include a dofollow text link pointing to the specific Topic page.
                <br />
                <span className="italic block text-xs mt-1 text-[#8a8a95]">Example: "...according to data compiled on Weekly Gen Z AI adoption from the <a href="/ai-behavior-index/age-group/how-gen-z-uses-ai-in-daily-life/" className="text-[#088DFF] underline">AI Behavior Index</a>."</span>
              </li>
              <li>
                <strong>Academic / Print Citation:</strong>
                <br />
                <span className="font-mono text-xs block bg-white border border-[#d7e3f0] p-2.5 rounded mt-1.5 text-[#15151a]">
                  OneChat AI. (2026). "Topic Title." AI Behavior Index. Retrieved from ${baseUrl}/ai-behavior-index/[category]/[topic]
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              4. Creative Commons License
            </h2>
            <p>
              All index representations, custom charts, and aggregated data tables are licensed under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-[#088DFF] underline">Creative Commons Attribution 4.0 International License (CC BY 4.0)</a>. You are free to share, copy, and redistribute the material in any medium or format, as long as you attribute the work properly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              5. Custom Data Requests & Press Contacts
            </h2>
            <p>
              Are you working on an in-depth editorial piece and need specific demographic cuts or custom chart themes? Our analytics team can assist.
            </p>
            <p>
              For press inquiries, customized dataset extracts, or high-resolution vector exports, please contact us at <a href="mailto:press@onechatai.ai" className="text-[#15151a] font-semibold underline">press@onechatai.ai</a>.
            </p>
          </section>

        </article>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#d7e3f0] bg-white py-6 md:py-9 px-4 md:px-8 pb-8 md:pb-9">
        <div className="max-w-[1340px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center font-sans text-[11px] md:text-xs text-[#8a8a95]">
          <div className="text-[#4a4a55] mb-4 md:mb-0 leading-[1.5] text-left">
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
  );
}
