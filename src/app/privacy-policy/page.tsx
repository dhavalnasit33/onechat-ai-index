import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import React from 'react';

export const metadata = {
  title: 'Privacy Policy | AI Behavior Index | OneChat AI',
  description: 'Privacy Policy for the AI Behavior Index, a research publication operated by OneChat AI LLC.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f9fbfd] min-h-screen text-[#15151a]">
      {/* SITE HEADER */}
      <Header activeTab="none" />

      {/* BREADCRUMB */}
      <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
        <div className="max-w-[1340px] mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95] px-4 text-left">
          <a href="/ai-behavior-index/" className="hover:text-[#15151a]">Home</a>
          <span className="mx-1.5 md:mx-2 opacity-50">›</span>
          <span className="text-[#15151a] font-semibold">Privacy Policy</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 pt-6 pb-8 md:pt-10 md:pb-12 text-left">
        <div className="max-w-[1340px] mx-auto px-4 text-left">
          <span className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#6C56E5] font-bold mb-3 block">
            Legal
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#15151a] leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="font-sans text-[12px] md:text-[13px] text-[#8a8a95]">
            Last updated: June 10, 2026
          </p>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <main className="max-w-[1340px] mx-auto px-4 py-10 md:py-16 text-left">
        <article className="font-serif text-[15px] md:text-[16.5px] leading-relaxed text-[#2a2a35] space-y-8">

          <p className="text-[14px] md:text-[15px] text-[#4a4a55] leading-[1.6]">
            The AI Behavior Index ("we," "us," "our") is a research publication operated by OneChat AI LLC, a Delaware limited liability company. This Privacy Policy describes the limited data we collect when you visit the AI Behavior Index website (<span className="text-[#6C56E5] font-medium">aibehaviorindex.org</span> and the AI Behavior Index pages at <span className="text-[#6C56E5] font-medium">onechatai.ai/ai-behavior-index</span>).
          </p>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              1. Information we collect
            </h2>
            <p className="text-[14px] md:text-[15px] text-[#4a4a55] leading-[1.6]">
              We collect minimal information necessary to operate and improve the Index.
            </p>

            <div className="bg-[#f0edff] border-l-4 border-[#6C56E5] p-4 font-sans text-xs md:text-sm text-[#4b3bb0] rounded-r">
              <strong className="font-semibold block mb-2 text-[#3b2e93]">Automatically collected</strong>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>Anonymous analytics data: pages visited, time spent, referring website, device type, browser version, and approximate geographic location (country/region only)</li>
                <li>Embed tracking: when our charts are embedded on third-party websites, we log the referring URL to understand where our content is being used</li>
              </ul>
            </div>

            <div className="bg-[#f0edff] border-l-4 border-[#6C56E5] p-4 font-sans text-xs md:text-sm text-[#4b3bb0] rounded-r">
              <strong className="font-semibold block mb-2 text-[#3b2e93]">You provide directly</strong>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>Email correspondence: when you contact us at <a href="mailto:research@aibehaviorindex.org" className="underline font-medium hover:text-[#3b2e93] transition-colors">research@aibehaviorindex.org</a>, we retain your email address and the content of your message</li>
                <li>Newsletter subscription (if applicable): your email address, only if you actively subscribe</li>
              </ul>
            </div>

            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6] bg-white border border-[#d7e3f0] rounded-[4px] p-4">
              <strong className="text-[#15151a]">We do not collect:</strong> account information, payment information, AI chat data, or personally identifiable information through site usage. The AI Behavior Index does not require user accounts.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              2. How we use information
            </h2>
            <ul className="list-disc pl-5 font-sans text-[13px] md:text-[14px] space-y-2 text-[#4a4a55] leading-[1.6]">
              <li>To analyze site traffic and improve content</li>
              <li>To track citation and embed patterns for editorial purposes</li>
              <li>To respond to your inquiries</li>
              <li>To send newsletter updates (only if you have subscribed)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              3. Third-party services
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              We use the following third-party services that may collect data on our behalf, including but not limited to the following:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'Google Analytics', desc: 'Site analytics' },
                { name: 'Cloudinary', desc: 'Content delivery' },
                { name: 'Sendgrid', desc: 'Transactional & outbound email' },
              ].map((svc) => (
                <div key={svc.name} className="bg-white border border-[#d7e3f0] rounded-[4px] p-4 hover:border-[#6C56E5] transition-colors group">
                  <div className="font-sans text-[13px] font-semibold text-[#15151a] mb-1 group-hover:text-[#6C56E5] transition-colors">{svc.name}</div>
                  <div className="font-sans text-[12px] text-[#8a8a95]">{svc.desc}</div>
                </div>
              ))}
            </div>
            <p className="font-sans text-[12px] md:text-[13px] text-[#8a8a95] leading-[1.6]">
              Each of these providers has its own privacy policy governing how it handles data. Links to their policies are available on request.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              4. Data retention
            </h2>
            <div className="bg-white border border-[#d7e3f0] rounded-[4px] overflow-hidden">
              {[
                { label: 'Analytics data', value: 'Retained for 13 months or per analytics provider default' },
                { label: 'Embed tracking logs', value: 'Retained for 24 months' },
                { label: 'Email correspondence', value: 'Retained for 3 years for record-keeping purposes' },
                { label: 'Newsletter subscriber data', value: 'Retained until you unsubscribe' },
              ].map((row, i) => (
                <div key={row.label} className={`grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-4 px-4 py-3 font-sans text-[12px] md:text-[13px] ${i !== 3 ? 'border-b border-[#eaf2fb]' : ''} hover:bg-[#f9fbfd] transition-colors`}>
                  <div className="font-semibold text-[#15151a]">{row.label}</div>
                  <div className="text-[#4a4a55]">{row.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              5. Your rights
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              If you are located in the European Union (GDPR), United Kingdom (UK GDPR), California (CCPA/CPRA), or other jurisdictions with similar privacy laws, you have certain rights regarding your personal data, including:
            </p>
            <ul className="list-disc pl-5 font-sans text-[13px] md:text-[14px] space-y-2 text-[#4a4a55] leading-[1.6]">
              <li>The right to access information we hold about you</li>
              <li>The right to request correction or deletion</li>
              <li>The right to object to or restrict certain processing</li>
              <li>The right to withdraw consent (where processing is based on consent)</li>
              <li>The right to data portability</li>
              <li>The right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              To exercise these rights, contact us at <a href="mailto:research@aibehaviorindex.org" className="text-[#6C56E5] font-medium underline hover:text-[#3b2e93] transition-colors">research@aibehaviorindex.org</a>. We will respond within the timeframes required by applicable law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              6. Cookies
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              The AI Behavior Index uses minimal cookies, including:
            </p>
            <ul className="list-disc pl-5 font-sans text-[13px] md:text-[14px] space-y-2 text-[#4a4a55] leading-[1.6]">
              <li>Essential cookies required for site functionality</li>
              <li>Anonymous analytics cookies (which can be disabled in your browser settings)</li>
            </ul>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              We do not use advertising cookies, cross-site tracking cookies, or third-party marketing cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              7. Children's privacy
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              The AI Behavior Index is not directed to children under 13 (or under 16 in jurisdictions where that is the applicable age). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us at <a href="mailto:research@aibehaviorindex.org" className="text-[#6C56E5] font-medium underline hover:text-[#3b2e93] transition-colors">research@aibehaviorindex.org</a> and we will delete it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              8. Changes to this policy
            </h2>
            <p className="font-sans text-[13px] md:text-[14px] text-[#4a4a55] leading-[1.6]">
              We may update this Privacy Policy from time to time. The "Last updated" date at the top of this policy indicates when changes were last made. Material changes will be announced on the AI Behavior Index homepage.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-[#15151a] tracking-tight">
              9. Contact
            </h2>
            <div className="bg-white border border-[#d7e3f0] rounded-[4px] p-5 md:p-6 flex items-start gap-4 hover:border-[#6C56E5] transition-colors">
              <div className="text-[22px] leading-none mt-0.5">✉️</div>
              <div>
                <div className="font-sans text-[13px] font-semibold text-[#15151a] mb-1">Privacy questions, requests, or complaints</div>
                <a href="mailto:research@aibehaviorindex.org" className="font-sans text-[13px] text-[#6C56E5] font-semibold underline hover:text-[#3b2e93] transition-colors">
                  research@aibehaviorindex.org
                </a>
              </div>
            </div>
          </section>

        </article>
      </main>

      {/* FOOTER */}
     <Footer/>
    </div>
  );
}
