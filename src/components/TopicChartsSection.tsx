'use client';

import React, { useState, useEffect } from 'react';
import ChartWrapper from './ChartWrapper';

interface Source {
  position?: number;
  sourceName: string;
  sourceUrl?: string;
  publication?: string;
  publicationDate?: Date;
}

interface ChartData {
  _id: string;
  chartId: string;
  position: number;
  title: string;
  chartType: 'vbar' | 'hbar' | 'line' | 'donut' | 'hero_stat';
  data: any;
  sourceLine?: string;
  imageUrl?: string;
  sources?: Source[];
}

interface TopicChartsSectionProps {
  charts: ChartData[];
  categorySlug: string;
  topicSlug: string;
  topicTitle: string;
}

export default function TopicChartsSection({
  charts,
  categorySlug,
  topicSlug,
  topicTitle
}: TopicChartsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: '', id: '' });
  const [activeTab, setActiveTab] = useState('html');
  const [showToast, setShowToast] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openEmbedModal = (chartName: string, chartId: string) => {
    setModalData({ name: chartName, id: chartId });
    setActiveTab('html');
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeEmbedModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const copyCode = async () => {
    let codeToCopy = '';
    if (activeTab === 'html') codeToCopy = getHtmlCode();
    if (activeTab === 'markdown') codeToCopy = getMarkdownCode();
    if (activeTab === 'citation') codeToCopy = getCitationCode();

    try {
      await navigator.clipboard.writeText(codeToCopy);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onechatai.ai';

  const getHtmlCode = () => {
    return `<a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${modalData.id}" target="_blank">
  <img src="${baseUrl}/chart-images/${modalData.id}.png"
       alt="${modalData.name} — OneChat AI Behavior Index"
       width="600" height="400"
       style="max-width: 100%; height: auto; border: 1px solid #e5e5e5;" />
</a>
<p style="font-size: 11px; color: #666; margin-top: 4px;">
  Source: <a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/" target="_blank">OneChat AI Behavior Index</a>
</p>`;
  };

  const getMarkdownCode = () => {
    return `[![${modalData.name}](${baseUrl}/chart-images/${modalData.id}.png)](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${modalData.id})

*Source: [OneChat AI Behavior Index](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/)*`;
  };

  const getCitationCode = () => {
    return `OneChat AI. (2026). "${topicTitle}." AI Behavior Index.
Retrieved from ${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/`;
  };

  // Separate hero_stat (if any) from regular charts
  const heroStatChart = charts.find(c => c.chartType === 'hero_stat');
  const regularCharts = charts.filter(c => c.chartType !== 'hero_stat').sort((a, b) => a.position - b.position);

  return (
    <>
      {/* HERO STAT */}
      {heroStatChart && (
        <div className="hero-stat-card" id={`chart-${heroStatChart.chartId}`}>
          <ChartWrapper
            chartId={heroStatChart.chartId}
            chartType="hero_stat"
            data={heroStatChart.data}
          />
          <button
            className="embed-btn hero-stat-embed"
            onClick={() => openEmbedModal(heroStatChart.title, heroStatChart.chartId)}
          >
            Embed
          </button>
          {heroStatChart.sourceLine && (
            <div className="hero-stat-source">{heroStatChart.sourceLine}</div>
          )}
        </div>
      )}

      {/* CHART GRID */}
      <div className="chart-grid">
        {regularCharts.map((chart) => {
          // Large layouts for line/bar comparisons
          const isFullWidth = chart.chartType === 'line' || chart.position === 1;
          return (
            <div
              key={chart._id}
              className={`chart-card ${isFullWidth ? 'chart-card-full' : ''}`}
              id={`chart-${chart.chartId}`}
            >
              <div className="chart-card-header">
                <div className="chart-card-title-block text-left">
                  <div className="chart-card-eyebrow">
                    Chart {chart.position} · {chart.chartType === 'vbar' || chart.chartType === 'hbar' ? 'Comparison' : chart.chartType === 'line' ? 'Trend' : 'Breakdown'}
                  </div>
                  <div className="chart-card-title">{chart.title}</div>
                </div>
                <button
                  className="embed-btn"
                  onClick={() => openEmbedModal(chart.title, chart.chartId)}
                >
                  Embed
                </button>
              </div>
              <div className="chart-container" style={{ height: '280px', position: 'relative' }}>
                <ChartWrapper
                  chartId={chart.chartId}
                  chartType={chart.chartType}
                  data={chart.data}
                />
              </div>
              {chart.sourceLine && (
                <div className="px-5 md:px-7 py-3 border-t border-[#eaf2fb] bg-[#eaf2fb] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
                  <div>
                    Source:{' '}
                    {chart.sources && chart.sources.length > 0 ? (
                      chart.sources.map((src, idx) => (
                        <span key={idx}>
                          {idx > 0 && ', '}
                          {src.sourceUrl ? (
                            <a href={src.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#4a4a55] underline font-semibold">
                              {src.sourceName}
                            </a>
                          ) : (
                            <span className="text-[#4a4a55] font-semibold">{src.sourceName}</span>
                          )}
                          {src.publication && ` (${src.publication})`}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#4a4a55] font-semibold">{chart.sourceLine}</span>
                    )}
                  </div>
                  <div className="hidden md:block font-serif text-[11px] text-[#15151a] tracking-[0.06em] italic uppercase">
                    <strong className="font-bold not-italic">OneChat AI</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* EMBED MODAL */}
      <div
        className={`modal-backdrop ${isModalOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeEmbedModal();
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h2>Embed this chart</h2>
            <button className="modal-close" onClick={closeEmbedModal}>
              ×
            </button>
          </div>
          <div className="modal-body text-left">
            <div className="modal-preview">
              <div className="modal-preview-label">Embedding</div>
              <div className="modal-preview-name">{modalData.name}</div>
            </div>

            <div className="tab-nav">
              <button
                className={`tab ${activeTab === 'html' ? 'active' : ''}`}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button
                className={`tab ${activeTab === 'markdown' ? 'active' : ''}`}
                onClick={() => setActiveTab('markdown')}
              >
                Markdown
              </button>
              <button
                className={`tab ${activeTab === 'citation' ? 'active' : ''}`}
                onClick={() => setActiveTab('citation')}
              >
                Citation
              </button>
            </div>

            {activeTab === 'html' && <pre className="code-block">{getHtmlCode()}</pre>}
            {activeTab === 'markdown' && <pre className="code-block">{getMarkdownCode()}</pre>}
            {activeTab === 'citation' && <pre className="code-block">{getCitationCode()}</pre>}

            <div className="modal-actions">
              <button className="btn-primary" onClick={copyCode}>
                Copy code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className={`toast ${showToast ? 'show' : ''}`}>Copied to clipboard!</div>
    </>
  );
}
