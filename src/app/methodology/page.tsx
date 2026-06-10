import React from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export const metadata = {
  title: 'Methodology | AI Behavior Index | OneChat AI',
  description: 'How the AI Behavior Index sources, verifies, and publishes data on AI adoption and usage.',
};

const PURPLE = '#6C56E5';
const PURPLE_LIGHT = '#EAE7FD';
const PURPLE_MID = '#9585EC';

export default function MethodologyPage() {
  return (
    <div className="bg-[#f7f8fc] min-h-screen text-[#15151a]">
      <Header activeTab="methodology" />

      {/* BREADCRUMB */}
      <div className="bg-white px-4 md:px-8 pt-3 md:pt-4 ">
        <div className="max-w-[1340px] px-4  mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95]">
          <a href="/ai-behavior-index/" className="hover:text-[#15151a] transition-colors">Home</a>
          <span className="mx-1.5 md:mx-2 opacity-40">›</span>
          <span className="text-[#15151a] font-semibold">Methodology</span>
        </div>
      </div>

      {/* HERO */}
      <div className="bg-white px-4 md:px-8 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="max-w-[1340px] px-4 mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-1 h-8 rounded-full"
              style={{ background: PURPLE }}
            />
            <span
              className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold"
              style={{ color: PURPLE }}
            >
              About the Index
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#0e0e14] leading-[1.15] mb-5">
            How we source and verify our data
          </h1>
          <p className="font-serif text-[#55556a] text-lg md:text-xl leading-relaxed ">
            Every statistic on this site is drawn from publicly available primary research — and every data point can be traced back to its original source.
          </p>
        </div>
      </div>

      {/* DIVIDER LINE */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#ddddf0] to-transparent" />

      {/* MAIN CONTENT */}
      <main className="max-w-[1340px] mx-auto px-4 py-12 md:py-20">

        {/* Lead paragraph */}
        <p className="font-serif text-[17px] md:text-[18px] leading-[1.75] text-[#2a2a3a] mb-12">
          The AI Behavior Index is the research arm of OneChat AI. The Index aggregates and contextualizes publicly available data on how individuals and organizations use artificial intelligence — covering consumer adoption, enterprise deployment, market share, demographic patterns, and use-case trends across countries and industries.
        </p>

        {/* SECTION: Sources */}
        <section className="mb-14">
          <div className="flex items-start gap-4 mb-5">
            <div
              className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold font-sans"
              style={{ background: PURPLE }}
            >
              1
            </div>
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#0e0e14] tracking-tight leading-snug pt-0.5">
              Primary research only
            </h2>
          </div>
          <div className="pl-12">
            <p className="font-serif text-[16px] md:text-[17px] leading-[1.8] text-[#3a3a4a] mb-6">
              Every chart and statistic on this site is drawn from publicly available primary research: peer-reviewed academic papers, central bank and government research, established industry surveys with disclosed methodology, and primary company announcements.
            </p>

            {/* Source chips */}
            <div className="rounded-xl border border-[#e2e2ef] bg-white p-5">
              <p className="font-sans text-xs text-[#8a8a95] uppercase tracking-wider mb-4 font-semibold">
                Sources we draw from
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Federal Reserve',
                  'NBER',
                  'McKinsey State of AI',
                  'Pew Research Center',
                  'Stanford HAI AI Index',
                  'Menlo Ventures',
                  'Government research',
                  'Peer-reviewed papers',
                  'Company announcements',
                ].map((src) => (
                  <span
                    key={src}
                    className="font-sans text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: PURPLE_LIGHT,
                      color: PURPLE,
                    }}
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Citation */}
        <section className="mb-14">
          <div className="flex items-start gap-4 mb-5">
            <div
              className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold font-sans"
              style={{ background: PURPLE }}
            >
              2
            </div>
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#0e0e14] tracking-tight leading-snug pt-0.5">
              Every data point is traceable
            </h2>
          </div>
          <div className="pl-12">
            <p className="font-serif text-[16px] md:text-[17px] leading-[1.8] text-[#3a3a4a] mb-6">
              Each chart cites the specific study, survey, or announcement it derives from — readers can verify every data point against its original source.
            </p>

            {/* Highlighted rule block */}
            <div
              className="rounded-xl p-5 md:p-6"
              style={{ background: PURPLE_LIGHT, borderLeft: `4px solid ${PURPLE}`, borderRadius: '0 12px 12px 0' }}
            >
              <p
                className="font-sans text-[11px] tracking-[0.18em] uppercase font-bold mb-3"
                style={{ color: PURPLE }}
              >
                Citation standards
              </p>
              <ul className="font-sans text-sm text-[#3a3460] space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: PURPLE }}>✓</span>
                  When multiple credible sources cover the same metric, we cite the most authoritative — typically the original primary source over secondary reporting.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: PURPLE }}>✓</span>
                  When sources conflict, we present the range and note the discrepancy rather than choosing one arbitrarily.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: PURPLE }}>✓</span>
                  Where research is rapidly evolving — such as monthly active user counts for AI products — we cite the most recent confirmed figure and date it explicitly.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION: Refresh */}
        <section className="mb-14">
          <div className="flex items-start gap-4 mb-5">
            <div
              className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold font-sans"
              style={{ background: PURPLE }}
            >
              3
            </div>
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#0e0e14] tracking-tight leading-snug pt-0.5">
              Refresh & editorial process
            </h2>
          </div>
          <div className="pl-12">
            <p className="font-serif text-[16px] md:text-[17px] leading-[1.8] text-[#3a3a4a] mb-6">
              Data is refreshed quarterly. New topics are added on an ongoing basis as warranted by significant new research releases or notable shifts in the underlying data. Our editorial process includes verification of every cited source URL and a quarterly review of all published statistics.
            </p>
            {/* Timeline strip */}
            <div className="rounded-xl border border-[#e2e2ef] bg-white overflow-hidden">
              <div className="grid grid-cols-3 divide-x divide-[#e2e2ef]">
                {[
                  { label: 'Ingest', desc: 'New quarterly studies added' },
                  { label: 'Verify', desc: 'Every source URL checked' },
                  { label: 'Publish', desc: 'Statistics reviewed and dated' },
                ].map((step, i) => (
                  <div key={i} className="p-4 text-center">
                    <div
                      className="w-7 h-7 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold text-white font-sans"
                      style={{ background: i === 0 ? PURPLE : i === 1 ? PURPLE_MID : '#b0a8f5' }}
                    >
                      {i + 1}
                    </div>
                    <p className="font-sans font-bold text-sm text-[#0e0e14] mb-0.5">{step.label}</p>
                    <p className="font-sans text-xs text-[#8a8a95] leading-snug">{step.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#f7f8fc] border-t border-[#e2e2ef] px-4 py-2.5 flex items-center justify-between">
                <span className="font-sans text-xs text-[#8a8a95]">Last updated: June 2026</span>
                <span className="font-sans text-xs text-[#8a8a95]">Next refresh: September 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Embeds */}
        <section className="mb-14">
          <div className="flex items-start gap-4 mb-5">
            <div
              className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold font-sans"
              style={{ background: PURPLE }}
            >
              4
            </div>
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#0e0e14] tracking-tight leading-snug pt-0.5">
              Free to embed with attribution
            </h2>
          </div>
          <div className="pl-12">
            <p className="font-serif text-[16px] md:text-[17px] leading-[1.8] text-[#3a3a4a]">
              The role of the AI Behavior Index is to make high-quality research more discoverable, comparable, and citable. Our charts are free to embed in editorial contexts — news articles, newsletters, academic papers, policy documents — with attribution.
            </p>
          </div>
        </section>

        {/* CONTACT CTA */}
        <div
          className="rounded-2xl p-7 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8 mt-4"
          style={{ background: PURPLE_LIGHT }}
        >
          <div className="flex-1">
            <p
              className="font-sans font-bold text-base mb-1"
              style={{ color: '#3a3460' }}
            >
              Questions or suggestions?
            </p>
            <p className="font-sans text-sm text-[#5a5490] leading-relaxed">
              If you have a study to suggest, notice an error, or have a methodology question, get in touch.
            </p>
          </div>
          <a
            href="mailto:research@aibehaviorindex.org"
            className="flex-shrink-0 font-sans text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: PURPLE }}
          >
            research@aibehaviorindex.org
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}