"use client";

import { useState, useEffect, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  PlusCircle,
} from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";
import InteractiveChart from "@/src/components/InteractiveChart";
import IconUploadField from "@/src/components/admin/IconUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import { DataRow, SourceRow, LineSeries } from "@/src/types";
import { Input } from "@/src/components/admin/ui/Input";
import { Textarea } from "@/src/components/admin/ui/Textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/admin/ui/Select";
import { Switch } from "@/src/components/admin/ui/Switch";
import { toast } from "@/src/hooks/use-toast";
import { Card } from "@/src/components/admin/ui/Card";
import { DatePicker } from "@/src/components/admin/ui/DatePicker";

export const CHART_TYPES = [
  { value: "vbar", label: "Vertical Bar" },
  { value: "hbar", label: "Horizontal Bar" },
  { value: "line", label: "Line" },
  { value: "donut", label: "Donut" },
  { value: "hero_stat", label: "Hero Stat" },
  { value: "timeline", label: "Timeline Milestones" },
  { value: "text_block", label: "Callout Text Block" },
  { value: "list_block", label: "List Block (Pros/Cons/Trends)" },
];

// Parse existing chart.data into our row format
function parseDataRows(chartType: string, data: unknown): DataRow[] {
  if (!data) return [{ label: "", value: "", color: "" }];

  const typedData = data as Record<string, unknown>;

  if (chartType === "hero_stat") {
    return [
      {
        label: String(typedData.label || ""),
        value: String(typedData.value || ""),
        color: "",
      },
    ];
  }

  if (chartType === "text_block") {
    if (typedData.quotes && Array.isArray(typedData.quotes)) {
      return (typedData.quotes as Record<string, unknown>[]).map((q) => ({
        label: String(q.author || ""),
        value: String(q.text || ""),
        color: String(typedData.color || ""),
        eventColor: String(typedData.borderColor || ""),
      }));
    }
    return [
      {
        label: String(typedData.author || ""),
        value: String(typedData.text || ""),
        color: String(typedData.color || ""),
        eventColor: String(typedData.borderColor || ""),
      },
    ];
  }

  if (chartType === "list_block") {
    if (typedData.items && Array.isArray(typedData.items)) {
      return (typedData.items as Record<string, unknown>[]).map((item) => ({
        label: String(item.boldText || ""), // Used for Bold Text
        value: String(item.text || ""),     // Used for Regular Text
        color: String(typedData.color || ""),
        eventColor: String(typedData.borderColor || ""),
      }));
    }
    return [
      {
        label: "",
        value: "",
        color: String(typedData.color || ""),
        eventColor: String(typedData.borderColor || ""),
      },
    ];
  }

  if (
    chartType === "timeline" &&
    typedData.events &&
    Array.isArray(typedData.events)
  ) {
    return (typedData.events as Record<string, unknown>[]).map((e) => ({
      label: String(e.date || ""),
      value: String(e.title || ""),
      color: String(e.description || ""),
      eventColor: String(e.color || ""),
      source: String(e.source || ""),
    }));
  }

  // Fallback check for standard data array
  if (typedData.data && Array.isArray(typedData.data)) {
    return (typedData.data as Record<string, unknown>[]).map((d) => ({
      label: String(d.label || ""),
      value: String(d.value ?? ""),
      color: String(d.color || ""),
    }));
  }

  // For bar/line/donut: data.labels[] + data.datasets[0].data[] + optional colors
  if (typedData.labels && Array.isArray(typedData.labels)) {
    const datasets = typedData.datasets as
      | Record<string, unknown>[]
      | undefined;
    const values = (datasets?.[0]?.data as unknown[]) || [];
    const colors = (datasets?.[0]?.backgroundColor as unknown) || [];
    return (typedData.labels as string[]).map((label, i) => ({
      label,
      value: String(values[i] ?? ""),
      color: Array.isArray(colors)
        ? String(colors[i] || "")
        : String(colors || ""),
    }));
  }

  return [{ label: "", value: "", color: "" }];
}

function buildChartDataPayload(
  chartType: string,
  rows: DataRow[],
  lineSeries: LineSeries[],
  xLabel: string,
  yLabel: string,
  yFormat: string,
  trendDirection: string,
  trendAmount: string,
  yMax: string,
  ySuffix: string,
  yPrefix: string,
  isGrouped: boolean,
  heroPrefix: string = "",
  heroSuffix: string = "",
  heroSuffixSize: "small" | "large" = "large",
  tooltipTitleTemplate: string = "",
  tooltipValueSuffix: string = "",
  xMax: string = "",
  stacked: boolean = false,
): unknown {
  if (chartType === "hero_stat") {
    return {
      type: "hero_stat",
      value: rows[0]?.value || "",
      label: rows[0]?.label || "",
      prefix: heroPrefix || undefined,
      suffix: heroSuffix || undefined,
      suffixSize: heroSuffixSize || undefined,
      ...(trendDirection || trendAmount
        ? {
            trend: {
              direction: trendDirection || undefined,
              amount: trendAmount || undefined,
            },
          }
        : {}),
    };
  }

  // Handle Timeline array payloads
  if (chartType === "timeline") {
    return {
      type: "timeline",
      events: rows.map((r) => ({
        date: r.label,
        title: r.value,
        description: r.color,
        color: r.eventColor || "",
        source: r.source || "",
      })),
    };
  }


  // Handle callout insight quote payloads
  if (chartType === "text_block") {
    return {
      type: "text_block",
      color: rows[0]?.color || "",
      borderColor: rows[0]?.eventColor || "",
      quotes: rows.map((r) => ({
        text: r.value || "",
        author: r.label || "",
      })),
    };
  }

  if (chartType === "list_block") {
    return {
      type: "list_block",
      color: rows[0]?.color || "",
      borderColor: rows[0]?.eventColor || "",
      items: rows
        .map((r) => ({ boldText: r.label || "", text: r.value || "" }))
        .filter((i) => i.boldText.trim() !== "" || i.text.trim() !== ""), // Keep if either has text
    };
  }

  // Grouped Series handler for Multi-Bar and Trend Lines automatically
  if (
    chartType === "line" ||
    ((chartType === "vbar" || chartType === "hbar") && isGrouped)
  ) {
    const labels = Array.from(
      new Set(lineSeries.flatMap((s) => s.dataPoints.map((dp) => dp.x))),
    ).filter(Boolean);
    return {
      type: chartType,
      xLabel: xLabel || undefined,
      yLabel: yLabel || undefined,
      yFormat: yFormat || "raw",
      yMax: yMax !== "" ? (yMax === "auto" ? "auto" : Number(yMax)) : undefined,
      ySuffix: ySuffix || undefined,
      yPrefix: yPrefix || undefined,
      tooltipTitleTemplate: tooltipTitleTemplate || undefined,
      tooltipValueSuffix: tooltipValueSuffix || undefined,
      xMax: xMax || undefined,
      stacked: stacked || undefined,
      labels: labels.length > 0 ? labels : undefined,
      series: lineSeries.map((s) => ({
        name: s.name,
        color: s.color || undefined,
        data:
          chartType === "line"
            ? s.dataPoints.map((dp) => ({ x: dp.x, y: Number(dp.y) || 0 }))
            : labels.map((l) => {
                const match = s.dataPoints.find((dp) => dp.x === l);
                return { x: l, y: match ? Number(match.y) || 0 : 0 };
              }),
      })),
    };
  }

  // Flat individual items (vbar, hbar, donut) fallback
  return {
    type: chartType,
    xLabel: xLabel || undefined,
    yLabel: yLabel || undefined,
    yFormat: yFormat || "raw",
    yMax: yMax !== "" ? (yMax === "auto" ? "auto" : Number(yMax)) : undefined,
    ySuffix: ySuffix || undefined,
    yPrefix: yPrefix || undefined,
    tooltipTitleTemplate: tooltipTitleTemplate || undefined,
    tooltipValueSuffix: tooltipValueSuffix || undefined,
    xMax: xMax || undefined,
    stacked: stacked || undefined,
    data: rows.map((r) => ({
      label: r.label,
      value: Number(r.value) || 0,
      color: r.color || undefined,
    })),
  };
}

