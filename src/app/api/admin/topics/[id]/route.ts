import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Topic from '@/src/models/Topic';
import Chart from '@/src/models/Chart';

// GET /api/admin/topics/[id] — Get single topic with its charts
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;

    const topic = await Topic.findById(id)
      .populate('categoryId', 'name slug')
      .lean();

    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Topic not found' },
        { status: 404 }
      );
    }

    const charts = await Chart.find({ topicId: id }).sort({ position: 1 }).lean();

    return NextResponse.json({ success: true, data: { ...topic, charts } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PUT /api/admin/topics/[id] — Update topic (iconUrl included via body spread)
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;
    const body = await request.json();

    // Set publishedAt when status flips to published
    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    // body may contain iconUrl — handled via spread in findByIdAndUpdate
    const topic = await Topic.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Topic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE /api/admin/topics/[id] — Delete topic and all its charts
export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;

    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Topic not found' },
        { status: 404 }
      );
    }

    await Chart.deleteMany({ topicId: id });

    return NextResponse.json({ success: true, data: topic });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}