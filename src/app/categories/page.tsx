import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer"; 
import CategoriesPageClient from "@/src/components/CategoriesPageClient";

export const metadata: Metadata = {
  title: "Discover AI Research Topics and Categories - AI Behavior Index",
  description:
    "Discover every AI research category in the AI Behavior Index — adoption trends, use cases, industry, country, age group, and market share. Free data, charts, and statistics.",
  alternates: {
    canonical: "https://onechatai.ai/ai-behavior-index/categories/",
  },
  openGraph: {
    title: "Discover AI Research Topics and Categories - AI Behavior Index",
    description:
      "Discover every AI research category in the AI Behavior Index — adoption trends, use cases, industry, country, age group, and market share. Free data, charts, and statistics.",
    url: "https://onechatai.ai/ai-behavior-index/categories/",
  },
};

// ─── Skeleton shown while DB data is loading (Suspense fallback) ──
function CategoriesGridSkeleton() {
  return (
    <>
      {/* Search bar placeholder */}
      <div className="bg-white border-b border-[#d7e3f0] px-4 md:px-8 py-3.5 md:py-5 sticky top-[53px] md:top-[57px] z-10">
        <div className="max-w-[1340px] px-4 mx-auto">
          <div className="h-[42px] w-full max-w-[520px] bg-[#eaf2fb] border border-[#d7e3f0] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Card skeletons */}
      <div className="max-w-[1340px] mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] md:gap-[20px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#d7e3f0] rounded-[6px] p-[24px] px-[22px] md:p-[32px] md:px-[30px] flex flex-col min-h-auto md:min-h-[220px] animate-pulse"
            >
              {/* Icon */}
              <div className="w-[28px] h-[28px] bg-[#eaf2fb] rounded-md mb-[14px] md:mb-[16px]" />
              {/* Title */}
              <div className="h-[22px] w-2/3 bg-[#eaf2fb] rounded mb-[10px]" />
              {/* Description */}
              <div className="flex-1 space-y-2 mb-[14px] md:mb-[18px]">
                <div className="h-[13px] w-full bg-[#f4f8fc] rounded" />
                <div className="h-[13px] w-5/6 bg-[#f4f8fc] rounded" />
                <div className="h-[13px] w-3/4 bg-[#f4f8fc] rounded" />
              </div>
              {/* CTA */}
              <div className="h-[13px] w-[72px] bg-[#eaf2fb] rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Async data-fetching component (wrapped in Suspense) ───────────
async function CategoriesData() {
  await dbConnect();

  const categoriesRaw = await Category.find({}).sort({ position: 1 }).lean();

  const categories = await Promise.all(
    categoriesRaw.map(async (cat: any) => {
      const topicCount = await Topic.countDocuments({
        categoryId: cat._id,
        status: "published",
      });
      return {
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description ?? "",
        iconUrl: cat.iconUrl ?? "",
        topicCount,
      };
    })
  );

  return <CategoriesPageClient categories={categories} />;
}

// ─── Page shell ───────────────────────────────────────────────────
export default async function CategoriesPage() {
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
        name: "Categories",
        item: `${baseUrl}/ai-behavior-index/categories/`,
      },
    ],
  };

  return (
    <div className="bg-white text-[#15151a] font-serif leading-relaxed text-[15px] md:text-[16px] min-h-screen w-full">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* TOP NAV */}
      <Header activeTab="categories" />

      {/* BREADCRUMB */}
      <div className="bg-white px-4 md:px-8 pt-3 md:pt-4">
        <div className="max-w-[1340px] px-4 mx-auto font-sans text-[11px] md:text-xs text-[#8a8a95] text-left">
          <Link href="/" className="hover:text-[#15151a]">
            Home
          </Link>
          <span className="mx-1.5 md:mx-2 opacity-50">›</span>
          <span className="text-[#15151a] font-semibold">Categories</span>
        </div>
      </div>

      {/* BROWSE HEADER */}
      <section className="bg-white border-b border-[#d7e3f0] pt-6 md:pt-10 pb-7 md:pb-11 px-5 md:px-8 text-left">
        <div className="max-w-[1340px] px-4 mx-auto">
          <div className="font-sans text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#6C56E5] font-bold mb-[6px] md:mb-0">
            Browse The Full Index
          </div>
          <h1 className="font-serif text-[32px] md:text-[52px] leading-[1.05] font-bold tracking-[-0.02em] text-[#15151a] max-w-[880px]">
            All Categories
          </h1>
          <p className="text-[13.5px] md:text-base text-[#4a4a55] max-w-[760px] leading-[1.55] mt-3 md:mt-3.5">
            Filter, compare, and explore independent AI adoption and usage data
            across six major categories of behavior.
          </p>
        </div>
      </section>

      {/* SEARCH + GRID — streamed in with skeleton fallback */}
      <Suspense fallback={<CategoriesGridSkeleton />}>
        <CategoriesData />
      </Suspense>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}