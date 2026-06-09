import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Topic from '@/src/models/Topic';

const getPagination = (searchParams: URLSearchParams) => {
  const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10);
  const requestedLimit = Number.parseInt(searchParams.get('limit') || '10', 10);

  return {
    requestedPage: Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    limit: Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 10,
  };
};

// GET /api/admin/topics — List topics with filters & pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');

    const filter: Record<string, any> = {};
    if (status && status !== 'all') filter.status = status;
    if (categoryId) filter.categoryId = categoryId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const all = searchParams.get('all') === 'true';

    if (all) {
      const topics = await Topic.find(filter)
        .sort({ createdAt: -1 })
        .populate('categoryId', 'name slug')
        .lean();
      return NextResponse.json({ success: true, data: topics, total: topics.length });
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const total = await Topic.countDocuments(filter);
    const topics = await Topic.find(filter)
      .sort({ createdAt: -1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .populate('categoryId', 'name slug')
      .lean();

    return NextResponse.json({ success: true, data: topics, total, page, limit });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// POST /api/admin/topics — Create a new topic
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, categoryId, description, slug } = body;

    if (!title || !categoryId || !description) {
      return NextResponse.json(
        { success: false, message: 'Title, category, and description are required' },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const topic = await Topic.create({
      ...body,
      slug: finalSlug,
    });

    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A topic with this slug already exists in the category' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
