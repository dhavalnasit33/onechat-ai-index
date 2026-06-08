import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Topic from '@/src/models/Topic';
import Chart from '@/src/models/Chart';

// GET /api/admin/topics/[id] — Get single topic
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

    // Also fetch charts for this topic
    const charts = await Chart.find({ topicId: id })
      .sort({ position: 1 })
      .lean();

    return NextResponse.json({ success: true, data: { ...topic, charts } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/topics/[id] — Update topic
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;
    const body = await request.json();

    // If changing status to published, set publishedAt
    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date();
    }

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
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/topics/[id] — Delete topic and its charts
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

    // Also delete all charts associated with this topic
    await Chart.deleteMany({ topicId: id });

    return NextResponse.json({ success: true, data: topic });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
