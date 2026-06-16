import React from "react";
import { Metadata } from "next";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";
import Chart from "@/src/models/Chart";
import CategoryPageClient from "@/src/components/CategoryPageClient";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  await dbConnect();
  const { category: categorySlug } = await params;
  const category = await Category.findOne({ slug: categorySlug }).lean();

  if (!category) return { title: "Category Not Found | AI Behavior Index" };

  const pageTitle = `${category.name} - AI Research Data, Charts & Statistics - AI Behavior Index.`;
  const description = `Browse ${category.name} AI research data, charts, and statistics. Free to view, download, and embed — independent data on how AI is adopted and used, from the AI Behavior Index.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onechatai.ai";
  const ogImageUrl = category.featuredImage || category.iconUrl || "";

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: `${baseUrl}/ai-behavior-index/${categorySlug}/`,
    },
    openGraph: {
      title: pageTitle,
      description: description,
      url: `${baseUrl}/ai-behavior-index/${categorySlug}/`,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  await dbConnect();

  const { category: categorySlug } = await params;
  const { q = "", sort = "most-cited", page = "1" } = await searchParams;

  const category = await Category.findOne({ slug: categorySlug }).lean();

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Category Not Found</h1>
          <p className="text-gray-500 mb-4">
            The requested category slug does not exist.
          </p>
          <a href="/ai-behavior-index/" className="text-blue-500 underline">
            Back to index
          </a>
        </div>
      </div>
    );
  }

  // Fetch topics in category
  const topicsRaw = await Topic.find({
    categoryId: category._id,
    status: "published",
  }).lean();
  const topicIds = topicsRaw.map((t) => t._id);

  // Build filter for charts
  const chartFilter: any = {
    topicId: { $in: topicIds },
    status: "active",
    chartType: { $nin: ["text_block", "list_block", "hero_stat"] },
  };

  if (q) {
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matchingTopics = await Topic.find({
      categoryId: category._id,
      status: "published",
      $or: [
        { title: { $regex: escapedQ, $options: "i" } },
        { description: { $regex: escapedQ, $options: "i" } },
      ],
    }).lean();
    const matchingTopicIds = matchingTopics.map((t) => t._id);

    chartFilter.$or = [
      { title: { $regex: escapedQ, $options: "i" } },
      { heading: { $regex: escapedQ, $options: "i" } },
      { topicId: { $in: matchingTopicIds } },
    ];
  }

  // Sorting
  let sortObj: any = {};
  if (sort === "recent") {
    sortObj = { createdAt: -1 };
  } else if (sort === "a-z") {
    sortObj = { title: 1 };
  } else {
    sortObj = { position: 1 }; // default order
  }

  const limit = 12;
  const currentPage = parseInt(page) || 1;
  const skip = (currentPage - 1) * limit;

  const charts = await Chart.find(chartFilter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate("topicId")
    .lean();

  const totalCount = await Chart.countDocuments(chartFilter);
  const totalPages = Math.ceil(totalCount / limit);

  // Serialize to plain JSON objects before passing to client components to avoid ObjectId warnings
  const serializedCategory = JSON.parse(JSON.stringify(category));
  const serializedCharts = JSON.parse(JSON.stringify(charts));

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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryPageClient
        category={serializedCategory}
        initialCharts={serializedCharts}
        initialTotalCount={totalCount}
        initialTotalPages={totalPages}
      />
    </>
  );
}