export default function ChartEditorPage({
  params,
}: {
  params: Promise<{ id: string; chartId: string }>;
}) {
  const { id: topicId, chartId } = use(params);
  const router = useRouter();
  const isNew = chartId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [chartIdSlug, setChartIdSlug] = useState("");
  const [chartType, setChartType] = useState<string>("vbar");
  const [position, setPosition] = useState<number | "">(0);
  const [sourceLine, setSourceLine] = useState("");
  const [dataRows, setDataRows] = useState<DataRow[]>([
    { label: "", value: "", color: "" },
  ]);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [heading, setHeading] = useState("");
  const [icon, setIcon] = useState("");
  const [displayHome, setDisplayHome] = useState(false);

  // Metadata/Extra Fields
  const [xLabel, setXLabel] = useState("");
  const [yLabel, setYLabel] = useState("");
  const [yFormat, setYFormat] = useState("");
  const [yMax, setYMax] = useState("");
  const [xMax, setXMax] = useState("");
  const [ySuffix, setYSuffix] = useState("");
  const [yPrefix, setYPrefix] = useState("");
  const [tooltipTitleTemplate, setTooltipTitleTemplate] = useState("");
  const [tooltipValueSuffix, setTooltipValueSuffix] = useState("");
  const [stacked, setStacked] = useState(false);
  const [isGrouped, setIsGrouped] = useState(false);
  const [trendDirection, setTrendDirection] = useState<"up" | "down" | "">("");
  const [trendAmount, setTrendAmount] = useState("");
  const [heroPrefix, setHeroPrefix] = useState("");
  const [heroSuffix, setHeroSuffix] = useState("");
  const [heroSuffixSize, setHeroSuffixSize] = useState<"small" | "large">(
    "large",
  );

  // Line Series builder state
  const [lineSeries, setLineSeries] = useState<LineSeries[]>([
    { name: "Series 1", color: "#088DFF", dataPoints: [{ x: "", y: "" }] },
  ]);

  // Preview data state
  const [previewData, setPreviewData] = useState<unknown | null>(null);

  // Collapse states for lists
  const [collapsedRows, setCollapsedRows] = useState<Record<number, boolean>>(
    {},
  );
  const [collapsedSeries, setCollapsedSeries] = useState<
    Record<number, boolean>
  >({});
  const [collapsedSources, setCollapsedSources] = useState<
    Record<number, boolean>
  >({});

  // Drag states
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [draggedSeriesIndex, setDraggedSeriesIndex] = useState<number | null>(
    null,
  );
  const [draggedSourceIndex, setDraggedSourceIndex] = useState<number | null>(
    null,
  );

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    toast({
      title: message,
      variant: type === "error" ? "destructive" : "default",
    });
  };

  // Fetch topic (to get slug and chart count for new chart ID) and chart data
  useEffect(() => {
    const loadData = async () => {
      try {
        const topicUrl = apiUrl(`/api/admin/topics/${topicId}`);
        const topicRes = await fetch(topicUrl).then((r) => r.json());

        let tSlug = "";
        let nextIndex = 0;
        if (topicRes.success) {
          tSlug = topicRes.data.slug;
          nextIndex = topicRes.data.charts
            ? topicRes.data.charts.filter((c: any) => c.status !== "removed")
                .length
            : 0;
        }

        if (isNew) {
          setChartIdSlug(`${tSlug}-c${nextIndex}`);
          setLoading(false);
          return;
        }

        const chartUrl = apiUrl(`/api/admin/charts/${chartId}`);
        const chartRes = await fetch(chartUrl).then((r) => r.json());
        if (chartRes.success) {
          const c = chartRes.data;
          setTitle(c.title);
          setChartIdSlug(c.chartId);
          setChartType(c.chartType);
          setPosition(c.position);
          setSourceLine(c.sourceLine || "");
          setHeading(c.heading || "");
          setIcon(c.icon || "");
          setDisplayHome(c.displayHome || false);
          setSources(
            (c.sources as Record<string, unknown>[] | undefined)?.map(
              (s, i) => ({
                position: Number(s.position ?? i),
                sourceName: String(s.sourceName || ""),
                sourceUrl: String(s.sourceUrl || ""),
                publication: String(s.publication || ""),
                publicationDate: s.publicationDate
                  ? new Date(String(s.publicationDate))
                      .toISOString()
                      .split("T")[0]
                  : "",
              }),
            ) || [],
          );

          if (c.data) {
            setXLabel(c.data.xLabel || "");
            setYLabel(c.data.yLabel || "");
            setYFormat(c.data.yFormat || "");
            setYMax(c.data.yMax !== undefined ? String(c.data.yMax) : "");
            setXMax(c.data.xMax !== undefined ? String(c.data.xMax) : "");
            setYSuffix(c.data.ySuffix || "");
            setYPrefix(c.data.yPrefix || "");
            setTooltipTitleTemplate(c.data.tooltipTitleTemplate || "");
            setTooltipValueSuffix(c.data.tooltipValueSuffix || "");
            setStacked(!!c.data.stacked);
            setIsGrouped(!!c.data.series);

            if (c.chartType === "hero_stat") {
              setDataRows([
                {
                  label: c.data.label || "",
                  value: String(c.data.value || ""),
                  color: "",
                },
              ]);
              setHeroPrefix(c.data.prefix || "");
              setHeroSuffix(c.data.suffix || "");
              setHeroSuffixSize(c.data.suffixSize || "large");
              if (c.data.trend) {
                setTrendDirection(
                  (c.data.trend.direction || "") as "up" | "down" | "",
                );
                setTrendAmount(c.data.trend.amount || "");
              }
            } else if (
              c.chartType === "line" ||
              ((c.chartType === "vbar" || c.chartType === "hbar") &&
                c.data.series)
            ) {
              if (c.data.series && Array.isArray(c.data.series)) {
                setLineSeries(
                  (c.data.series as Record<string, unknown>[]).map((s) => ({
                    name: String(s.name || ""),
                    color: String(s.color || ""),
                    dataPoints: Array.isArray(s.data)
                      ? (s.data as Record<string, unknown>[]).map((dp) => ({
                          x: String(dp.x || ""),
                          y: String(dp.y ?? ""),
                        }))
                      : [{ x: "", y: "" }],
                  })),
                );
              }
            } else {
              // bar, donut
              if (c.data.data && Array.isArray(c.data.data)) {
                setDataRows(
                  (c.data.data as Record<string, unknown>[]).map((d) => ({
                    label: String(d.label || ""),
                    value: String(d.value ?? ""),
                    color: String(d.color || ""),
                  })),
                );
              } else {
                setDataRows(parseDataRows(c.chartType, c.data));
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load chart editor data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [chartId, topicId, isNew]);

  // Data row management
  const addDataRow = () =>
    setDataRows([...dataRows, { label: "", value: "", color: "" }]);
  const removeDataRow = (i: number) =>
    setDataRows(dataRows.filter((_, idx) => idx !== i));
  const updateDataRow = (i: number, field: keyof DataRow, val: string) => {
    const updated = [...dataRows];
    updated[i] = { ...updated[i], [field]: val };
    setDataRows(updated);
  };

  // Line series management
  const addLineSeries = () =>
    setLineSeries([
      ...lineSeries,
      {
        name: `Series ${lineSeries.length + 1}`,
        color: "#088DFF",
        dataPoints: [{ x: "", y: "" }],
      },
    ]);
  const removeLineSeries = (i: number) =>
    setLineSeries(lineSeries.filter((_, idx) => idx !== i));
  const updateLineSeriesInfo = (
    i: number,
    field: "name" | "color",
    val: string,
  ) => {
    const updated = [...lineSeries];
    updated[i] = { ...updated[i], [field]: val };
    setLineSeries(updated);
  };

  // Line series data points management
  const addDataPoint = (seriesIdx: number) => {
    const updated = [...lineSeries];
    updated[seriesIdx].dataPoints.push({ x: "", y: "" });
    setLineSeries(updated);
  };
  const removeDataPoint = (seriesIdx: number, ptIdx: number) => {
    const updated = [...lineSeries];
    updated[seriesIdx].dataPoints = updated[seriesIdx].dataPoints.filter(
      (_, idx) => idx !== ptIdx,
    );
    setLineSeries(updated);
  };
  const updateDataPoint = (
    seriesIdx: number,
    ptIdx: number,
    field: "x" | "y",
    val: string,
  ) => {
    const updated = [...lineSeries];
    updated[seriesIdx].dataPoints[ptIdx] = {
      ...updated[seriesIdx].dataPoints[ptIdx],
      [field]: val,
    };
    setLineSeries(updated);
  };

  // Source row management
  const addSource = () =>
    setSources([
      ...sources,
      {
        position: sources.length,
        sourceName: "",
        sourceUrl: "",
        publication: "",
        publicationDate: "",
      },
    ]);
  const removeSource = (i: number) =>
    setSources(sources.filter((_, idx) => idx !== i));
  const updateSource = (i: number, field: keyof SourceRow, val: string) => {
    const updated = [...sources];
    updated[i] = {
      ...updated[i],
      [field]: field === "position" ? Number(val) : val,
    } as SourceRow;
    setSources(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !chartType) {
      showToast("Title and chart type are required", "error");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      chartId: chartIdSlug,
      chartType,
      position: position === "" ? 0 : Number(position),
      sourceLine,
      heading,
      icon,
      displayHome,
      data: buildChartDataPayload(
        chartType,
        dataRows,
        lineSeries,
        xLabel,
        yLabel,
        yFormat,
        trendDirection,
        trendAmount,
        yMax,
        ySuffix,
        yPrefix,
        isGrouped,
        heroPrefix,
        heroSuffix,
        heroSuffixSize,
        tooltipTitleTemplate,
        tooltipValueSuffix,
        xMax,
        stacked,
      ),
      sources: sources.map((s) => ({
        ...s,
        publicationDate: s.publicationDate || undefined,
      })),
    };

    try {
      const url = isNew
        ? apiUrl(`/api/admin/topics/${topicId}/charts`)
        : apiUrl(`/api/admin/charts/${chartId}`);
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(isNew ? "Chart created!" : "Chart saved!");
        if (isNew) {
          router.push(`/admin/topics/${topicId}`);
        }
      } else {
        showToast(json.message || "Failed to save", "error");
      }
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-card">
        <div
          className="admin-skeleton"
          style={{ width: "100%", height: 400 }}
        />
      </div>
    );
  }

  const showColors =
    chartType === "donut" || chartType === "vbar" || chartType === "hbar";
  const isHeroStat = chartType === "hero_stat";

  return (
    <>
      <div className="admin-breadcrumbs">
        <Link href="/admin/topics">Topics</Link>
        <span className="sep">/</span>
        <Link href={`/admin/topics/${topicId}`}>Topic</Link>
        <span className="sep">/</span>
        <span>{isNew ? "New Chart" : title}</span>
      </div>

      <div
        className="admin-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1>{isNew ? "Create Chart" : `Edit: ${title}`}</h1>
          <p>Form-driven data editor — no JSON required</p>
        </div>
        <Link
          href={`/admin/topics/${topicId}`}
          className="admin-btn admin-btn-secondary"
        >
          <ArrowLeft size={16} /> Back to Topic
        </Link>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          {/* Chart Metadata */}
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Chart Metadata</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Title *</label>
                <Input
                  placeholder="e.g. AI Investment by Sector"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Chart ID</label>
                <Input
                  value={chartIdSlug}
                  readOnly
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }}
                />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Chart Type *</label>
                <Select
                  value={chartType}
                  onValueChange={(val: string) => setChartType(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CHART_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Position</label>
                <Input
                  type="number"
                  value={position}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPosition(val === "" ? "" : Number(val));
                  }}
                />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Heading / Card Title Override
                </label>
                <Input
                  placeholder="e.g. Weekly adoption cohort"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Source Line</label>
                <RichTextEditor
                  value={sourceLine}
                  onChange={setSourceLine}
                  placeholder="e.g. Source: World Economic Forum, 2024"
                />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 20 }}>
              <Card className="flex items-center justify-between p-4 bg-[var(--admin-surface-2)]">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <div className="text-sm font-semibold text-[var(--admin-text)]">
                    Display on Dashboard
                  </div>
                  <div className="text-xs text-[var(--admin-text-muted)] font-normal">
                    Show this chart on the home page admin dashboard
                  </div>
                </div>
                <Switch
                  checked={displayHome}
                  onCheckedChange={(checked: boolean) =>
                    setDisplayHome(checked)
                  }
                />
              </Card>
            </div>

            <IconUploadField
              value={icon}
              onChange={setIcon}
              folder="onechatai-index-chart-icons"
              label="Chart Icon (Emoji or Uploaded Image)"
              disabled={saving}
            />
          </div>

          {/* Data Editor */}
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">
              {isHeroStat ? "Hero Stat Value" : "Chart Data"}
            </h3>
            {/* Axis Configuration (Only for Bar and Line charts) */}
            {(chartType === "vbar" ||
              chartType === "hbar" ||
              chartType === "line" ||
              chartType === "donut") && (
              <>
                {chartType !== "donut" && (
                  <div className="admin-form-row" style={{ marginBottom: 20 }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">X-Axis Label</label>
                      <Input
                        placeholder="e.g. Year or Country"
                        value={xLabel}
                        onChange={(e) => setXLabel(e.target.value)}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">X-Axis Max Value</label>
                      <Input
                        placeholder="e.g. 10 (blank for no limit)"
                        value={xMax}
                        onChange={(e) => setXMax(e.target.value)}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Y-Axis Label</label>
                      <Input
                        placeholder="e.g. Percentage"
                        value={yLabel}
                        onChange={(e) => setYLabel(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="admin-form-row" style={{ marginBottom: 20 }}>
                  {chartType !== "donut" && (
                    <>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Y-Axis Format</label>
                        <Select
                          value={yFormat || "raw"}
                          onValueChange={(val: string) =>
                            setYFormat(val === "raw" ? "" : val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Number (Raw)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="raw">Number (Raw)</SelectItem>
                            <SelectItem value="percentage">
                              Percentage (%)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Custom Max Value</label>
                        <Input
                          placeholder="e.g. 100, 120, 5.0 (blank for auto)"
                          value={yMax}
                          onChange={(e) => setYMax(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Custom Prefix</label>
                    <Input
                      placeholder="e.g. $"
                      value={yPrefix}
                      onChange={(e) => setYPrefix(e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Custom Suffix</label>
                    <Input
                      placeholder="e.g. %, M, B, months"
                      value={ySuffix}
                      onChange={(e) => setYSuffix(e.target.value)}
                    />
                  </div>
                </div>

                {chartType !== "donut" && (
                  <div className="admin-form-row" style={{ marginBottom: 20 }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Tooltip Title Template</label>
                      <Input
                        placeholder="e.g. Year {x} since launch (blank for default)"
                        value={tooltipTitleTemplate}
                        onChange={(e) => setTooltipTitleTemplate(e.target.value)}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Tooltip Value Suffix</label>
                      <Input
                        placeholder="e.g. US adoption (blank for default)"
                        value={tooltipValueSuffix}
                        onChange={(e) => setTooltipValueSuffix(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {(chartType === "vbar" || chartType === "hbar") && (
                  <div
                    className="admin-form-group"
                    style={{ marginBottom: 20 }}
                  >
                    <Card className="flex items-center justify-between p-4 bg-[var(--admin-surface-2)]">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <div className="text-sm font-semibold text-[var(--admin-text)]">
                          Grouped Chart (Multi-Series)
                        </div>
                        <div className="text-xs text-[var(--admin-text-muted)] font-normal font-sans">
                          Enable side-by-side bar comparisons using multiple
                          series (e.g. 2023 vs 2025)
                        </div>
                      </div>
                      <Switch
                        checked={isGrouped}
                        onCheckedChange={(checked: boolean) =>
                          setIsGrouped(checked)
                        }
                      />
                    </Card>
                  </div>
                )}

                {(chartType === "vbar" || chartType === "hbar") && isGrouped && (
                  <div
                    className="admin-form-group"
                    style={{ marginBottom: 20 }}
                  >
                    <Card className="flex items-center justify-between p-4 bg-[var(--admin-surface-2)]">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <div className="text-sm font-semibold text-[var(--admin-text)]">
                          Stacked Chart
                        </div>
                        <div className="text-xs text-[var(--admin-text-muted)] font-normal font-sans">
                          Stack bars on top of each other instead of showing them side-by-side
                        </div>
                      </div>
                      <Switch
                        checked={stacked}
                        onCheckedChange={(checked: boolean) =>
                          setStacked(checked)
                        }
                      />
                    </Card>
                  </div>
                )}
              </>
            )}

            {isHeroStat ? (
              <div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Label</label>
                    <Input
                      placeholder="e.g. Total Investment"
                      value={dataRows[0]?.label || ""}
                      onChange={(e) =>
                        updateDataRow(0, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Value</label>
                    <Input
                      placeholder="e.g. 73"
                      value={dataRows[0]?.value || ""}
                      onChange={(e) =>
                        updateDataRow(0, "value", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="admin-form-row" style={{ marginTop: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Prefix (Optional)
                    </label>
                    <Input
                      placeholder="e.g. $"
                      value={heroPrefix}
                      onChange={(e) => setHeroPrefix(e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Suffix (Optional)
                    </label>
                    <Input
                      placeholder="e.g. % or months"
                      value={heroSuffix}
                      onChange={(e) => setHeroSuffix(e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Suffix Size</label>
                    <Select
                      value={heroSuffixSize}
                      onValueChange={(val: "small" | "large") =>
                        setHeroSuffixSize(val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Large" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="large">
                          Large (same as number)
                        </SelectItem>
                        <SelectItem value="small">
                          Small (smaller font)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="admin-form-row" style={{ marginTop: 12 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Trend Direction</label>
                    <Select
                      value={trendDirection || "none"}
                      onValueChange={(val: string) =>
                        setTrendDirection(
                          val === "none" ? "" : (val as "up" | "down"),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No Trend" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Trend</SelectItem>
                        <SelectItem value="up">Up (↑)</SelectItem>
                        <SelectItem value="down">Down (↓)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Trend Amount / Label
                    </label>
                    <Input
                      placeholder="e.g. +32pp since 2022"
                      value={trendAmount}
                      onChange={(e) => setTrendAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : chartType === "timeline" ? (
              /* Timeline Events Editor */
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                    Timeline Events
                  </h4>
                  <button
                    type="button"
                    className="admin-add-row-btn"
                    onClick={addDataRow}
                    style={{
                      width: "auto",
                      display: "inline-flex",
                      padding: "6px 12px",
                    }}
                  >
                    <PlusCircle size={14} /> Add Event
                  </button>
                </div>

                {dataRows.map((row, i) => {
                  const isCollapsed = !!collapsedRows[i];
                  return (
                    <div
                      key={i}
                      className="admin-drag-card"
                      draggable
                      onDragStart={(e) => {
                        setDraggedRowIndex(i);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedRowIndex === null || draggedRowIndex === i)
                          return;
                        const updated = [...dataRows];
                        const [draggedItem] = updated.splice(
                          draggedRowIndex,
                          1,
                        );
                        updated.splice(i, 0, draggedItem);
                        setDataRows(updated);
                        setDraggedRowIndex(null);
                      }}
                    >
                      <div className="admin-drag-card-header">
                        <div className="admin-drag-card-title">
                          <GripVertical
                            size={16}
                            style={{
                              cursor: "grab",
                              color: "var(--admin-text-dim)",
                            }}
                          />
                          <span>
                            {row.label || row.value || `Event #${i + 1}`}
                          </span>
                        </div>
                        <div className="admin-drag-card-actions">
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() => removeDataRow(i)}
                            style={{
                              color: "var(--admin-danger)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              borderRadius: "50%",
                              padding: 5,
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() =>
                              setCollapsedRows((prev) => ({
                                ...prev,
                                [i]: !prev[i],
                              }))
                            }
                          >
                            {isCollapsed ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronUp size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div
                        className={`admin-drag-card-content ${isCollapsed ? "collapsed" : ""}`}
                      >
                        <div
                          className="admin-form-row"
                          style={{ marginBottom: 12 }}
                        >
                          <div className="admin-form-group">
                            <label className="admin-form-label">
                              Date (e.g. JAN 2025)
                            </label>
                            <Input
                              placeholder="Date"
                              value={row.label}
                              onChange={(e) =>
                                updateDataRow(i, "label", e.target.value)
                              }
                            />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">
                              Event Title
                            </label>
                            <Input
                              placeholder="Event Title"
                              value={row.value}
                              onChange={(e) =>
                                updateDataRow(i, "value", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div
                          className="admin-form-group"
                          style={{ marginBottom: 12 }}
                        >
                          <label className="admin-form-label">
                            Event Description
                          </label>
                          <Textarea
                            placeholder="Describe what happened..."
                            value={row.color}
                            onChange={(e) =>
                              updateDataRow(i, "color", e.target.value)
                            }
                            rows={2}
                          />
                        </div>
                        <div
                          className="admin-form-row"
                          style={{ marginBottom: 0 }}
                        >
                          <div className="admin-form-group">
                            <label className="admin-form-label">
                              Event Source (Optional)
                            </label>
                            <Input
                              placeholder="e.g. OpenAI announcement (February 2026)"
                              value={row.source || ""}
                              onChange={(e) =>
                                updateDataRow(i, "source", e.target.value)
                              }
                            />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">
                              Event Circle Color (Optional)
                            </label>
                            <div
                              style={{
                                display: "flex",
                                gap: 6,
                                alignItems: "center",
                              }}
                            >
                              <input
                                type="color"
                                value={row.eventColor || "#088DFF"}
                                onChange={(e) =>
                                  updateDataRow(i, "eventColor", e.target.value)
                                }
                                style={{
                                  width: 34,
                                  height: 34,
                                  padding: 0,
                                  border: "none",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                }}
                              />
                              <Input
                                value={row.eventColor || ""}
                                onChange={(e) =>
                                  updateDataRow(i, "eventColor", e.target.value)
                                }
                                placeholder="#hex (blank for default)"
                                style={{ flex: 1 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : chartType === "text_block" ? (
              /* Text Block Editor */
              <div>
                <div className="admin-form-row" style={{ marginBottom: 20 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Background Color
                    </label>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      <input
                        type="color"
                        value={dataRows[0]?.color || "#fdf2f2"}
                        onChange={(e) =>
                          updateDataRow(0, "color", e.target.value)
                        }
                        style={{
                          width: 34,
                          height: 34,
                          padding: 0,
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      />
                      <Input
                        value={dataRows[0]?.color || ""}
                        onChange={(e) =>
                          updateDataRow(0, "color", e.target.value)
                        }
                        placeholder="e.g. #fdf2f2"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Left Accent Border Color
                    </label>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      <input
                        type="color"
                        value={dataRows[0]?.eventColor || "#E5483F"}
                        onChange={(e) =>
                          updateDataRow(0, "eventColor", e.target.value)
                        }
                        style={{
                          width: 34,
                          height: 34,
                          padding: 0,
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      />
                      <Input
                        value={dataRows[0]?.eventColor || ""}
                        onChange={(e) =>
                          updateDataRow(0, "eventColor", e.target.value)
                        }
                        placeholder="e.g. #E5483F"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                    Quotes / Callout List
                  </h4>
                  <button
                    type="button"
                    className="admin-add-row-btn"
                    onClick={addDataRow}
                    style={{
                      width: "auto",
                      display: "inline-flex",
                      padding: "6px 12px",
                    }}
                  >
                    <PlusCircle size={14} /> Add Quote
                  </button>
                </div>

                {dataRows.map((row, i) => {
                  const isCollapsed = !!collapsedRows[i];
                  return (
                    <div
                      key={i}
                      className="admin-drag-card"
                      draggable
                      onDragStart={(e) => {
                        setDraggedRowIndex(i);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedRowIndex === null || draggedRowIndex === i)
                          return;
                        const updated = [...dataRows];
                        const [draggedItem] = updated.splice(
                          draggedRowIndex,
                          1,
                        );
                        updated.splice(i, 0, draggedItem);
                        setDataRows(updated);
                        setDraggedRowIndex(null);
                      }}
                    >
                      <div className="admin-drag-card-header">
                        <div className="admin-drag-card-title">
                          <GripVertical
                            size={16}
                            style={{
                              cursor: "grab",
                              color: "var(--admin-text-dim)",
                            }}
                          />
                          <span>
                            {row.value
                              ? row.value.substring(0, 60) + (row.value.length > 60 ? "..." : "")
                              : `Quote #${i + 1}`}
                          </span>
                        </div>
                        <div className="admin-drag-card-actions">
                          {dataRows.length > 1 && (
                            <button
                              type="button"
                              className="admin-btn-icon"
                              onClick={() => removeDataRow(i)}
                              style={{
                                color: "var(--admin-danger)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                borderRadius: "50%",
                                padding: 5,
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() =>
                              setCollapsedRows((prev) => ({
                                ...prev,
                                [i]: !prev[i],
                              }))
                            }
                          >
                            {isCollapsed ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronUp size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div
                        className={`admin-drag-card-content ${isCollapsed ? "collapsed" : ""}`}
                      >
                        <div
                          className="admin-form-group"
                          style={{ marginBottom: 12 }}
                        >
                          <label className="admin-form-label">
                            Quote Text
                          </label>
                          <Textarea
                            placeholder="Enter the quote content (without quote marks, e.g. Due to overhyped expectations...)"
                            value={row.value || ""}
                            onChange={(e) =>
                              updateDataRow(i, "value", e.target.value)
                            }
                            rows={3}
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label className="admin-form-label">
                            Author / Citation (Optional)
                          </label>
                          <Input
                            placeholder="e.g. Industry analyst quoted in Fortune CEO Daily, January 2024"
                            value={row.label || ""}
                            onChange={(e) =>
                              updateDataRow(i, "label", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : chartType === "list_block" ? (
              /* List Block Editor */
              <div>
                <div className="admin-form-row" style={{ marginBottom: 24 }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Background Color</label>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="color"
                        value={dataRows[0]?.color || "#ecfdf5"}
                        onChange={(e) => updateDataRow(0, "color", e.target.value)}
                        style={{ width: 34, height: 34, padding: 0, border: "none", borderRadius: 4, cursor: "pointer" }}
                      />
                      <Input
                        value={dataRows[0]?.color || ""}
                        onChange={(e) => updateDataRow(0, "color", e.target.value)}
                        placeholder="e.g. #ecfdf5 (Light Green)"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Accent Border & Arrow Color</label>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="color"
                        value={dataRows[0]?.eventColor || "#10B981"}
                        onChange={(e) => updateDataRow(0, "eventColor", e.target.value)}
                        style={{ width: 34, height: 34, padding: 0, border: "none", borderRadius: 4, cursor: "pointer" }}
                      />
                      <Input
                        value={dataRows[0]?.eventColor || ""}
                        onChange={(e) => updateDataRow(0, "eventColor", e.target.value)}
                        placeholder="e.g. #10B981 (Dark Green)"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>List Items</h4>
                  <button type="button" className="admin-add-row-btn" onClick={addDataRow} style={{ width: "auto", display: "inline-flex", padding: "6px 12px" }}>
                    <PlusCircle size={14} /> Add Item
                  </button>
                </div>

                {dataRows.map((row, i) => {
                  const isCollapsed = !!collapsedRows[i];
                  return (
                    <div key={i} className="admin-drag-card" draggable onDragStart={(e) => { setDraggedRowIndex(i); e.dataTransfer.effectAllowed = "move"; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (draggedRowIndex === null || draggedRowIndex === i) return; const updated = [...dataRows]; const [draggedItem] = updated.splice(draggedRowIndex, 1); updated.splice(i, 0, draggedItem); setDataRows(updated); setDraggedRowIndex(null); }}>
                      <div className="admin-drag-card-header">
                        <div className="admin-drag-card-title">
                          <GripVertical size={16} style={{ cursor: "grab", color: "var(--admin-text-dim)" }} />
                          <span>{row.label ? row.label.substring(0, 50) + (row.label.length > 50 ? "..." : "") : `List Item #${i + 1}`}</span>
                        </div>
                        <div className="admin-drag-card-actions">
                          {dataRows.length > 1 && (
                            <button type="button" className="admin-btn-icon" onClick={() => removeDataRow(i)} style={{ color: "var(--admin-danger)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "50%", padding: 5 }}>
                              <Trash2 size={14} />
                            </button>
                          )}
                          <button type="button" className="admin-btn-icon" onClick={() => setCollapsedRows((prev) => ({ ...prev, [i]: !prev[i] }))}>
                            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className={`admin-drag-card-content ${isCollapsed ? "collapsed" : ""}`}>
                        <div className="admin-form-group" style={{ marginBottom: 12 }}>
                          <label className="admin-form-label">Bold Text (Prefix)</label>
                          <Input
                            placeholder="e.g. Claude paid subs more than doubled"
                            value={row.label || ""}
                            onChange={(e) => updateDataRow(i, "label", e.target.value)}
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label className="admin-form-label">Regular Text</label>
                          <Textarea
                            placeholder="e.g. January-February 2026, per Anthropic confirmation..."
                            value={row.value || ""}
                            onChange={(e) => updateDataRow(i, "value", e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : chartType === "line" ||
              ((chartType === "vbar" || chartType === "hbar") && isGrouped) ? (
              /* Line Series Builder */
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                    Line Series
                  </h4>
                  <button
                    type="button"
                    className="admin-add-row-btn"
                    onClick={addLineSeries}
                    style={{
                      width: "auto",
                      display: "inline-flex",
                      padding: "6px 12px",
                    }}
                  >
                    <PlusCircle size={14} /> Add Series
                  </button>
                </div>

                {lineSeries.map((series, seriesIdx) => {
                  const isCollapsed = !!collapsedSeries[seriesIdx];
                  return (
                    <div
                      key={seriesIdx}
                      className="admin-drag-card"
                      draggable
                      onDragStart={(e) => {
                        setDraggedSeriesIndex(seriesIdx);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (
                          draggedSeriesIndex === null ||
                          draggedSeriesIndex === seriesIdx
                        )
                          return;
                        const updated = [...lineSeries];
                        const [draggedItem] = updated.splice(
                          draggedSeriesIndex,
                          1,
                        );
                        updated.splice(seriesIdx, 0, draggedItem);
                        setLineSeries(updated);
                        setDraggedSeriesIndex(null);
                      }}
                      style={{
                        borderLeft: `4px solid ${series.color || "#088DFF"}`,
                      }}
                    >
                      <div className="admin-drag-card-header">
                        <div className="admin-drag-card-title">
                          <GripVertical
                            size={16}
                            style={{
                              cursor: "grab",
                              color: "var(--admin-text-dim)",
                            }}
                          />
                          <span>
                            {series.name || `Series #${seriesIdx + 1}`}
                          </span>
                        </div>
                        <div className="admin-drag-card-actions">
                          {lineSeries.length > 1 && (
                            <button
                              type="button"
                              className="admin-btn-icon"
                              onClick={() => removeLineSeries(seriesIdx)}
                              style={{
                                color: "var(--admin-danger)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                borderRadius: "50%",
                                padding: 5,
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() =>
                              setCollapsedSeries((prev) => ({
                                ...prev,
                                [seriesIdx]: !prev[seriesIdx],
                              }))
                            }
                          >
                            {isCollapsed ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronUp size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div
                        className={`admin-drag-card-content ${isCollapsed ? "collapsed" : ""}`}
                      >
                        <div
                          className="admin-form-row"
                          style={{ marginBottom: 12 }}
                        >
                          <div className="admin-form-group">
                            <label className="admin-form-label">
                              Series Name
                            </label>
                            <Input
                              placeholder="e.g. Gen Z (18-25)"
                              value={series.name}
                              onChange={(e) =>
                                updateLineSeriesInfo(
                                  seriesIdx,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-form-label">
                              Series Color
                            </label>
                            <div
                              style={{
                                display: "flex",
                                gap: 6,
                                alignItems: "center",
                              }}
                            >
                              <input
                                type="color"
                                value={series.color || "#088DFF"}
                                onChange={(e) =>
                                  updateLineSeriesInfo(
                                    seriesIdx,
                                    "color",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  width: 34,
                                  height: 34,
                                  padding: 0,
                                  border: "none",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                }}
                              />
                              <Input
                                value={series.color}
                                onChange={(e) =>
                                  updateLineSeriesInfo(
                                    seriesIdx,
                                    "color",
                                    e.target.value,
                                  )
                                }
                                placeholder="#hex"
                                style={{ flex: 1 }}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <label
                            className="admin-form-label"
                            style={{ marginBottom: 0 }}
                          >
                            Data Points (X/Y pairs)
                          </label>
                          <button
                            type="button"
                            className="admin-add-row-btn"
                            onClick={() => addDataPoint(seriesIdx)}
                            style={{
                              width: "auto",
                              display: "inline-flex",
                              padding: "4px 10px",
                              fontSize: 11,
                            }}
                          >
                            <PlusCircle size={12} /> Add Data Point
                          </button>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          {series.dataPoints.map((pt, ptIdx) => (
                            <div
                              key={ptIdx}
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                              }}
                            >
                              <Input
                                placeholder="X value (e.g. 2022)"
                                value={pt.x}
                                onChange={(e) =>
                                  updateDataPoint(
                                    seriesIdx,
                                    ptIdx,
                                    "x",
                                    e.target.value,
                                  )
                                }
                                style={{ flex: 1 }}
                              />
                              <Input
                                placeholder="Y value (e.g. 45)"
                                type="number"
                                value={pt.y}
                                onChange={(e) =>
                                  updateDataPoint(
                                    seriesIdx,
                                    ptIdx,
                                    "y",
                                    e.target.value,
                                  )
                                }
                                style={{ flex: 1 }}
                              />
                              <button
                                type="button"
                                className="admin-btn-icon"
                                onClick={() =>
                                  removeDataPoint(seriesIdx, ptIdx)
                                }
                                style={{ color: "var(--admin-danger)" }}
                                disabled={series.dataPoints.length <= 1}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Flat Bar / Donut Table Data Editor */
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                    Data Rows
                  </h4>
                  <button
                    type="button"
                    className="admin-add-row-btn"
                    onClick={addDataRow}
                    style={{
                      width: "auto",
                      display: "inline-flex",
                      padding: "6px 12px",
                    }}
                  >
                    <PlusCircle size={14} /> Add Data Row
                  </button>
                </div>

                {dataRows.map((row, i) => {
                  const isCollapsed = !!collapsedRows[i];
                  return (
                    <div
                      key={i}
                      className="admin-drag-card"
                      draggable
                      onDragStart={(e) => {
                        setDraggedRowIndex(i);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedRowIndex === null || draggedRowIndex === i)
                          return;
                        const updated = [...dataRows];
                        const [draggedItem] = updated.splice(
                          draggedRowIndex,
                          1,
                        );
                        updated.splice(i, 0, draggedItem);
                        setDataRows(updated);
                        setDraggedRowIndex(null);
                      }}
                    >
                      <div className="admin-drag-card-header">
                        <div className="admin-drag-card-title">
                          <GripVertical
                            size={16}
                            style={{
                              cursor: "grab",
                              color: "var(--admin-text-dim)",
                            }}
                          />
                          <span>{row.label || `Row #${i + 1}`}</span>
                        </div>
                        <div className="admin-drag-card-actions">
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() => removeDataRow(i)}
                            style={{
                              color: "var(--admin-danger)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              borderRadius: "50%",
                              padding: 5,
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() =>
                              setCollapsedRows((prev) => ({
                                ...prev,
                                [i]: !prev[i],
                              }))
                            }
                          >
                            {isCollapsed ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronUp size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div
                        className={`admin-drag-card-content ${isCollapsed ? "collapsed" : ""}`}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div
                            className="admin-form-group"
                            style={{ marginBottom: 0 }}
                          >
                            <label className="admin-form-label">Label</label>
                            <Input
                              placeholder="Label"
                              value={row.label}
                              onChange={(e) =>
                                updateDataRow(i, "label", e.target.value)
                              }
                            />
                          </div>
                          <div
                            className="admin-form-group"
                            style={{ marginBottom: 0 }}
                          >
                            <label className="admin-form-label">Value</label>
                            <Input
                              placeholder="Value"
                              type="number"
                              value={row.value}
                              onChange={(e) =>
                                updateDataRow(i, "value", e.target.value)
                              }
                            />
                          </div>
                          {showColors ? (
                            <div
                              className="admin-form-group"
                              style={{ marginBottom: 0 }}
                            >
                              <label className="admin-form-label">Color</label>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 6,
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="color"
                                  value={row.color || "#088DFF"}
                                  onChange={(e) =>
                                    updateDataRow(i, "color", e.target.value)
                                  }
                                  style={{
                                    width: 34,
                                    height: 34,
                                    padding: 0,
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    flexShrink: 0,
                                  }}
                                />
                                <Input
                                  value={row.color || ""}
                                  onChange={(e) =>
                                    updateDataRow(i, "color", e.target.value)
                                  }
                                  placeholder="#hex"
                                  style={{ flex: 1 }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="hidden md:block"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Sources Editor */}
          <div className="admin-form-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3
                className="admin-form-section-title"
                style={{ margin: 0, borderBottom: "none" }}
              >
                Sources
              </h3>
              <button
                type="button"
                className="admin-add-row-btn"
                onClick={addSource}
                style={{
                  width: "auto",
                  display: "inline-flex",
                  padding: "6px 12px",
                }}
              >
                <PlusCircle size={14} /> Add Source
              </button>
            </div>

            {sources.map((src, i) => {
              const isCollapsed = !!collapsedSources[i];
              return (
                <div
                  key={i}
                  className="admin-drag-card"
                  draggable
                  onDragStart={(e) => {
                    setDraggedSourceIndex(i);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedSourceIndex === null || draggedSourceIndex === i)
                      return;
                    const updated = [...sources];
                    const [draggedItem] = updated.splice(draggedSourceIndex, 1);
                    updated.splice(i, 0, draggedItem);
                    // Re-assign position
                    const final = updated.map((s, idx) => ({
                      ...s,
                      position: idx,
                    }));
                    setSources(final);
                    setDraggedSourceIndex(null);
                  }}
                >
                  <div className="admin-drag-card-header">
                    <div className="admin-drag-card-title">
                      <GripVertical
                        size={16}
                        style={{
                          cursor: "grab",
                          color: "var(--admin-text-dim)",
                        }}
                      />
                      <span>{src.sourceName || `Source #${i + 1}`}</span>
                    </div>
                    <div className="admin-drag-card-actions">
                      <button
                        type="button"
                        className="admin-btn-icon"
                        onClick={() => removeSource(i)}
                        style={{
                          color: "var(--admin-danger)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: "50%",
                          padding: 5,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="admin-btn-icon"
                        onClick={() =>
                          setCollapsedSources((prev) => ({
                            ...prev,
                            [i]: !prev[i],
                          }))
                        }
                      >
                        {isCollapsed ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronUp size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`admin-drag-card-content ${isCollapsed ? "collapsed" : ""}`}
                  >
                    <div className="admin-form-row">
                      <div
                        className="admin-form-group"
                        style={{ marginBottom: 8 }}
                      >
                        <label className="admin-form-label">Name</label>
                        <Input
                          value={src.sourceName}
                          onChange={(e) =>
                            updateSource(i, "sourceName", e.target.value)
                          }
                          placeholder="e.g. Stanford AI Index"
                        />
                      </div>
                      <div
                        className="admin-form-group"
                        style={{ marginBottom: 8 }}
                      >
                        <label className="admin-form-label">URL</label>
                        <Input
                          value={src.sourceUrl}
                          onChange={(e) =>
                            updateSource(i, "sourceUrl", e.target.value)
                          }
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div
                        className="admin-form-group"
                        style={{ marginBottom: 0 }}
                      >
                        <label className="admin-form-label">Publication</label>
                        <Input
                          value={src.publication}
                          onChange={(e) =>
                            updateSource(i, "publication", e.target.value)
                          }
                          placeholder="e.g. Nature"
                        />
                      </div>
                      <div
                        className="admin-form-group"
                        style={{ marginBottom: 0 }}
                      >
                        <label className="admin-form-label">Date</label>
                        <DatePicker
                          value={src.publicationDate}
                          onChange={(val) =>
                            updateSource(i, "publicationDate", val)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Preview Container */}
          {!!previewData && (
            <div className="admin-card" style={{ marginBottom: 24 }}>
              <h3 className="admin-form-section-title">Chart Live Preview</h3>
              <div
                style={{
                  height: 300,
                  background: "#fff",
                  border: "1px solid var(--admin-border-subtle)",
                  borderRadius: "var(--admin-radius-sm)",
                  padding: 16,
                }}
              >
                {chartType === "line" &&
                (() => {
                  const pd = previewData as { series?: { data?: unknown[] }[] };
                  return (
                    !pd.series ||
                    !pd.series[0] ||
                    !pd.series[0].data ||
                    pd.series[0].data.length === 0
                  );
                })() ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "var(--admin-text-dim)",
                    }}
                  >
                    Add at least one series with data points to preview
                  </div>
                ) : (
                  <InteractiveChart
                    chartId="preview-chart"
                    chartType={
                      chartType as
                        | "vbar"
                        | "hbar"
                        | "line"
                        | "donut"
                        | "hero_stat"
                    }
                    data={previewData}
                    title={title}
                  />
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="admin-btn admin-btn-primary"
              type="submit"
              disabled={saving}
            >
              <Save size={16} />{" "}
              {saving ? "Saving..." : isNew ? "Create Chart" : "Save Chart"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => {
                setPreviewData(
                  buildChartDataPayload(
                    chartType,
                    dataRows,
                    lineSeries,
                    xLabel,
                    yLabel,
                    yFormat,
                    trendDirection,
                    trendAmount,
                    yMax,
                    ySuffix,
                    yPrefix,
                    isGrouped,
                    heroPrefix,
                    heroSuffix,
                    heroSuffixSize,
                    tooltipTitleTemplate,
                    tooltipValueSuffix,
                    xMax,
                    stacked,
                  ),
                );
              }}
            >
              Preview Chart
            </button>
            <Link
              href={`/admin/topics/${topicId}`}
              className="admin-btn admin-btn-secondary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
