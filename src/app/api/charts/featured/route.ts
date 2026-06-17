// import { NextResponse } from 'next/server';
// import dbConnect from '@/src/lib/dbConnect';
// import Chart from '@/src/models/Chart';

// export async function GET() {
//   try {
//     await dbConnect();
    
//     // Fetch charts flagged for homepage display
//     const customHomeCharts = await Chart.find({
//       displayHome: true,
//       status: "active",
//     })
//       .populate({
//         path: "topicId",
//         populate: { path: "categoryId" },
//       })
//       .lean();

//     return NextResponse.json({ success: true, data: customHomeCharts });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Chart from '@/src/models/Chart';
import Category from '@/src/models/Category';
import Topic from '@/src/models/Topic';
import { EXCLUDED_DISPLAY_CHART_TYPES } from "@/src/types";

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Fetch all categories sorted by their assigned position
    const categories = await Category.find({}).sort({ position: 1 }).lean();
    
    let allFeaturedCharts: any[] = [];

    // 2. Loop through each category to get its 3 most recent charts
    for (const category of categories) {
      // Find all published topics belonging to this category
      const topics = await Topic.find({ 
        categoryId: category._id, 
        status: "published" 
      }).lean();
      
      const topicIds = topics.map(t => t._id);

      // Find the top 3 most recent active charts for these topics
      const recentCharts = await Chart.find({
        topicId: { $in: topicIds },
        status: "active",
        chartType: { $nin: EXCLUDED_DISPLAY_CHART_TYPES },
        // Optional: Exclude text/list blocks if you only want visual charts on the home page
        // chartType: { $nin: ["text_block", "list_block", "hero_stat"] } 
      })
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(3) // Limit to exactly 3 per category
        .populate({
          path: "topicId",
          populate: { path: "categoryId" },
        })
        .lean();

      // Add these 3 charts to our master array
      allFeaturedCharts = [...allFeaturedCharts, ...recentCharts];
    }

    // 3. Return the combined array (up to 18 charts total)
    return NextResponse.json({ success: true, data: allFeaturedCharts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}