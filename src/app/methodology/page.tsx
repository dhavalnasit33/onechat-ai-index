import React from 'react';
import { Menu } from 'lucide-react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export const metadata = {
  title: 'Methodology | AI Behavior Index | OneChat AI',
  description: 'Learn how we collect, verify, aggregate, and normalize AI usage statistics for the AI Behavior Index.',
};

export default function MethodologyPage() {
  return (
    <div className="bg-[#f9fbfd] min-h-screen text-[#15151a]">
      {/* SITE HEADER */}
      <Header activeTab="methodology" />

      {/* BREADCRUMB */}
      <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
        <div className="max-w-[1340px] mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95] text-left">
          <a href="/ai-behavior-index/" className="hover:text-[#15151a]">Home</a>
          <span className="mx-1.5 md:mx-2 opacity-50">›</span>
          <span className="text-[#15151a] font-semibold">Methodology</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 pt-6 pb-8 md:pt-10 md:pb-12 text-left">
        <div className="max-w-[800px] mx-auto">
          <span className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-3 block">
            Technical Standards
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#15151a] leading-tight mb-4">
            Index Methodology
          </h1>
          <p className="font-serif text-[#4a4a55] text-lg leading-relaxed max-w-[720px]">
            The AI Behavior Index by OneChat AI aggregates, verifies, and indexes empirical research on how individuals, industries, and demographics interact with artificial intelligence.
          </p>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <main className="max-w-[800px] mx-auto px-4 py-10 md:py-16 text-left">
        <article className="prose prose-blue max-w-none font-serif text-[15px] md:text-[16.5px] leading-relaxed text-[#2a2a35] space-y-8">
          
          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              1. Scope & Objective
            </h2>
            <p>
              The primary objective of the AI Behavior Index is to filter out speculation and replace it with empirical truth. We track <strong>behavioral metrics</strong> (how people are actually using AI tools) rather than attitude or sentiment metrics. Our scope includes:
            </p>
            <ul className="list-disc pl-5 font-sans text-sm md:text-[15px] space-y-1.5 text-[#4a4a55]">
              <li><strong>Generational Cohorts:</strong> Behavior shifts across Gen Z, Millennials, Gen X, and Baby Boomers.</li>
              <li><strong>Geographic Variance:</strong> Country-level dominance of AI apps, regional adoption speed, and localized tool preferences.</li>
              <li><strong>Workplace Intensity:</strong> Average sessions, task completion times, and use cases by corporate department (e.g. Sales, Marketing, Software Engineering).</li>
              <li><strong>Adoption Velocity:</strong> Longitudinal tracking of weekly and daily active usage metrics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              2. Data Sourcing & Trust Verification
            </h2>
            <p>
              We do not conduct original primary polling. Instead, we act as a secondary aggregator and verification layer. Data sources must meet strict guidelines to be included in the index:
            </p>
            <div className="bg-[#eaf2fb] border-l-4 border-[#088DFF] p-4 font-sans text-xs md:text-sm text-[#2a4d7c] my-4 rounded-r">
              <strong className="font-semibold block mb-1">Source Standards Checklist:</strong>
              <ul className="list-decimal pl-4 space-y-1 mt-1">
                <li>Primary research publisher must have a transparent, published methodology.</li>
                <li>Sample sizes must be statistically representative (minimum <i>n=1,000</i> for general national surveys).</li>
                <li>Data must be published within the last 12 months (or explicitly marked as historic Trend data).</li>
                <li>Sponsors or political affiliations of the study must be declared.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              3. Data Normalization
            </h2>
            <p>
              Because different institutions format survey queries differently (e.g., measuring "daily use" vs. "at least weekly use"), we normalize metrics to ensure cross-comparability. Each chart details exactly how variables were mapped.
            </p>
            <p>
              For example, when aggregating weekly use by Gen Z, we align age boundaries (defining Gen Z as individuals aged 18 to 25 at the time of survey administration) and combine datasets only when survey methodology matches closely in confidence intervals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              4. The Embed & Backlink Standard
            </h2>
            <p>
              To encourage transparency and data-driven reporting, the AI Behavior Index provides clean copy-paste embed code. These widgets display interactive, responsive charts. In accordance with open-web referencing standards, the attribution anchors contained in our embed codes are <strong>dofollow links</strong>. They allow search engines to trace chart data back to its verification node here on the index.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              5. Refresh & Lifecycle Schedule
            </h2>
            <p>
              The index undergoes a comprehensive review and refresh cycle every quarter. During this refresh:
            </p>
            <ul className="list-disc pl-5 font-sans text-sm md:text-[15px] space-y-1.5 text-[#4a4a55]">
              <li>We ingest new quarterly studies.</li>
              <li>We update the status of existing charts (marking outdated reports as "archived" and moving newer data to "active").</li>
              <li>We log historical values to the database to preserve trend lines.</li>
            </ul>
            <p className="pt-2 text-xs md:text-sm text-[#8a8a95]">
              Last updated: June 2026. Next scheduled index refresh: September 2026.
            </p>
          </section>

        </article>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
