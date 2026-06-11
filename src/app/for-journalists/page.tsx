import React from 'react';
import {
  Zap,
  BarChart2,
  Globe,
  Briefcase,
  PieChart,
  TrendingUp,
  Mail,
  FileText,
  Image,
  MessageSquare,
  Quote,
  ArrowRight,
  AlertCircle,
  Download,
} from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export const metadata = {
  title: 'For Journalists | AI Behavior Index | OneChat AI',
  description:
    'Free charts, embed code, press contact, and citation guidelines for journalists covering AI adoption data from the AI Behavior Index.',
};

const PURPLE = '#6C56E5';
const PURPLE_LIGHT = '#EAE7FD';
const PURPLE_DARK = '#3b2e93';

const coverageTopics = [
  { icon: <Globe size={18} />, label: 'AI use by country' },
  { icon: <BarChart2 size={18} />, label: 'AI use by age & generation' },
  { icon: <Briefcase size={18} />, label: 'AI use by industry' },
  { icon: <PieChart size={18} />, label: 'Market share among AI products' },
  { icon: <FileText size={18} />, label: 'AI use cases (how people use it)' },
  { icon: <TrendingUp size={18} />, label: 'Adoption trends over time' },
];

const storyAngles = [
  {
    title: 'Demographic & country breakdowns',
    desc: "Who's using AI, where, and how that's shifting over time.",
  },
  {
    title: 'Year-over-year adoption trends',
    desc: 'Quantified retrospectives and forward-looking analysis grounded in verified data.',
  },
  {
    title: 'Industry vertical adoption patterns',
    desc: 'How specific sectors — healthcare, finance, education, retail — are adopting AI.',
  },
  {
    title: 'Enterprise vs. consumer behavior',
    desc: 'How organizations and individuals differ in their AI use patterns.',
  },
  {
    title: 'Market share dynamics',
    desc: 'Which AI products and providers are gaining or losing share, and where.',
  },
  {
    title: 'Emerging use cases',
    desc: 'How specific applications — coding, creative writing, research — are growing or declining.',
  },
];

const quickStartItems = [
  {
    icon: <BarChart2 size={20} />,
    label: 'Every chart is embeddable',
    desc: 'Click "Embed" on any chart for ready-to-paste HTML (using an optimized static image for SEO and maximum CMS compatibility), Markdown, or formal citation.',
  },
  {
    icon: <Image size={20} />,
    label: 'High-resolution chart images',
    desc: 'PNG and SVG versions of all charts are available in the Press Kit.',
  },
  {
    icon: <MessageSquare size={20} />,
    label: 'Custom data requests',
    desc: 'For exclusive data, custom cuts, or background interviews, contact us with your deadline.',
  },
  {
    icon: <Quote size={20} />,
    label: 'Citation format',
    desc: '"AI Behavior Index" or "the AI Behavior Index, the research arm of OneChat AI".',
  },
];

