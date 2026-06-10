'use client';

import { useState, useEffect, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';
import InteractiveChart from '@/src/components/InteractiveChart';
import IconUploadField from '@/src/components/admin/IconUploadField';

interface DataRow {
  label: string;
  value: string;
  color?: string;
}

interface SourceRow {
  position: number;
  sourceName: string;
  sourceUrl: string;
  publication: string;
  publicationDate: string;
}

interface LineSeries {
  name: string;
  color: string;
  dataPoints: { x: string; y: string }[];
}

const CHART_TYPES = [
  { value: 'vbar', label: 'Vertical Bar' },
  { value: 'hbar', label: 'Horizontal Bar' },
  { value: 'line', label: 'Line' },
  { value: 'donut', label: 'Donut' },
  { value: 'hero_stat', label: 'Hero Stat' },
];

// Parse existing chart.data into our row format
function parseDataRows(chartType: string, data: unknown): DataRow[] {
  if (!data) return [{ label: '', value: '', color: '' }];

  const typedData = data as Record<string, unknown>;

  if (chartType === 'hero_stat') {
    return [{ label: String(typedData.label || ''), value: String(typedData.value || ''), color: '' }];
  }

  // Fallback check for standard data array
  if (typedData.data && Array.isArray(typedData.data)) {
    return (typedData.data as Record<string, unknown>[]).map((d) => ({
      label: String(d.label || ''),
      value: String(d.value ?? ''),
      color: String(d.color || ''),
    }));
  }

  // For bar/line/donut: data.labels[] + data.datasets[0].data[] + optional colors
  if (typedData.labels && Array.isArray(typedData.labels)) {
    const datasets = typedData.datasets as Record<string, unknown>[] | undefined;
    const values = (datasets?.[0]?.data as unknown[]) || [];
    const colors = (datasets?.[0]?.backgroundColor as unknown) || [];
    return (typedData.labels as string[]).map((label, i) => ({
      label,
      value: String(values[i] ?? ''),
      color: Array.isArray(colors) ? String(colors[i] || '') : String(colors || ''),
    }));
  }

  return [{ label: '', value: '', color: '' }];
}

function buildChartDataPayload(
  chartType: string,
  rows: DataRow[],
  lineSeries: LineSeries[],
  xLabel: string,
  yLabel: string,
  yFormat: string,
  trendDirection: string,
  trendAmount: string
): unknown {
  if (chartType === 'hero_stat') {
    return {
      type: 'hero_stat',
      value: rows[0]?.value || '',
      label: rows[0]?.label || '',
      ...(trendDirection || trendAmount ? {
        trend: {
          direction: trendDirection || undefined,
          amount: trendAmount || undefined
        }
      } : {})
    };
  }

  if (chartType === 'line') {
    return {
      type: 'line',
      xLabel: xLabel || undefined,
      yLabel: yLabel || undefined,
      yFormat: yFormat || undefined,
      series: lineSeries.map((s) => ({
        name: s.name,
        color: s.color || undefined,
        data: s.dataPoints.map((dp) => ({
          x: dp.x,
          y: Number(dp.y) || 0
        }))
      }))
    };
  }

  // vbar, hbar, donut
  return {
    type: chartType,
    xLabel: xLabel || undefined,
    yLabel: yLabel || undefined,
    yFormat: yFormat || undefined,
    data: rows.map((r) => ({
      label: r.label,
      value: Number(r.value) || 0,
      color: r.color || undefined
    }))
  };
}

export default function ChartEditorPage({
  params,
}: {
  params: Promise<{ id: string; chartId: string }>;
}) {
  const { id: topicId, chartId } = use(params);
  const router = useRouter();
  const isNew = chartId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Form state
  const [title, setTitle] = useState('');
  const [chartIdSlug, setChartIdSlug] = useState('');
  const [chartType, setChartType] = useState<string>('vbar');
  const [position, setPosition] = useState(0);
  const [sourceLine, setSourceLine] = useState('');
  const [dataRows, setDataRows] = useState<DataRow[]>([{ label: '', value: '', color: '' }]);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [heading, setHeading] = useState('');
  const [icon, setIcon] = useState('');
  const [displayHome, setDisplayHome] = useState(false);

  // Metadata/Extra Fields
  const [xLabel, setXLabel] = useState('');
  const [yLabel, setYLabel] = useState('');
  const [yFormat, setYFormat] = useState('');
  const [trendDirection, setTrendDirection] = useState<'up' | 'down' | ''>('');
  const [trendAmount, setTrendAmount] = useState('');

  // Line Series builder state
  const [lineSeries, setLineSeries] = useState<LineSeries[]>([
    { name: 'Series 1', color: '#088DFF', dataPoints: [{ x: '', y: '' }] }
  ]);

  // Preview data state
  const [previewData, setPreviewData] = useState<unknown | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  // Fetch chart data for editing
  useEffect(() => {
    if (isNew) return;

    fetch(apiUrl(`/api/admin/charts/${chartId}`))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const c = res.data;
          setTitle(c.title);
          setChartIdSlug(c.chartId);
          setChartType(c.chartType);
          setPosition(c.position);
          setSourceLine(c.sourceLine || '');
          setHeading(c.heading || '');
          setIcon(c.icon || '');
          setDisplayHome(c.displayHome || false);
          setSources(
            (c.sources as Record<string, unknown>[] | undefined)?.map((s, i) => ({
              position: Number(s.position ?? i),
              sourceName: String(s.sourceName || ''),
              sourceUrl: String(s.sourceUrl || ''),
              publication: String(s.publication || ''),
              publicationDate: s.publicationDate
                ? new Date(String(s.publicationDate)).toISOString().split('T')[0]
                : '',
            })) || []
          );

          if (c.data) {
            setXLabel(c.data.xLabel || '');
            setYLabel(c.data.yLabel || '');
            setYFormat(c.data.yFormat || '');

            if (c.chartType === 'hero_stat') {
              setDataRows([{ label: c.data.label || '', value: String(c.data.value || ''), color: '' }]);
              if (c.data.trend) {
                setTrendDirection((c.data.trend.direction || '') as 'up' | 'down' | '');
                setTrendAmount(c.data.trend.amount || '');
              }
            } else if (c.chartType === 'line') {
              if (c.data.series && Array.isArray(c.data.series)) {
                setLineSeries((c.data.series as Record<string, unknown>[]).map((s) => ({
                  name: String(s.name || ''),
                  color: String(s.color || ''),
                  dataPoints: Array.isArray(s.data) ? (s.data as Record<string, unknown>[]).map((dp) => ({ x: String(dp.x || ''), y: String(dp.y ?? '') })) : [{ x: '', y: '' }]
                })));
              }
            } else {
              // bar, donut
              if (c.data.data && Array.isArray(c.data.data)) {
                setDataRows((c.data.data as Record<string, unknown>[]).map((d) => ({
                  label: String(d.label || ''),
                  value: String(d.value ?? ''),
                  color: String(d.color || '')
                })));
              } else {
                setDataRows(parseDataRows(c.chartType, c.data));
              }
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, [chartId, isNew]);

  // Data row management
  const addDataRow = () => setDataRows([...dataRows, { label: '', value: '', color: '' }]);
  const removeDataRow = (i: number) => setDataRows(dataRows.filter((_, idx) => idx !== i));
  const updateDataRow = (i: number, field: keyof DataRow, val: string) => {
    const updated = [...dataRows];
    updated[i] = { ...updated[i], [field]: val };
    setDataRows(updated);
  };

  // Line series management
  const addLineSeries = () => setLineSeries([...lineSeries, { name: `Series ${lineSeries.length + 1}`, color: '#088DFF', dataPoints: [{ x: '', y: '' }] }]);
  const removeLineSeries = (i: number) => setLineSeries(lineSeries.filter((_, idx) => idx !== i));
  const updateLineSeriesInfo = (i: number, field: 'name' | 'color', val: string) => {
    const updated = [...lineSeries];
    updated[i] = { ...updated[i], [field]: val };
    setLineSeries(updated);
  };

  // Line series data points management
  const addDataPoint = (seriesIdx: number) => {
    const updated = [...lineSeries];
    updated[seriesIdx].dataPoints.push({ x: '', y: '' });
    setLineSeries(updated);
  };
  const removeDataPoint = (seriesIdx: number, ptIdx: number) => {
    const updated = [...lineSeries];
    updated[seriesIdx].dataPoints = updated[seriesIdx].dataPoints.filter((_, idx) => idx !== ptIdx);
    setLineSeries(updated);
  };
  const updateDataPoint = (seriesIdx: number, ptIdx: number, field: 'x' | 'y', val: string) => {
    const updated = [...lineSeries];
    updated[seriesIdx].dataPoints[ptIdx] = { ...updated[seriesIdx].dataPoints[ptIdx], [field]: val };
    setLineSeries(updated);
  };

  // Source row management
  const addSource = () =>
    setSources([...sources, { position: sources.length, sourceName: '', sourceUrl: '', publication: '', publicationDate: '' }]);
  const removeSource = (i: number) => setSources(sources.filter((_, idx) => idx !== i));
  const updateSource = (i: number, field: keyof SourceRow, val: string) => {
    const updated = [...sources];
    updated[i] = { ...updated[i], [field]: field === 'position' ? Number(val) : val } as SourceRow;
    setSources(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !chartType) {
      showToast('Title and chart type are required', 'error');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      chartId: chartIdSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      chartType,
      position,
      sourceLine,
      heading,
      icon,
      displayHome,
      data: buildChartDataPayload(chartType, dataRows, lineSeries, xLabel, yLabel, yFormat, trendDirection, trendAmount),
      sources: sources.map((s) => ({
        ...s,
        publicationDate: s.publicationDate || undefined,
      })),
    };

    try {
      const url = isNew ? apiUrl(`/api/admin/topics/${topicId}/charts`) : apiUrl(`/api/admin/charts/${chartId}`);
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast(isNew ? 'Chart created!' : 'Chart saved!');
        if (isNew) {
          router.push(`/admin/topics/${topicId}`);
        }
      } else {
        showToast(json.message || 'Failed to save', 'error');
      }
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-card">
        <div className="admin-skeleton" style={{ width: '100%', height: 400 }} />
      </div>
    );
  }

  const showColors = chartType === 'donut' || chartType === 'vbar' || chartType === 'hbar';
  const isHeroStat = chartType === 'hero_stat';

  return (
    <>
      <div className="admin-breadcrumbs">
        <Link href="/admin/topics">Topics</Link>
        <span className="sep">/</span>
        <Link href={`/admin/topics/${topicId}`}>Topic</Link>
        <span className="sep">/</span>
        <span>{isNew ? 'New Chart' : title}</span>
      </div>

      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{isNew ? 'Create Chart' : `Edit: ${title}`}</h1>
          <p>Form-driven data editor — no JSON required</p>
        </div>
        <Link href={`/admin/topics/${topicId}`} className="admin-btn admin-btn-secondary">
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
                <input
                  className="admin-form-input"
                  placeholder="e.g. AI Investment by Sector"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (isNew) {
                      setChartIdSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                      );
                    }
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Chart ID</label>
                <input
                  className="admin-form-input"
                  value={chartIdSlug}
                  onChange={(e) => setChartIdSlug(e.target.value)}
                  disabled={!isNew}
                  style={{ fontFamily: 'var(--font-geist-mono)', opacity: isNew ? 1 : 0.6 }}
                />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Chart Type *</label>
                <select className="admin-form-select" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                  {CHART_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Position</label>
                <input
                  className="admin-form-input"
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Source Line</label>
              <input
                className="admin-form-input"
                placeholder="e.g. Source: World Economic Forum, 2024"
                value={sourceLine}
                onChange={(e) => setSourceLine(e.target.value)}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Heading / Card Title Override</label>
                <input
                  className="admin-form-input"
                  placeholder="e.g. Weekly adoption cohort"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', marginTop: 'auto', paddingBottom: 12 }}>
                <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={displayHome}
                    onChange={(e) => setDisplayHome(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  Display on Home Page Dashboard
                </label>
              </div>
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
              {isHeroStat ? 'Hero Stat Value' : 'Chart Data'}
            </h3>

            {/* Axis Configuration (Only for Bar and Line charts) */}
            {(chartType === 'vbar' || chartType === 'hbar' || chartType === 'line') && (
              <div className="admin-form-row" style={{ marginBottom: 20 }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">X-Axis Label</label>
                  <input
                    className="admin-form-input"
                    placeholder="e.g. Year or Country"
                    value={xLabel}
                    onChange={(e) => setXLabel(e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Y-Axis Label</label>
                  <input
                    className="admin-form-input"
                    placeholder="e.g. Percentage"
                    value={yLabel}
                    onChange={(e) => setYLabel(e.target.value)}
                  />
                </div>
                <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="admin-form-label">Y-Axis Format</label>
                  <select
                    className="admin-form-select"
                    value={yFormat}
                    onChange={(e) => setYFormat(e.target.value)}
                  >
                    <option value="">Number (Raw)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
              </div>
            )}

            {isHeroStat ? (
              <div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Label</label>
                    <input
                      className="admin-form-input"
                      placeholder="e.g. Total Investment"
                      value={dataRows[0]?.label || ''}
                      onChange={(e) => updateDataRow(0, 'label', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Value</label>
                    <input
                      className="admin-form-input"
                      placeholder="e.g. 73%"
                      value={dataRows[0]?.value || ''}
                      onChange={(e) => updateDataRow(0, 'value', e.target.value)}
                    />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Trend Direction</label>
                    <select
                      className="admin-form-select"
                      value={trendDirection}
                      onChange={(e) => setTrendDirection(e.target.value as 'up' | 'down' | '')}
                    >
                      <option value="">No Trend</option>
                      <option value="up">Up (↑)</option>
                      <option value="down">Down (↓)</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Trend Amount / Label</label>
                    <input
                      className="admin-form-input"
                      placeholder="e.g. +32pp since 2022"
                      value={trendAmount}
                      onChange={(e) => setTrendAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : chartType === 'line' ? (
              /* Line Series Builder */
              <div>
                {lineSeries.map((series, seriesIdx) => (
                  <div
                    key={seriesIdx}
                    className="admin-card"
                    style={{
                      marginBottom: 20,
                      padding: 16,
                      borderLeft: `4px solid ${series.color || '#088DFF'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>Series #{seriesIdx + 1}</span>
                      {lineSeries.length > 1 && (
                        <button
                          type="button"
                          className="admin-btn-icon"
                          onClick={() => removeLineSeries(seriesIdx)}
                          style={{ color: 'var(--admin-danger)' }}
                        >
                          <Trash2 size={14} /> Remove Series
                        </button>
                      )}
                    </div>
                    <div className="admin-form-row" style={{ marginBottom: 12 }}>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Series Name</label>
                        <input
                          className="admin-form-input"
                          placeholder="e.g. Gen Z (18-25)"
                          value={series.name}
                          onChange={(e) => updateLineSeriesInfo(seriesIdx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Series Color</label>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input
                            type="color"
                            value={series.color || '#088DFF'}
                            onChange={(e) => updateLineSeriesInfo(seriesIdx, 'color', e.target.value)}
                            style={{ width: 34, height: 34, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                          />
                          <input
                            className="admin-form-input"
                            value={series.color}
                            onChange={(e) => updateLineSeriesInfo(seriesIdx, 'color', e.target.value)}
                            placeholder="#hex"
                            style={{ flex: 1 }}
                          />
                        </div>
                      </div>
                    </div>

                    <label className="admin-form-label">Data Points (X/Y pairs)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      {series.dataPoints.map((pt, ptIdx) => (
                        <div key={ptIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            className="admin-form-input"
                            placeholder="X value (e.g. 2022)"
                            value={pt.x}
                            onChange={(e) => updateDataPoint(seriesIdx, ptIdx, 'x', e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <input
                            className="admin-form-input"
                            placeholder="Y value (e.g. 45)"
                            type="number"
                            value={pt.y}
                            onChange={(e) => updateDataPoint(seriesIdx, ptIdx, 'y', e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className="admin-btn-icon"
                            onClick={() => removeDataPoint(seriesIdx, ptIdx)}
                            style={{ color: 'var(--admin-danger)' }}
                            disabled={series.dataPoints.length <= 1}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="admin-add-row-btn"
                      onClick={() => addDataPoint(seriesIdx)}
                      style={{ padding: '6px 12px' }}
                    >
                      <Plus size={12} /> Add Data Point
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={addLineSeries}
                  style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed' }}
                >
                  <Plus size={16} /> Add Series
                </button>
              </div>
            ) : (
              /* Flat Bar / Donut Table Data Editor */
              <>
                {/* Header */}
                <div className="admin-data-row" style={{ marginBottom: 4, opacity: 0.5 }}>
                  <span style={{ flex: 1, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Label</span>
                  <span style={{ flex: 1, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Value</span>
                  {showColors && (
                    <span style={{ width: 90, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Color</span>
                  )}
                  <span style={{ width: 32 }} />
                </div>

                {dataRows.map((row, i) => (
                  <div key={i} className="admin-data-row">
                    <input
                      className="admin-form-input"
                      placeholder="Label"
                      value={row.label}
                      onChange={(e) => updateDataRow(i, 'label', e.target.value)}
                    />
                    <input
                      className="admin-form-input"
                      placeholder="Value"
                      type="number"
                      value={row.value}
                      onChange={(e) => updateDataRow(i, 'value', e.target.value)}
                    />
                    {showColors && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 90 }}>
                        <input
                          type="color"
                          value={row.color || '#088DFF'}
                          onChange={(e) => updateDataRow(i, 'color', e.target.value)}
                          style={{ width: 28, height: 28, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                        />
                        <input
                          className="admin-form-input"
                          value={row.color || ''}
                          onChange={(e) => updateDataRow(i, 'color', e.target.value)}
                          placeholder="#hex"
                          style={{ width: 58, fontSize: 11 }}
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      className="admin-btn-icon"
                      onClick={() => removeDataRow(i)}
                      style={{ color: 'var(--admin-danger)' }}
                      title="Remove row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                <button type="button" className="admin-add-row-btn" onClick={addDataRow}>
                  <Plus size={14} /> Add Data Row
                </button>
              </>
            )}
          </div>

          {/* Sources Editor */}
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Sources</h3>

            {sources.map((src, i) => (
              <div key={i} className="admin-card" style={{ marginBottom: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-muted)' }}>Source #{i + 1}</span>
                  <button type="button" className="admin-btn-icon" onClick={() => removeSource(i)} style={{ color: 'var(--admin-danger)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group" style={{ marginBottom: 8 }}>
                    <label className="admin-form-label">Name</label>
                    <input className="admin-form-input" value={src.sourceName} onChange={(e) => updateSource(i, 'sourceName', e.target.value)} placeholder="e.g. Stanford AI Index" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 8 }}>
                    <label className="admin-form-label">URL</label>
                    <input className="admin-form-input" value={src.sourceUrl} onChange={(e) => updateSource(i, 'sourceUrl', e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Publication</label>
                    <input className="admin-form-input" value={src.publication} onChange={(e) => updateSource(i, 'publication', e.target.value)} placeholder="e.g. Nature" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Date</label>
                    <input className="admin-form-input" type="date" value={src.publicationDate} onChange={(e) => updateSource(i, 'publicationDate', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="admin-add-row-btn" onClick={addSource}>
              <Plus size={14} /> Add Source
            </button>
          </div>

          {/* Dynamic Preview Container */}
          {!!previewData && (
            <div className="admin-card" style={{ marginBottom: 24 }}>
              <h3 className="admin-form-section-title">Chart Live Preview</h3>
              <div style={{ height: 300, background: '#fff', border: '1px solid var(--admin-border-subtle)', borderRadius: 'var(--admin-radius-sm)', padding: 16 }}>
                {chartType === 'line' && (() => {
                  const pd = previewData as { series?: { data?: unknown[] }[] };
                  return !pd.series || !pd.series[0] || !pd.series[0].data || pd.series[0].data.length === 0;
                })() ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-text-dim)' }}>
                    Add at least one series with data points to preview
                  </div>
                ) : (
                  <InteractiveChart chartId="preview-chart" chartType={chartType as 'vbar' | 'hbar' | 'line' | 'donut' | 'hero_stat'} data={previewData} />
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : isNew ? 'Create Chart' : 'Save Chart'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => {
                setPreviewData(buildChartDataPayload(chartType, dataRows, lineSeries, xLabel, yLabel, yFormat, trendDirection, trendAmount));
              }}
            >
              Preview Chart
            </button>
            <Link href={`/admin/topics/${topicId}`} className="admin-btn admin-btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Toast */}
      <div className={`admin-toast ${toast.type} ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  );
}
