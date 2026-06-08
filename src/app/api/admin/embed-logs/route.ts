import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import EmbedLog from '@/src/models/EmbedLog';

// GET /api/admin/embed-logs — Aggregated backlink analytics
export async function GET() {
  try {
    await dbConnect();

    // Top referring domains
    const topDomains = await EmbedLog.aggregate([
      { $match: { refererDomain: { $nin: [null, ''] } } },
      {
        $group: {
          _id: '$refererDomain',
          count: { $sum: 1 },
          lastSeen: { $max: '$servedAt' },
          charts: { $addToSet: '$chartId' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $project: {
          domain: '$_id',
          count: 1,
          lastSeen: 1,
          uniqueCharts: { $size: '$charts' },
          _id: 0,
        },
      },
    ]);

    // Summary stats
    const totalEmbeds = await EmbedLog.countDocuments();
    const uniqueDomains = await EmbedLog.distinct('refererDomain').then(
      (d) => d.filter(Boolean).length
    );

    // Embeds in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const embedsToday = await EmbedLog.countDocuments({
      servedAt: { $gte: oneDayAgo },
    });

    return NextResponse.json({
      success: true,
      data: {
        topDomains,
        totalEmbeds,
        uniqueDomains,
        embedsToday,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
