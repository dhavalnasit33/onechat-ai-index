import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import path from "path";
import crypto from "crypto";
import dbConnect from "@/src/lib/dbConnect";
import EmbedLog from "@/src/models/EmbedLog";

// Helper function to hash IP for privacy
function hashIP(ip: string): string {
  const salt = process.env.IP_SALT || "default_salt_123";
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex")
    .slice(0, 16);
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ chartId: string }> },
) {
  // Extract and clean the chartId from the route parameter
  const { chartId: rawChartId } = await props.params;
  const chartId = rawChartId.replace(/\.(png|webp)$/, "");

  // --- 1. Async Referrer Logging ---
  const referer =
    request.headers.get("referer") || request.headers.get("referrer") || "";
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  if (
    referer &&
    !referer.includes("onechatai.ai") &&
    !referer.includes("localhost")
  ) {
    // Fire-and-forget: we don't await this so it doesn't slow down the image load
    (async () => {
      try {
        await dbConnect();
        const domain = new URL(referer).hostname;
        await EmbedLog.create({
          chartId,
          refererUrl: referer,
          refererDomain: domain,
          userAgent,
          ipHash: hashIP(ip),
          servedAt: new Date(),
        });
      } catch (e) {
        console.error("Failed to log embed:", e);
      }
    })();
  }

  // --- 2. Serve the static chart image ---
  const actualFileName = chartId.startsWith("chart-")
    ? `${chartId}.png`
    : `chart-${chartId}.png`;

  const filePath = path.join(
    process.cwd(),
    "public",
    "chart-images",
    actualFileName,
  );

  try {
    // Check if file exists asynchronously
    await access(filePath);

    // Read the file asynchronously
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=2592000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    // --- 3. Fallback: Return a transparent 1x1 GIF if image not found ---
    console.error(`Chart image not found at: ${filePath}`);

    const fallback = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64",
    );

    return new NextResponse(fallback, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
