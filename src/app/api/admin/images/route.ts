import { NextRequest, NextResponse } from "next/server";
import { access } from "fs/promises";
import path from "path";
import dbConnect from "@/src/lib/dbConnect";
import Chart from "@/src/models/Chart";
import { generateChartImage } from "@/src/lib/chartGenerator";

// GET /api/admin/images — Check status of all chart images
export async function GET() {
  try {
    await dbConnect();
    const charts = await Chart.find({ status: "active" })
      .select("chartId title chartType")
      .lean();

    const results = await Promise.all(
      charts.map(async (c) => {
        const fileName = `${c.chartId}.png`;
        const filePath = path.join(
          process.cwd(),
          "public",
          "chart-images",
          fileName,
        );
        let exists = false;
        try {
          await access(filePath);
          exists = true;
        } catch {}

        return {
          chartId: c.chartId,
          title: c.title,
          chartType: c.chartType,
          status: exists ? "completed" : "failed",
          queuedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: exists ? new Date().toISOString() : null,
        };
      }),
    );

    return NextResponse.json({ success: true, data: results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// POST /api/admin/images — Rebuild/Generate chart image with PUPPETEER
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { chartId } = await request.json();

    if (!chartId) {
      return NextResponse.json(
        { success: false, message: "chartId is required" },
        { status: 400 },
      );
    }

    const result = await generateChartImage(chartId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Puppeteer Error:", message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
