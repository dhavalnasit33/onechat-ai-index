import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import React from 'react';

export const metadata = {
  title: "Terms of Service - AI Behavior Index",
  description:
    "The terms of service for using the AI Behavior Index, including how our AI research data, charts, and statistics may be viewed, downloaded, and embedded.",
  alternates: {
    canonical: "https://onechatai.ai/ai-behavior-index/terms-of-service/",
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#f9fbfd] min-h-screen text-[#15151a]">
      {/* SITE HEADER */}
      <Header activeTab="none" />

      {/* BREADCRUMB */}
      <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
        <div className="max-w-[1340px] px-4 mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95] text-left">
          <a href="/ai-behavior-index/" className="hover:text-[#15151a]">Home</a>
          <span className="mx-1.5 md:mx-2 opacity-50">›</span>
          <span className="text-[#15151a] font-semibold">Terms of Service</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 pt-6 pb-8 md:pt-10 md:pb-12 text-left">
        <div className="max-w-[1340px] px-4 mx-auto">
          <span className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#6C56E5] font-bold mb-3 block">
            Legal
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#15151a] leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="font-sans text-[12px] md:text-[13px] text-[#8a8a95]">
            Last updated: June 10, 2026
          </p>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <main className="max-w-[1340px] mx-auto px-4 py-10 md:py-16 text-left">
        <article className="font-serif text-[15px] md:text-[16.5px] leading-relaxed text-[#2a2a35] space-y-8">

          <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
            These Terms of Service ("Terms") govern your use of the AI Behavior Index website and its content. By accessing or using the AI Behavior Index, you agree to these Terms.
          </p>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              1. The publisher
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              The AI Behavior Index is a research publication operated by OneChat AI LLC, a Delaware limited liability company ("we," "us," "our"). For questions about these Terms, contact <a href="mailto:research@aibehaviorindex.org" className="text-[#6C56E5] font-medium underline hover:text-[#3b2e93] transition-colors">research@aibehaviorindex.org</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              2. Description of the service
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              The AI Behavior Index publishes data-driven research aggregating publicly available studies on AI adoption, usage, and market dynamics. Content includes charts, statistics, methodology pages, and editorial analysis. Access to the Index is free of charge.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              3. Embed and citation license
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              Subject to your compliance with these Terms, we grant you a perpetual, royalty-free, worldwide, non-exclusive license to use AI Behavior Index charts and statistics in the following editorial contexts:
            </p>
            <ul className="list-disc pl-5 font-sans text-[13px] md:text-[14px] space-y-2 text-[#4a4a55] leading-[1.6]">
              <li>News articles, opinion pieces, and other journalism</li>
              <li>Academic papers, research reports, and policy analysis</li>
              <li>Newsletters (including paid subscription newsletters)</li>
              <li>Educational materials and lectures</li>
              <li>Internal business reports and presentations</li>
              <li>Social media posts (with appropriate attribution)</li>
            </ul>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6] font-semibold">
              This license is subject to the following requirements:
            </p>
            <div className="bg-white border border-[#d7e3f0] rounded-[4px] overflow-hidden">
              {[
                { label: 'Attribution', value: 'Every use must clearly attribute the content to "AI Behavior Index" or "the AI Behavior Index, the research arm of OneChat AI."' },
                { label: 'Link back', value: 'When used in digital contexts (online articles, newsletters, social media posts), please include a link to the source page on aibehaviorindex.org or onechatai.ai/ai-behavior-index.' },
                { label: 'No modification', value: 'Charts may be resized to fit your layout, but may not be edited, recolored, cropped to omit context, or otherwise altered in ways that distort the underlying data.' },
                { label: 'No misrepresentation', value: 'The data may not be presented in a misleading way or used to suggest that the AI Behavior Index endorses any product, position, or argument that it does not in fact endorse.' },
              ].map((row, i) => (
                <div key={row.label} className={`grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-4 px-4 py-3.5 font-sans text-[12px] md:text-[13px] ${i !== 3 ? 'border-b border-[#eaf2fb]' : ''} hover:bg-[#f9fbfd] transition-colors`}>
                  <div className="font-semibold text-[#15151a]">{row.label}</div>
                  <div className="text-[#4a4a55]">{row.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              4. Prohibited uses
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              You may not:
            </p>
            <ul className="list-disc pl-5 font-sans text-[13px] md:text-[14px] space-y-2.5 text-[#4a4a55] leading-[1.6]">
              <li>Use AI Behavior Index content in commercial products that resell, repackage, or substantially replicate our data offering (for example, building a competing data aggregation product)</li>
              <li>Use our content for paid advertising or product promotional materials without prior written permission</li>
              <li>Scrape the site for bulk extraction of data, or use automated systems to access the site in ways that impose unreasonable load on our infrastructure</li>
              <li>Falsely claim authorship or modify content in ways that misrepresent its origin</li>
              <li>Use AI Behavior Index trademarks, logos, or brand elements in ways that suggest false affiliation or endorsement</li>
            </ul>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              For commercial licensing inquiries (for example, enterprise data subscriptions, custom data cuts, or redistribution rights), contact <a href="mailto:research@aibehaviorindex.org" className="text-[#6C56E5] font-medium underline hover:text-[#3b2e93] transition-colors">research@aibehaviorindex.org</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              5. Intellectual property
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              All editorial content, methodology, page layouts, chart designs, and original commentary on the AI Behavior Index are the intellectual property of OneChat AI LLC. The underlying statistical data is drawn from third-party sources, each of which retains its own rights to its primary research.
            </p>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              The "AI Behavior Index" name and associated branding are intellectual property of OneChat AI LLC.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              6. Accuracy and disclaimers
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              The AI Behavior Index aggregates third-party research and presents it to readers in a more accessible format. While we verify cited sources and review our content quarterly, we do not independently verify the underlying research of cited sources. We make no warranty regarding the accuracy, completeness, or timeliness of the data we publish.
            </p>
            <div className="bg-[#f0edff] border-l-4 border-[#6C56E5] p-4 font-sans text-xs md:text-sm text-[#4b3bb0] rounded-r">
              THE AI BEHAVIOR INDEX IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              7. Limitation of liability
            </h2>
            <div className="bg-[#f0edff] border-l-4 border-[#6C56E5] p-4 font-sans text-xs md:text-sm text-[#4b3bb0] rounded-r space-y-3">
              <p>TO THE FULLEST EXTENT PERMITTED BY LAW, ONECHAT AI LLC AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE AI BEHAVIOR INDEX, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
              <p>IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED ONE HUNDRED US DOLLARS ($100).</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              8. Third-party links and content
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              The AI Behavior Index links to third-party websites and cites third-party research. We are not responsible for the content, accuracy, privacy practices, or terms of third-party sites or sources.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              9. Termination
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              We reserve the right to modify, suspend, or discontinue any part of the AI Behavior Index at any time without notice. We may also terminate access to the site for users who violate these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              10. Governing law
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of laws principles. Any disputes arising from these Terms or your use of the AI Behavior Index shall be resolved in the state or federal courts located in Delaware.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              11. Changes to these Terms
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              We may update these Terms from time to time. The "Last updated" date at the top of this page indicates when changes were last made. Continued use of the AI Behavior Index after material changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              12. Contact
            </h2>
            <div className="bg-white border border-[#d7e3f0] rounded-[4px] p-5 md:p-6 flex items-start gap-4 hover:border-[#6C56E5] transition-colors">
              <div className="text-[22px] leading-none mt-0.5">✉️</div>
              <div>
                <div className="font-sans text-[13px] font-semibold text-[#15151a] mb-1">Questions about these Terms</div>
                <a href="mailto:research@aibehaviorindex.org" className="font-sans text-[13px] text-[#6C56E5] font-semibold underline hover:text-[#3b2e93] transition-colors">
                  research@aibehaviorindex.org
                </a>
              </div>
            </div>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  );
}
