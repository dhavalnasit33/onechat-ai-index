import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Chart from '@/src/models/Chart';
import ChartHistory from '@/src/models/ChartHistory';
import { generateChartImage } from '@/src/lib/chartGenerator';

// GET /api/admin/charts/[chartId] — Get single chart by _id
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ chartId: string }> }
) {
  try {
    await dbConnect();
    const { chartId } = await props.params;

    const chart = await Chart.findById(chartId).lean();
    if (!chart) {
      return NextResponse.json(
        { success: false, message: 'Chart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: chart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/charts/[chartId] — Update chart and save history
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ chartId: string }> }
) {
  try {
    await dbConnect();
    const { chartId } = await props.params;
    const body = await request.json();

    const existingChart = await Chart.findById(chartId);
    if (!existingChart) {
      return NextResponse.json(
        { success: false, message: 'Chart not found' },
        { status: 404 }
      );
    }

    // Save current state to history before updating
    await ChartHistory.create({
      chartId: existingChart.chartId,
      data: existingChart.data,
      sourceLine: existingChart.sourceLine,
      changedBy: body.changedBy || 'admin',
      changeNote: body.changeNote || 'Updated via admin panel',
    });

    // Remove non-chart fields from the update
    const { changedBy, changeNote, ...updateData } = body;

    const updated = await Chart.findByIdAndUpdate(chartId, updateData, {
      new: true,
      runValidators: true,
    });

    if (updated) {
      // Automatically generate/regenerate the static chart image in the background
      generateChartImage(updated.chartId).catch((err: any) => {
        console.error('Failed to automatically regenerate chart image on update:', err);
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/charts/[chartId] — Soft-delete (set status to 'removed')
export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ chartId: string }> }
) {
  try {
    await dbConnect();
    const { chartId } = await props.params;

    const chart = await Chart.findByIdAndUpdate(
      chartId,
      { status: 'removed' },
      { new: true }
    );

    if (!chart) {
      return NextResponse.json(
        { success: false, message: 'Chart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: chart });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
