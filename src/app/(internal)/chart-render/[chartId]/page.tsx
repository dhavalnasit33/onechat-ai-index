import dbConnect from "@/src/lib/dbConnect";
import Chart from "@/src/models/Chart";
import InteractiveChart from "@/src/components/InteractiveChart";

// 1. Define params as a Promise to fix the Next.js Sync Dynamic API error
export default async function ChartRenderPage({
  params,
}: {
  params: Promise<{ chartId: string }>;
}) {
  await dbConnect();

  // 2. Await the params before using them
  const resolvedParams = await params;
  const chart = await Chart.findOne({ chartId: resolvedParams.chartId }).lean();

  if (!chart) {
    return <div>Chart not found</div>;
  }

  const cleanSource = (chart.sourceLine || "")
    .replace(/OneChat AI/g, "AI Behavior Index");
  const displaySource = cleanSource
    ? cleanSource.toLowerCase().startsWith("source:")
      ? cleanSource
      : `Source: ${cleanSource}`
    : "Compiled by AI Behavior Index";

  // 3. Use a fixed full-screen overlay with explicit text color to avoid dark-mode color inheritance bugs
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        zIndex: 99999 /* Ensures it sits on top of everything */,
        padding: "40px",
        fontFamily: "-apple-system, sans-serif",
        boxSizing: "border-box",
        color: "#1a1a1a",
      }}
    >
      <div
        style={{
          width: "1120px",
          height: "720px",
          position: "relative",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "24px",
            margin: "0 0 16px",
            color: "#1a1a1a",
          }}
        >
          {chart.title}
        </h2>

        <div
          style={{ height: "600px", width: "100%" }}
          className="chart-render-container"
        >
          <InteractiveChart
            chartId={chart.chartId}
            chartType={chart.chartType as any}
            data={chart.data}
            title={chart.title}
          />
        </div>

        <p 
          style={{ fontSize: "12px", color: "#555555", marginTop: "8px" }}
          className="source-line-link"
          dangerouslySetInnerHTML={{ __html: displaySource }}
        />

      </div>
    </div>
  );
}
