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

  const baseTitle = topic.metaTitle || topic.title;
  let pageTitle = `${baseTitle} | AI Behavior Index`;
  if (pageTitle.length > 60) pageTitle = baseTitle.substring(0, 57) + "...";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";
  const firstChart = await Chart.findOne({
    topicId: topic._id,
    status: "active",
  })
    .sort({ position: 1 })
    .lean();
  const ogImageUrl = firstChart
    ? `${baseUrl}/api/chart-images/${firstChart.chartId}.png`
    : topic.ogImageUrl || "";

  return {
    title: pageTitle,
    description: topic.metaDescription || topic.description,
    alternates: {
      canonical: `${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/`,
    },
    openGraph: {
      title: baseTitle,
      description: topic.metaDescription || topic.description,
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
    .limit(3)
    .lean();
  const formattedDate = topic.lastRefreshedAt
    ? new Date(topic.lastRefreshedAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "June 2026";

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#1a1a1a] font-sans text-[14px] md:text-[15px] leading-[1.55] md:leading-[1.6]">
      {/* SITE HEADER */}
      <Header activeTab="none" />

      {/* BREADCRUMB */}
      <div className="bg-[#eaf2fb] py-2 md:py-3 overflow-x-auto whitespace-nowrap">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-[11px] md:text-[13px]">
          <a href="/" className="text-[#1e3a5f] hover:underline">
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
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 pb-5 md:pt-[48px] md:pb-[32px]">
        <span className="inline-block bg-[#eaf2fb] text-[#1e3a5f] text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.6px] md:tracking-[0.8px] px-2.5 py-1 md:px-[14px] md:py-[5px] rounded-full mb-3 md:mb-4">
          By {category.name}
        </span>
        <h1 className="font-serif text-[24px] md:text-[44px] font-bold leading-[1.15] text-[#1a1a1a] mb-2.5 md:mb-4 max-w-[900px]">
          {topic.title}
        </h1>
        <p className="text-[13px] md:text-[18px] leading-[1.55] md:leading-[1.6] text-[#555] max-w-[800px] mb-3.5 md:mb-5">
          {topic.description}
        </p>
        <div className="flex flex-wrap gap-3 md:gap-6 text-[#888] text-[11px] md:text-[13px] pt-3 md:pt-5 border-t border-[#e5e5e5]">
          <span className="flex items-center gap-1.5">
            <BarChart2 size={14} className="text-[#888]" /> {charts.length} charts
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-[#888]" /> {topic.sourceCount || 9} sources
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#888]" /> Last updated {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <LinkIcon size={14} className="text-[#888]" /> Free to embed
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pb-8 md:pb-[64px]">
        <TopicChartsClient
          charts={charts}
          categorySlug={category.slug}
          topicSlug={topic.slug}
          topicTitle={topic.title}
        />

        {/* METHODOLOGY BLOCK */}
        <div className="bg-[#fafafc] border-l-[3px] md:border-l-[4px] border-[#6C56E5] rounded-r-md md:rounded-r-lg p-[14px_16px] md:p-[24px_28px] my-5 md:mt-[40px] md:mb-0">
          <h3 className="font-serif text-[14px] md:text-[17px] mb-1.5 md:mb-2 text-[#1a1a1a] font-bold">
            About this data
          </h3>
          <p className="text-[12px] md:text-[14px] text-[#555] mb-1.5 md:mb-2">
            {topic.methodologyNote ||
              "All statistics on this page are compiled from publicly available studies. We do not conduct primary research. Each chart cites its source studies, and we link to original publications wherever possible."}
          </p>
          <p className="text-[12px] md:text-[14px] text-[#555]">
            Data is refreshed quarterly. Have a study to suggest? Contact{" "}
            <a
              href="mailto:support@onechatai.ai"
              className="text-[#6C56E5] font-semibold hover:underline"
            >
              support@onechatai.ai
            </a>
            .
          </p>
        </div>

        {/* JOURNALIST CTA */}
        <div className="bg-[#1e3a5f] text-white rounded-[10px] md:rounded-xl p-[20px_18px] md:p-[36px_40px] mt-5 md:mt-[32px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
          <div>
            <h3 className="font-serif text-[16px] md:text-[22px] mb-1.5 font-bold">
              Writing about AI usage trends?
            </h3>
            <p className="text-[12px] md:text-[14px] text-white/80 m-0">
              All charts on this page are free to embed in articles,
              newsletters, and reports.
            </p>
          </div>
          <a
            href="#"
            className="block md:inline-block w-full md:w-auto text-center bg-white text-[#1e3a5f] px-4.5 py-2.5 md:px-[24px] md:py-[12px] rounded-md font-semibold text-[13px] md:text-[14px] whitespace-nowrap"
          >
            Press resources →
          </a>
        </div>

        {/* RELATED TOPICS */}
        {relatedTopics.length > 0 && (
          <div className="mt-6 md:mt-[48px]">
            <h3 className="font-serif text-[16px] md:text-[22px] mb-3 md:mb-5 font-bold text-[#1a1a1a]">
              Related topics in {category.name}
            </h3>
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
                  <div className="font-serif text-[14px] md:text-[17px] font-bold leading-[1.3] mb-1 md:mb-1.5">
                    {rel.title}
                  </div>
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