export default function ForJournalistsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/ai-behavior-index/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "For Journalists",
        "item": `${baseUrl}/ai-behavior-index/for-journalists/`
      }
    ]
  };

  return (
    <div className="bg-[#f7f8fc] min-h-screen text-[#15151a]">
      {/* SEO Schema Markups */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header activeTab="for-journalists" />

      {/* BREADCRUMB */}
      <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
        <div className="max-w-[1340px] px-4 mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95]">
          <a href="/ai-behavior-index/" className="hover:text-[#15151a] transition-colors">Home</a>
          <span className="mx-1.5 md:mx-2 opacity-40">›</span>
          <span className="text-[#15151a] font-semibold">For Journalists</span>
        </div>
      </div>

      {/* HERO */}
      <div className="bg-white px-4 md:px-8 pt-10 pb-14 md:pt-16 md:pb-20 border-b border-[#e8e8f0]">
        <div className="max-w-[1340px] px-4 mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-8 rounded-full" style={{ background: PURPLE }} />
            <span
              className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold"
              style={{ color: PURPLE }}
            >
              Press Kit
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#0e0e14] leading-[1.1] mb-5 max-w-[760px]">
            Data for journalists covering AI.
          </h1>
          <p className="font-serif text-[#55556a] text-lg md:text-xl leading-relaxed max-w-[680px] mb-8">
            The AI Behavior Index exists to make AI adoption and usage data more accessible to working journalists. Every chart is free to embed — with attribution.
          </p>

          {/* Quick start pill strip */}
          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="mailto:press@onechatai.ai"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 cursor-pointer"
              style={{ background: PURPLE }}
            >
              <Mail size={15} />
              Contact Habib (Press Officer)
            </a>
            <a
              href="/ai-behavior-index/downloads/press-kit.pdf"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded-full bg-white text-[#15151a] border border-[#e2e2ef] transition-colors hover:bg-gray-50 cursor-pointer"
            >
              <Download size={15} />
              Download Press Kit (PDF)
            </a>
          </div>
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-[#ddddf0] to-transparent" />

      <main className="max-w-[1340px] mx-auto px-4 py-12 md:py-20">

        {/* ── QUICK START ── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={22} strokeWidth={2.5} style={{ color: PURPLE }} />
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#0e0e14] tracking-tight">
              Quick start
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickStartItems.map((item) => (
              <div
                key={item.label}
                className="bg-white border border-[#e2e2ef] rounded-xl p-5 flex items-start gap-4 hover:border-[#6C56E5] hover:shadow-sm transition-all group"
              >
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white"
                  style={{ background: PURPLE_LIGHT }}
                >
                  <span style={{ color: PURPLE }}>{item.icon}</span>
                </div>
                <div>
                  <p className="font-sans font-bold text-[14px] text-[#0e0e14] mb-1 group-hover:text-[#6C56E5] transition-colors">
                    {item.label}
                  </p>
                  <p className="font-sans text-[13px] text-[#6a6a7a] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-t-2 border-[#e2e2ef] mb-16" />

        {/* ── WHAT WE COVER ── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <BarChart2 size={22} strokeWidth={2.5} style={{ color: PURPLE }} />
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#0e0e14] tracking-tight">
              What we cover
            </h2>
          </div>
          <p className="font-serif text-[16px] md:text-[17px] text-[#55556a] leading-relaxed mb-8 max-w-[680px]">
            The Index focuses on six primary categories of behavioral data — how people actually use AI, not what they think about it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {coverageTopics.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-3 bg-white border border-[#e2e2ef] rounded-xl px-4 py-3.5 hover:border-[#6C56E5] transition-colors group"
              >
                <span
                  className="shrink-0"
                  style={{ color: PURPLE }}
                >
                  {t.icon}
                </span>
                <span className="font-sans text-[13.5px] font-semibold text-[#2a2a3a] group-hover:text-[#6C56E5] transition-colors">
                  {t.label}
                </span>
              </div>
            ))}
          </div>

          {/* What we do NOT cover callout */}
          <div
            className="rounded-xl p-5 flex items-start gap-3"
            style={{ background: '#fff8f0', borderLeft: '4px solid #f59e0b', borderRadius: '0 12px 12px 0' }}
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-500" />
            <div>
              <p className="font-sans text-[12px] font-bold uppercase tracking-wider text-amber-600 mb-1.5">
                What we do not cover
              </p>
              <p className="font-sans text-[13px] text-[#5a4a30] leading-relaxed">
                AI capability benchmarks, model performance comparisons, AI safety research, and AI policy analysis.
                Better sources exist for those topics — we recommend{' '}
                <a href="https://aiindex.stanford.edu" target="_blank" rel="noopener noreferrer" className="underline font-medium">Stanford HAI's AI Index Report</a>,{' '}
                <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" className="underline font-medium">Artificial Analysis</a>, and{' '}
                <a href="https://www.safe.ai" target="_blank" rel="noopener noreferrer" className="underline font-medium">the Center for AI Safety</a>.
              </p>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-t-2 border-[#e2e2ef] mb-16" />

        {/* ── STORY ANGLES ── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <FileText size={22} strokeWidth={2.5} style={{ color: PURPLE }} />
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#0e0e14] tracking-tight">
              Story angles we can help with
            </h2>
          </div>
          <p className="font-serif text-[16px] md:text-[17px] text-[#55556a] leading-relaxed mb-8 max-w-[680px]">
            The Index is built to support data-driven editorial. Here are the six most common story types we support:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storyAngles.map((angle, i) => (
              <div
                key={angle.title}
                className="bg-white border border-[#e2e2ef] rounded-xl p-5 flex items-start gap-4 group hover:border-[#6C56E5] hover:shadow-sm transition-all"
              >
                <div
                  className="shrink-0 font-sans font-extrabold text-[22px] leading-none w-9 h-9 flex items-center justify-center rounded-lg"
                  style={{ background: PURPLE_LIGHT, color: PURPLE }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-sans font-bold text-[14px] text-[#0e0e14] mb-1 group-hover:text-[#6C56E5] transition-colors">
                    {angle.title}
                  </p>
                  <p className="font-sans text-[13px] text-[#6a6a7a] leading-relaxed">{angle.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-t-2 border-[#e2e2ef] mb-16" />

        {/* ── CITATION GUIDELINES ── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <Quote size={22} strokeWidth={2.5} style={{ color: PURPLE }} />
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#0e0e14] tracking-tight">
              Citation guidelines
            </h2>
          </div>
          <p className="font-serif text-[16px] md:text-[17px] text-[#55556a] leading-relaxed mb-8 max-w-[680px]">
            When citing the AI Behavior Index, please follow these guidelines:
          </p>

          <div className="bg-white border border-[#e2e2ef] rounded-xl overflow-hidden mb-5">
            {[
              {
                label: 'Attribution',
                value: '"AI Behavior Index" or "the AI Behavior Index, the research arm of OneChat AI"',
              },
              {
                label: 'Link back',
                value: 'Include a link to the source topic page when used in digital contexts (articles, newsletters, social media).',
              },
              {
                label: 'Chart usage',
                value: 'Use chart images as embedded — not modified beyond resizing, recoloring, or cropping in ways that distort the data.',
              },
              {
                label: 'Primary sources',
                value: 'Respect the underlying data sources we cite — when in doubt, cite the primary source alongside the Index.',
              },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`grid grid-cols-[130px_1fr] md:grid-cols-[160px_1fr] gap-4 px-5 py-4 font-sans text-[13px] hover:bg-[#f9f9fc] transition-colors ${i !== arr.length - 1 ? 'border-b border-[#eeeef8]' : ''}`}
              >
                <div className="font-bold text-[#0e0e14]">{row.label}</div>
                <div className="text-[#4a4a55] leading-relaxed">{row.value}</div>
              </div>
            ))}
          </div>

          {/* Citation format callout */}
          <div
            className="rounded-xl p-5"
            style={{ background: PURPLE_LIGHT, borderLeft: `4px solid ${PURPLE}`, borderRadius: '0 12px 12px 0' }}
          >
            <p className="font-sans text-[11px] tracking-[0.18em] uppercase font-bold mb-2" style={{ color: PURPLE }}>
              Preferred citation format
            </p>
            <p className="font-mono text-[13px] text-[#3a3460] leading-relaxed">
              AI Behavior Index (2026). "Topic Title." OneChat AI. Retrieved from aibehaviorindex.org/[category]/[topic]
            </p>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-t-2 border-[#e2e2ef] mb-16" />

        {/* ── PRESS CONTACT ── */}
        <section className="mb-4">
          <div className="flex items-center gap-3 mb-8">
            <Mail size={22} strokeWidth={2.5} style={{ color: PURPLE }} />
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#0e0e14] tracking-tight">
              Press contact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* General contact */}
            <div className="bg-white border border-[#e2e2ef] rounded-xl p-6 hover:border-[#6C56E5] transition-colors group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: PURPLE_LIGHT }}
              >
                <Mail size={18} style={{ color: PURPLE }} />
              </div>
              <p className="font-sans font-bold text-[15px] text-[#0e0e14] mb-1.5">General press inquiries</p>
              <p className="font-sans text-[13px] text-[#6a6a7a] leading-relaxed mb-4">
                For custom data requests, background interviews, or to request high-resolution chart assets — contact us with your deadline.
              </p>
              <p className="font-sans text-[13px] text-[#2a2a3a] mb-2">
                <strong>Press Officer:</strong> Habib
              </p>
              <a
                href="mailto:press@onechatai.ai"
                className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold underline transition-colors"
                style={{ color: PURPLE }}
              >
                press@onechatai.ai
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Urgent requests */}
            <div
              className="rounded-xl p-6"
              style={{ background: PURPLE_LIGHT }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: PURPLE }}
              >
                <Zap size={18} className="text-white" />
              </div>
              <p className="font-sans font-bold text-[15px] mb-1.5" style={{ color: PURPLE_DARK }}>
                Urgent media requests
              </p>
              <p className="font-sans text-[13px] text-[#4a4480] leading-relaxed mb-4">
                For same-day deadlines, mark your subject line:
              </p>
              <div
                className="font-mono text-[12px] px-4 py-2.5 rounded-lg leading-relaxed"
                style={{ background: 'rgba(108,86,229,0.12)', color: PURPLE_DARK }}
              >
                URGENT — DEADLINE [DATE/TIME]
              </div>
              <p className="font-sans text-[12px] text-[#5a5490] mt-3 leading-relaxed">
                We will prioritize accordingly.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
