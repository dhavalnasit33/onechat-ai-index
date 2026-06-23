import React from "react";
import { Metadata } from "next";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";
import Chart from "@/src/models/Chart";
import { BarChart2, BookOpen, Calendar, Link as LinkIcon } from "lucide-react";
import TopicChartsClient from "./TopicChartsClient";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

interface PageProps {
  params: Promise<{ category: string; topic: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await dbConnect();
  const { category: categorySlug, topic: topicSlug } = await params;
  const topic = await Topic.findOne({ slug: topicSlug }).lean();

  if (!topic) return { title: "Topic Not Found | AI Behavior Index" };

  const pageTitle = `${topic.title} - AI Behavior Index`;
  const plainDesc = (topic.description || "").substring(0, 150);
  const description = `${topic.title}: ${plainDesc}`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";
  const ogImageUrl = topic.ogImageUrl || topic.iconUrl || "";

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: `${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/`,
    },
    openGraph: {
      title: topic.title,
      description: description,
      url: `${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: "article",
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  await dbConnect();
  const { category: categorySlug, topic: topicSlug } = await params;

  const category = await Category.findOne({ slug: categorySlug }).lean();
  if (!category) return <div>Category Not Found</div>;

  const topic = await Topic.findOne({
    categoryId: category._id,
    slug: topicSlug,
  }).lean();
  if (!topic) return <div>Topic Not Found</div>;

  const chartsRaw = await Chart.find({ topicId: topic._id, status: "active" })
    .sort({ position: 1 })
    .lean();
  const charts = chartsRaw.map((chart: any) => ({
    _id: chart._id.toString(),
    chartId: chart.chartId,
    position: chart.position,
    title: chart.title,
    subHeading: chart.subHeading || "",
    heading: chart.heading || "",
    icon: chart.icon || "",
    chartType: chart.chartType,
    data: JSON.parse(JSON.stringify(chart.data)),
    sourceLine: chart.sourceLine || "",
    status: chart.status || "active",
    sources: (chart.sources || []).map((src: any) => ({
      position: src.position,
      sourceName: src.sourceName,
      sourceUrl: src.sourceUrl || "",
      publication: src.publication || "",
    })),
  }));

  const relatedTopics = await Topic.find({
    categoryId: category._id,
    slug: { $ne: topic.slug },
    status: "published",
  })
    .limit(6)
    .lean();
  const formattedDate = topic.lastRefreshedAt
    ? new Date(topic.lastRefreshedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "June 2026";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/ai-behavior-index/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${baseUrl}/ai-behavior-index/${category.slug}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: `${baseUrl}/ai-behavior-index/${category.slug}/${topic.slug}/`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topic.title,
    description: topic.description,
    datePublished:
      (topic as any).publishedAt ||
      (topic as any).createdAt ||
      new Date().toISOString(),
    dateModified:
      (topic as any).lastRefreshedAt ||
      (topic as any).updatedAt ||
      (topic as any).publishedAt ||
      new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "OneChat AI",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "OneChat AI",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: `${baseUrl}/ai-behavior-index/${category.slug}/${topic.slug}/`,
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${topic.title} Dataset`,
    description: topic.description,
    url: `${baseUrl}/ai-behavior-index/${category.slug}/${topic.slug}/`,
    creator: {
      "@type": "Organization",
      name: "OneChat AI",
    },
    citation:
      topic.methodologyNote || "Aggregated studies from AI Behavior Index",
  };

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#1a1a1a] font-sans text-[14px] md:text-[15px] leading-[1.55] md:leading-[1.6]">
      {/* SEO Schema Markups */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      {/* SITE HEADER */}
      <Header activeTab="none" />

      {/* BREADCRUMB */}
      <div className="bg-[#eaf2fb] py-2 md:py-3 overflow-x-auto whitespace-nowrap">
        <div className="max-w-[1340px] mx-auto px-4 text-[11px] md:text-[13px]">
          <a
            href="/ai-behavior-index/"
            className="text-[#1e3a5f] hover:underline"
          >
            Home
          </a>
          <span className="text-[#888] mx-[6px] md:mx-[8px]">/</span>
          <a
            href={`/ai-behavior-index/${category.slug}`}
            className="text-[#1e3a5f] hover:underline"
          >
            {category.name}
          </a>
          <span className="text-[#888] mx-[6px] md:mx-[8px]">/</span>
          <span className="text-[#555]">{topic.title}</span>
        </div>
      </div>

      {/* TOPIC HERO */}
      <div className="max-w-[1340px] mx-auto px-4 pt-6 pb-5 md:pt-[48px] md:pb-[32px]">
        <span className="inline-block bg-[#eaf2fb] text-[#1e3a5f] text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.6px] md:tracking-[0.8px] px-2.5 py-1 md:px-[14px] md:py-[5px] rounded-full mb-3 md:mb-4">
           {category.name}
        </span>
        <h1 className="font-serif text-[24px] md:text-[44px] font-bold leading-[1.15] text-[#1a1a1a] mb-2.5 md:mb-4 max-w-[900px]">
          {topic.title}
        </h1>
        <p className="text-[13px] md:text-[18px] leading-[1.55] md:leading-[1.6] text-[#555] max-w-[800px] mb-3.5 md:mb-5">
          {topic.description}
        </p>
        <div className="flex flex-wrap gap-3 md:gap-6 text-[#888] text-[11px] md:text-[13px] pt-3 md:pt-5 border-t border-[#e5e5e5]">
          <span className="flex items-center gap-1.5">
            <BarChart2 size={14} className="text-[#888]" />{" "}
            {topic.chartCount}{" "}
            {topic.chartLabel || "charts"}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-[#888]" />{" "}
            {topic.sourceCount > 0 ? topic.sourceCount : 6} sources
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#888]" /> Last updated{" "}
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <LinkIcon size={14} className="text-[#888]" /> Free to embed
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-[1340px] mx-auto px-4 pb-8 md:pb-[64px]">
        <TopicChartsClient
          charts={charts}
          categorySlug={category.slug}
          topicSlug={topic.slug}
          topicTitle={topic.title}
        />

        {/* METHODOLOGY BLOCK */}
        <div className="bg-[#fafafc] border-l-[3px] md:border-l-[4px] border-[#6C56E5] rounded-r-md md:rounded-r-lg p-[14px_16px] md:p-[24px_28px] my-5 md:mt-[40px] md:mb-0">
          <h2 className="font-serif text-[14px] md:text-[17px] mb-1.5 md:mb-2 text-[#1a1a1a] font-bold">
            About this data
          </h2>
          {topic.aboutData ? (
            <div
              className="text-[12px] md:text-[14px] text-[#555] mb-1.5 md:mb-2 font-sans rich-text-content [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: topic.aboutData }}
            />
          ) : (
            <>  
              <p className="text-[12px] md:text-[14px] text-[#555] mb-1.5 md:mb-2">
                All statistics on this page are compiled from publicly available studies. We do not conduct primary research. Each chart cites its source studies, and we link to original publications wherever possible.
              </p>
              <p className="text-[12px] md:text-[14px] text-[#555]">
                Data is refreshed quarterly. Have a study to suggest? Contact{" "}
                <a
                  href="mailto:research@aibehaviorindex.org"
                  className="text-[#6C56E5] font-semibold hover:underline"
                >
                  research@aibehaviorindex.org
                </a>
                .
              </p>
            </>
          )}
        </div>



        {/* RELATED TOPICS */}
        {relatedTopics.length > 0 && (
          <div className="mt-6 md:mt-[48px]">
            <h2 className="font-serif text-[16px] md:text-[22px] mb-3 md:mb-5 font-bold text-[#1a1a1a]">
              Related topics in {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5">
              {relatedTopics.map((rel: any) => (
                <a
                  href={`/ai-behavior-index/${category.slug}/${rel.slug}/`}
                  key={rel._id.toString()}
                  className="block bg-white border border-[#e5e5e5] rounded-lg p-3 md:p-[20px_22px] text-[#1a1a1a] transition-all hover:border-[#6C56E5] md:hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(108,86,229,0.1)]"
                >
                  <div className="text-[9.5px] md:text-[11px] text-[#6C56E5] uppercase tracking-[0.5px] md:tracking-[0.8px] font-semibold mb-1 md:mb-2">
                    {category.name}
                  </div>
                  <h3 className="font-serif text-[14px] md:text-[17px] font-bold leading-[1.3] mb-1 md:mb-1.5">
                    {rel.title}
                  </h3>
                  <div className="text-[11px] md:text-[12px] text-[#888]">
                    Updated recently
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
