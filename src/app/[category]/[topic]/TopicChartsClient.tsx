'use client';

import React, { useState } from 'react';
import InteractiveChart from '@/src/components/InteractiveChart';
import EmbedModal from '@/src/components/EmbedModal';

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

interface TopicChartsClientProps {
  charts: ChartData[];
  categorySlug: string;
  topicSlug: string;
  topicTitle: string;
}

export default function TopicChartsClient({
  charts,
  categorySlug,
  topicSlug,
  topicTitle
}: TopicChartsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState({ name: '', id: '' });

  const openModal = (name: string, id: string) => {
    setActiveChart({ name, id });
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const heroStatChart = charts.find(c => c.chartType === 'hero_stat');
  const regularCharts = charts.filter(c => c.chartType !== 'hero_stat').sort((a, b) => a.position - b.position);

  return (
    <>
      {/* HERO STAT */}
      {heroStatChart && (
        <div className="bg-white border border-[#d7e3f0] rounded-md p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between mb-8 shadow-sm relative text-left" id={`chart-${heroStatChart.chartId}`}>
          <div className="flex-1">
            <InteractiveChart
              chartId={heroStatChart.chartId}
              chartType="hero_stat"
              data={heroStatChart.data}
            />
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end justify-between h-full min-h-[80px]">
            <button
              className="px-4 py-1.5 border border-[#d7e3f0] hover:border-[#088DFF] hover:bg-[#088DFF]/5 text-[#4a4a55] hover:text-[#088DFF] rounded-md font-sans text-xs font-semibold cursor-pointer transition-colors"
              onClick={() => openModal(heroStatChart.title, heroStatChart.chartId)}
            >
              Embed
            </button>
            {heroStatChart.sourceLine && (
              <div className="text-[11px] text-[#8a8a95] mt-4 font-sans">{heroStatChart.sourceLine}</div>
            )}
          </div>
        </div>
      )}

      {/* CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {regularCharts.map((chart) => {
          const isFullWidth = chart.chartType === 'line' || chart.position === 1;
          return (
            <div
              key={chart._id}
              className={`bg-white border border-[#d7e3f0] rounded-md overflow-hidden flex flex-col mb-4 md:mb-0 shadow-sm ${isFullWidth ? 'lg:col-span-2' : ''}`}
              id={`chart-${chart.chartId}`}
            >
              <div className="p-5 md:p-7 pb-3 flex justify-between items-start border-b border-[#f4f7fa]">
                <div className="text-left">
                  <div className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#8a8a95] font-bold mb-1">
                    Chart {chart.position} · {chart.chartType === 'vbar' || chart.chartType === 'hbar' ? 'Comparison' : chart.chartType === 'line' ? 'Trend' : 'Breakdown'}
                  </div>
                  <div className="font-sans text-base md:text-lg font-extrabold text-[#15151a] leading-tight tracking-tight">
                    {chart.title}
                  </div>
                </div>
                <button
                  className="px-3 py-1.5 border border-[#d7e3f0] hover:border-[#088DFF] hover:bg-[#088DFF]/5 text-[#4a4a55] hover:text-[#088DFF] rounded-md font-sans text-xs font-semibold cursor-pointer transition-colors shrink-0 ml-4"
                  onClick={() => openModal(chart.title, chart.chartId)}
                >
                  Embed
                </button>
              </div>
              <div className="px-5 md:px-7 py-6 flex-1 flex flex-col justify-center min-h-[280px] md:min-h-[320px] relative">
                <InteractiveChart
                  chartId={chart.chartId}
                  chartType={chart.chartType}
                  data={chart.data}
                />
              </div>
              {chart.sourceLine && (
                <div className="px-5 md:px-7 py-3 border-t border-[#f4f7fa] bg-[#fdfefe] flex justify-between items-center font-sans text-[10px] md:text-[10.5px] text-[#8a8a95]">
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

      {/* Embed Modal component */}
      <EmbedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        chartName={activeChart.name}
        chartId={activeChart.id}
        categorySlug={categorySlug}
        topicSlug={topicSlug}
        topicTitle={topicTitle}
      />
    </>
  );
}
