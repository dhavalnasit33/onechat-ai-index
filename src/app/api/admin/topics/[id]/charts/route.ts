import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Chart from '@/src/models/Chart';

// GET /api/admin/topics/[id]/charts — List charts for a topic
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;

    const charts = await Chart.find({ topicId: id })
      .sort({ position: 1 })
      .lean();

    return NextResponse.json({ success: true, data: charts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/topics/[id]/charts — Create a chart under a topic
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await props.params;
    const body = await request.json();

    const { title, chartType, chartId, position, data, sources, heading, icon, displayHome } = body;

    if (!title || !chartType || !chartId) {
      return NextResponse.json(
        { success: false, message: 'Title, chartType, and chartId are required' },
        { status: 400 }
      );
    }

    const chart = await Chart.create({
      topicId: id,
      chartId: chartId.toLowerCase().trim(),
      title,
      chartType,
      position: position ?? 0,
      data: data || {},
      sources: sources || [],
      heading: heading || '',
      icon: icon || '',
      displayHome: displayHome ?? false,
    });

    return NextResponse.json({ success: true, data: chart }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A chart with this chartId already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
