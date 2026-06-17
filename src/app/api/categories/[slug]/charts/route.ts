import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Topic from "@/src/models/Topic";
import Chart from "@/src/models/Chart";
import { EXCLUDED_DISPLAY_CHART_TYPES } from "@/src/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    const category = await Category.findOne({ slug }).lean();
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "most-cited";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 12;
    const skip = (page - 1) * limit;

    // Fetch topics in category
    const topicsRaw = await Topic.find({
      categoryId: category._id,
      status: "published",
    }).lean();
    const topicIds = topicsRaw.map((t) => t._id);

    // Build filter for charts
    const chartFilter: any = {
      topicId: { $in: topicIds },
      status: "active",
      // chartType: { $nin: ["text_block", "list_block", "hero_stat", "timeline"] },
      chartType: { $nin: EXCLUDED_DISPLAY_CHART_TYPES }
    };

    if (q) {
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matchingTopics = await Topic.find({
        categoryId: category._id,
        status: "published",
        $or: [
          { title: { $regex: escapedQ, $options: "i" } },
          { description: { $regex: escapedQ, $options: "i" } },
        ],
      }).lean();
      const matchingTopicIds = matchingTopics.map((t) => t._id);

      chartFilter.$or = [
        { title: { $regex: escapedQ, $options: "i" } },
        { heading: { $regex: escapedQ, $options: "i" } },
        { topicId: { $in: matchingTopicIds } },
      ];
    }

    // Sorting
    let sortObj: any = {};
    if (sort === "recent") {
      sortObj = { createdAt: -1 };
    } else if (sort === "a-z") {
      sortObj = { title: 1 };
    } else {
      sortObj = { position: 1 }; // default order
    }

    const totalCount = await Chart.countDocuments(chartFilter);
    const totalPages = Math.ceil(totalCount / limit);

    const charts = await Chart.find(chartFilter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("topicId")
      .lean();

    return NextResponse.json({
      success: true,
      data: charts,
      totalCount,
      totalPages,
      page,
      limit,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
