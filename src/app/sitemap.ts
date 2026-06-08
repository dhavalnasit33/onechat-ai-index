import { MetadataRoute } from 'next';
import dbConnect from '@/src/lib/dbConnect';
import Category from '@/src/models/Category';
import Topic from '@/src/models/Topic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onechatai.ai';

  // Base index routes
  const routes = [
    {
      url: `${baseUrl}/ai-behavior-index/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ai-behavior-index/methodology/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-behavior-index/for-journalists/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  try {
    await dbConnect();

    // Ensure schemas are registered
    const _dummyCategory = Category.modelName;
    const _dummyTopic = Topic.modelName;

    // Fetch categories and published topics
    const categories = await Category.find({}).lean();
    const topics = await Topic.find({ status: 'published' }).populate('categoryId').lean();

    // Category routes
    const categoryEntries = categories.map((cat: any) => ({
      url: `${baseUrl}/ai-behavior-index/${cat.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Topic routes
    const topicEntries = topics.map((topic: any) => {
      const catSlug = topic.categoryId && typeof topic.categoryId === 'object' && 'slug' in topic.categoryId
        ? (topic.categoryId as any).slug
        : 'unknown';
      return {
        url: `${baseUrl}/ai-behavior-index/${catSlug}/${topic.slug}/`,
        lastModified: topic.lastRefreshedAt 
          ? new Date(topic.lastRefreshedAt) 
          : topic.publishedAt 
          ? new Date(topic.publishedAt) 
          : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    });

    return [...routes, ...categoryEntries, ...topicEntries];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return routes;
  }
}
