import React from 'react';
import { Metadata } from 'next';
import dbConnect from '@/src/lib/dbConnect';
import Category from '@/src/models/Category';
import Topic from '@/src/models/Topic';
import Chart from '@/src/models/Chart';
import TopicChartsClient from './TopicChartsClient';

interface PageProps {
  params: Promise<{ category: string; topic: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await dbConnect();
  const { category: categorySlug, topic: topicSlug } = await params;
  const topic = await Topic.findOne({ slug: topicSlug }).lean();

  if (!topic) {
    return {
      title: 'Topic Not Found | AI Behavior Index',
    };
  }

  const baseTitle = topic.metaTitle || topic.title;
  let pageTitle = `${baseTitle} | AI Behavior Index`;
  if (pageTitle.length > 60) {
    pageTitle = `${baseTitle} | AI Index`;
    if (pageTitle.length > 60) {
      pageTitle = baseTitle;
      if (pageTitle.length > 60) {
        pageTitle = baseTitle.substring(0, 57) + '...';
      }
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onechatai.ai';
  const firstChart = await Chart.findOne({ topicId: topic._id, status: 'active' }).sort({ position: 1 }).lean();
  const ogImageUrl = firstChart
    ? `${baseUrl}/api/chart-images/${firstChart.chartId}.png`
    : (topic.ogImageUrl || '');

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
      type: 'article',
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  await dbConnect();

  const { category: categorySlug, topic: topicSlug } = await params;

  const category = await Category.findOne({ slug: categorySlug }).lean();
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Category Not Found</h1>
          <p className="text-gray-500 mb-4">The category you are looking for does not exist.</p>
          <a href="/ai-behavior-index" className="text-blue-500 underline">Back to index</a>
        </div>
      </div>
    );
  }

  const topic = await Topic.findOne({ categoryId: category._id, slug: topicSlug }).lean();
  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Topic Not Found</h1>
          <p className="text-gray-500 mb-4">The requested topic does not exist.</p>
          <a href={`/ai-behavior-index/${category.slug}/`} className="text-blue-500 underline">Back to {category.name}</a>
        </div>
      </div>
    );
  }

  // Fetch charts belonging to this topic sorted by position
  const chartsRaw = await Chart.find({ topicId: topic._id, status: 'active' })
    .sort({ position: 1 })
    .lean();

  const charts = chartsRaw.map((chart: any) => ({
    _id: chart._id.toString(),
    chartId: chart.chartId,
    position: chart.position,
    title: chart.title,
    chartType: chart.chartType,
    data: JSON.parse(JSON.stringify(chart.data)),
    sourceLine: chart.sourceLine || '',
    imageUrl: chart.imageUrl || '',
    status: chart.status || 'active',
    sources: (chart.sources || []).map((src: any) => ({
      position: src.position,
      sourceName: src.sourceName,
      sourceUrl: src.sourceUrl || '',
      publication: src.publication || '',
      publicationDate: src.publicationDate ? (src.publicationDate instanceof Date ? src.publicationDate.toISOString() : new Date(src.publicationDate).toISOString()) : undefined,
    })),
  }));

  // Fetch 3 related topics from the same category
  const relatedTopics = await Topic.find({
    categoryId: category._id,
    slug: { $ne: topic.slug },
    status: 'published'
  })
    .limit(3)
    .lean();

  const formattedDate = topic.lastRefreshedAt
    ? new Date(topic.lastRefreshedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : topic.publishedAt
      ? new Date(topic.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'June 2026';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onechatai.ai';
  const firstChart = charts.find(c => c.status === 'active') || charts[0];
  const ogImageUrl = firstChart
    ? `${baseUrl}/api/chart-images/${firstChart.chartId}.png`
    : (topic.ogImageUrl || '');

  // JSON-LD Schema objects
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
        "name": category.name,
        "item": `${baseUrl}/ai-behavior-index/${category.slug}/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": topic.title,
        "item": `${baseUrl}/ai-behavior-index/${category.slug}/${topic.slug}/`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": topic.title,
    "description": topic.description,
    "image": ogImageUrl,
    "author": {
      "@type": "Organization",
      "name": "OneChat AI",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "OneChat AI",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": topic.publishedAt || topic.createdAt || new Date().toISOString(),
    "dateModified": topic.lastRefreshedAt || topic.updatedAt || new Date().toISOString(),
    "mainEntityOfPage": `${baseUrl}/ai-behavior-index/${category.slug}/${topic.slug}/`
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${topic.title} Dataset`,
    "description": topic.description,
    "url": `${baseUrl}/ai-behavior-index/${category.slug}/${topic.slug}/`,
    "creator": {
      "@type": "Organization",
      "name": "OneChat AI"
    },
    "distribution": [
      {
        "@type": "DataDownload",
        "encodingFormat": "image/png",
        "contentUrl": ogImageUrl
      }
    ]
  };

  const schemas = [breadcrumbSchema, articleSchema, datasetSchema];

  return (
    <div className="bg-[#f9fbfd] min-h-screen text-[#15151a]">
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
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
            <a href="/ai-behavior-index/for-journalists/" className="hover:text-[#15151a] transition-colors">For Journalists</a>
          </nav>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
        <div className="max-w-[1340px] mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95] text-left">
          <a href="/ai-behavior-index/" className="hover:text-[#15151a]">Home</a>
          <span className="mx-1.5 md:mx-2 opacity-50">›</span>
          <a href={`/ai-behavior-index/${category.slug}/`} className="hover:text-[#15151a]">{category.name}</a>
          <span className="mx-1.5 md:mx-2 opacity-50">›</span>
          <span className="text-[#15151a] font-semibold">{topic.title}</span>
        </div>
      </div>

      {/* TOPIC HERO */}
      <div className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 pt-6 pb-8 md:pt-10 md:pb-12 text-left">
        <div className="max-w-[1340px] mx-auto">
          <span className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#0468BD] font-bold mb-3 block">
            By {category.name}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#15151a] leading-tight mb-4 max-w-[900px]">
            {topic.title}
          </h1>
          <p className="font-serif text-[#4a4a55] text-base md:text-lg leading-relaxed mb-6 max-w-[780px]">
            {topic.description}
          </p>
          <div className="font-sans text-[11px] md:text-xs text-[#8a8a95] flex flex-wrap gap-4 md:gap-5">
            <span className="topic-meta-item">📊 {charts.length} charts</span>
            <span className="topic-meta-item">📚 {topic.sourceCount} sources</span>
            <span className="topic-meta-item">🗓 Last updated {formattedDate}</span>
            <span className="topic-meta-item">🔗 Free to embed</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-[1340px] mx-auto p-4 md:p-8">
        <TopicChartsClient
          charts={charts}
          categorySlug={category.slug}
          topicSlug={topic.slug}
          topicTitle={topic.title}
        />

        {/* RELATED TOPICS */}
        {relatedTopics.length > 0 && (
          <section className="mt-16 pt-8 border-t border-[#d7e3f0] text-left">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-[#15151a] mb-6">
              Related topics in {category.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
              {relatedTopics.map((rel: any, idx: number) => {
                const icons = ['📊', '📚', '⚡'];
                return (
                  <a
                    href={`/ai-behavior-index/${category.slug}/${rel.slug}/`}
                    key={rel._id.toString()}
                    className="bg-white border border-[#d7e3f0] hover:border-[#088DFF] rounded p-5 flex flex-col hover:shadow-sm transition-all"
                  >
                    <div className="text-xl mb-2">{icons[idx % icons.length]}</div>
                    <div className="font-bold text-[#15151a] leading-snug mb-1.5 hover:text-[#0468BD] transition-colors">
                      {rel.title}
                    </div>
                    <p className="text-xs text-[#8a8a95] line-clamp-2">
                      {rel.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* METHODOLOGY BLOCK */}
        <section className="mt-12 pt-8 border-t border-[#d7e3f0] text-left">
          <div className="p-[18px] md:p-[22px] bg-white border border-[#d7e3f0] rounded md:rounded-md">
            <div className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-2">
              A note on methodology
            </div>
            <p className="text-[12.5px] md:text-[13px] text-[#4a4a55] leading-[1.55]">
              {topic.methodologyNote ||
                'Every statistic shown is sourced from a publicly available study, survey, or report. We aggregate, organize, and contextualize this data — but the underlying research is conducted by the cited sources. Click any source link to access the original methodology. This index is refreshed quarterly.'}
            </p>
          </div>
        </section>
      </main>

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
  );
}
