import dbConnect from "@/src/lib/dbConnect";
import Chart from "@/src/models/Chart";
import InteractiveChart from "@/src/components/InteractiveChart";

export default async function ChartRenderPage({
  params,
}: {
  params: { chartId: string };
}) {
  await dbConnect();

  // 1. Fetch the exact chart the bot wants to photograph
  const chart = await Chart.findOne({ chartId: params.chartId }).lean();

  if (!chart) {
    return <div>Chart not found</div>;
  }

  // 2. Render it at the exact dimensions Habib requested
  return (
    <div style={{ padding: "40px", fontFamily: "-apple-system, sans-serif" }}>
      <div style={{ width: "1120px", height: "720px", position: "relative" }}>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "24px",
            margin: "0 0 16px",
          }}
        >
          {chart.title}
        </h2>

        {/* Pass the exact props your component expects! */}
        <div
          style={{ height: "600px", width: "100%" }}
          className="chart-render-container"
        >
          <InteractiveChart
            chartId={chart.chartId}
            chartType={chart.chartType as any}
            data={chart.data}
          />
        </div>

        <p style={{ fontSize: "11px", color: "#666", marginTop: "8px" }}>
          {chart.sourceLine}
        </p>
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            fontSize: "11px",
            color: "#aaa",
          }}
        >
          OneChat AI
        </div>
      </div>
    </div>
  );
}
