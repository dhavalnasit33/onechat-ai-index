import { access, mkdir, writeFile } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import sharp from "sharp";
import dbConnect from "./dbConnect";
import Chart from "../models/Chart";

export async function generateChartImage(chartId: string): Promise<{ success: boolean; message: string }> {
  await dbConnect();

  // Check if the chart actually exists
  const chart = await Chart.findOne({ chartId, status: "active" });
  if (!chart) {
    throw new Error("Chart not found");
  }

  const dirPath = path.join(process.cwd(), "public", "chart-images");

  // Ensure dir exists
  await mkdir(dirPath, { recursive: true });

  // 1. Setup the target URL for the bot to visit
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const targetUrl = `${baseUrl}/ai-behavior-index/chart-render/${chartId}`;

  // 2. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    // 3. Set the 1200x800 Retina size
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });

    // 4. Visit the hidden page
    await page.goto(targetUrl, { waitUntil: "networkidle0" });

    // Wait an extra 500ms to let Chart.js finish its rendering animations
    await page.waitForSelector(".chart-render-container");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 5. Take the screenshot
    const element = await page.$(".chart-render-container");
    if (!element) throw new Error("Chart container not found on render page");

    const buffer = await element.screenshot({
      type: "png",
      omitBackground: false,
    });
    await browser.close();

    // 6. Optimize the image with Sharp to keep file sizes small for SEO
    const optimizedBuffer = await sharp(buffer)
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer();

    // 7. Save the optimized image
    const fileName = `${chartId}.png`;
    const filePath = path.join(dirPath, fileName);
    await writeFile(filePath, optimizedBuffer);

    // 8. Update database
    await Chart.updateOne(
      { chartId },
      {
        $set: {
          imageUrl: `/chart-images/${fileName}`,
          imageUpdatedAt: new Date(),
        },
      },
    );

    return {
      success: true,
      message: `High-res image for ${chartId} generated successfully`,
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
}
