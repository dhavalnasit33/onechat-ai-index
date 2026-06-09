import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Category from '@/src/models/Category';

// GET /api/admin/categories — List categories with pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    if (all) {
      const categories = await Category.find().sort({ createdAt: -1 }).lean(); // position: 1, 
      return NextResponse.json({ success: true, data: categories, total: categories.length });
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const total = await Category.countDocuments();
    const categories = await Category.find().sort({ createdAt: -1, _id: 1 }).skip(skip).limit(limit).lean(); // position: 1,

    return NextResponse.json({ success: true, data: categories, total, page, limit });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories — Create a new category
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, slug, description, position } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase().trim(),
      description: description || '',
      position: position ?? 0,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A category with this slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
