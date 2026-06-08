'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PALETTE = ['#088DFF', '#E5483F', '#F39323', '#0468BD', '#A8A8B0'];

interface ChartWrapperProps {
  chartId: string;
  chartType: 'vbar' | 'hbar' | 'line' | 'donut' | 'hero_stat';
  data: any;
}

export default function ChartWrapper({ chartId, chartType, data }: ChartWrapperProps) {
  if (chartType === 'hero_stat') {
    // Render hero_stat as plain HTML for better performance
    return (
      <div className="hero-stat-content">
        <div className="hero-stat-value">{data.value}</div>
        <div className="hero-stat-label">{data.label}</div>
        {data.trend && (
          <div className="hero-stat-trend">
            {data.trend.direction === 'up' ? '↑' : '↓'} {data.trend.amount}
          </div>
        )}
      </div>
    );
  }

  // Format tick labels
  const formatAxisValue = (value: any, format?: string) => {
    if (format === 'percentage') {
      return value + '%';
    }
    return value;
  };

  if (chartType === 'vbar') {
    const chartData = {
      labels: data.data.map((d: any) => d.label),
      datasets: [
        {
          label: data.yLabel || '',
          data: data.data.map((d: any) => d.value),
          backgroundColor: data.data.map((d: any, i: number) => d.color || PALETTE[i % PALETTE.length]),
          borderRadius: 4,
          maxBarThickness: 80,
        },
      ],
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (v) => formatAxisValue(v, data.yFormat),
          },
        },
        x: {
          grid: { display: false },
        },
      },
    };

    return <Bar data={chartData} options={options} />;
  }

  if (chartType === 'hbar') {
    const chartData = {
      labels: data.data.map((d: any) => d.label),
      datasets: [
        {
          label: data.xLabel || '',
          data: data.data.map((d: any) => d.value),
          backgroundColor: data.data.map((d: any, i: number) => d.color || PALETTE[i % PALETTE.length]),
          borderRadius: 4,
          maxBarThickness: 28,
        },
      ],
    };

    const options: ChartOptions<'bar'> = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.parsed.x}%`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (v) => formatAxisValue(v, data.yFormat),
          },
        },
        y: {
          grid: { display: false },
        },
      },
    };

    return <Bar data={chartData} options={options} />;
  }

  if (chartType === 'line') {
    const chartData = {
      labels: data.series[0].data.map((p: any) => p.x),
      datasets: data.series.map((s: any, i: number) => ({
        label: s.name,
        data: s.data.map((p: any) => p.y),
        borderColor: s.color || PALETTE[i % PALETTE.length],
        backgroundColor: s.color ? `${s.color}14` : `${PALETTE[i % PALETTE.length]}14`, // Add alpha for fill
        borderWidth: 3,
        pointBackgroundColor: s.color || PALETTE[i % PALETTE.length],
        tension: 0.3,
        fill: true,
      })),
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.dataset.label}: ${context.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (v) => formatAxisValue(v, data.yFormat),
          },
        },
        x: {
          grid: { display: false },
        },
      },
    };

    return <Line data={chartData} options={options} />;
  }

  if (chartType === 'donut') {
    const chartData = {
      labels: data.data.map((d: any) => d.label),
      datasets: [
        {
          data: data.data.map((d: any) => d.value),
          backgroundColor: data.data.map((d: any, i: number) => d.color || PALETTE[i % PALETTE.length]),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { position: 'right' },
        tooltip: {
          callbacks: {
            label: (context) => ` ${context.label}: ${context.parsed}%`
          }
        }
      },
    };

    return <Doughnut data={chartData} options={options} />;
  }

  return null;
}
