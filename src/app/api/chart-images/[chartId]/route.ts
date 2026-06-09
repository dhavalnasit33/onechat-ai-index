import { NextRequest, NextResponse } from 'next/server';
import { access, mkdir, writeFile } from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import dbConnect from '@/src/lib/dbConnect';
import Chart from '@/src/models/Chart';

// GET /api/admin/images — Check status of all chart images
export async function GET() {
  try {
    await dbConnect();
    const charts = await Chart.find({ status: 'active' }).select('chartId title chartType').lean();
    
    const results = await Promise.all(
      charts.map(async (c) => {
        // Enforce the "chart-" prefix if you haven't renamed your physical files yet
        const fileName = c.chartId.startsWith('chart-') ? `${c.chartId}.png` : `chart-${c.chartId}.png`;
        const filePath = path.join(process.cwd(), 'public', 'chart-images', fileName);
        let exists = false;
        try {
          await access(filePath);
          exists = true;
        } catch {}
        
        return {
          chartId: c.chartId,
          title: c.title,
          chartType: c.chartType,
          status: exists ? 'completed' : 'failed',
          queuedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: exists ? new Date().toISOString() : null,
        };
      })
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
      return NextResponse.json({ success: false, message: 'chartId is required' }, { status: 400 });
    }
    
    // Check if the chart actually exists
    const chart = await Chart.findOne({ chartId, status: 'active' });
    if (!chart) {
      return NextResponse.json({ success: false, message: 'Chart not found' }, { status: 404 });
    }
    
    const dirPath = path.join(process.cwd(), 'public', 'chart-images');
    
    // Ensure dir exists
    await mkdir(dirPath, { recursive: true });

    // 1. Setup the target URL for the bot to visit
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // NOTE: This assumes you created the hidden page at src/app/(internal)/chart-render/[chartId]/page.tsx
    const targetUrl = `${baseUrl}/ai-behavior-index/chart-render/${chartId}`; 

    // 2. Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // 3. Set the 1200x800 Retina size the client requested!
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
    
    // 4. Visit the hidden page
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    
    // Wait an extra 500ms to let Chart.js finish its rendering animations
    await page.waitForSelector('.chart-render-container');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 5. Take the screenshot
    const element = await page.$('.chart-render-container');
    if (!element) throw new Error('Chart container not found on render page');
    
    const buffer = await element.screenshot({ type: 'png', omitBackground: false });
    await browser.close();

    // 6. Optimize the image with Sharp to keep file sizes small for SEO
    const optimizedBuffer = await sharp(buffer)
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer();

    // 7. Save it exactly where your dummy pixel used to go
    const fileName = chartId.startsWith('chart-') ? `${chartId}.png` : `chart-${chartId}.png`;
    const filePath = path.join(dirPath, fileName);
    await writeFile(filePath, optimizedBuffer);
    
    // 8. Update database as requested in the build guide
    await Chart.updateOne(
      { chartId },
      { $set: { imageUrl: `/chart-images/${fileName}`, imageUpdatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true, message: `High-res image for ${chartId} generated successfully` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Puppeteer Error:", message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}