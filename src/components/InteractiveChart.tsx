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

interface InteractiveChartProps {
  chartId: string;
  chartType: 'vbar' | 'hbar' | 'line' | 'donut' | 'hero_stat';
  data: any;
}

export default function InteractiveChart({ chartId, chartType, data }: InteractiveChartProps) {
  if (chartType === 'hero_stat') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-6">
        <div className="text-5xl md:text-6xl font-extrabold text-[#088DFF] mb-2 tracking-tight">
          {data.value}
        </div>
        <div className="font-sans text-sm md:text-base text-[#15151a] font-semibold max-w-xs leading-snug">
          {data.label}
        </div>
        {data.trend && (
          <div className="font-sans text-xs text-gray-500 mt-2 bg-gray-100 rounded-full px-3 py-1 font-medium">
            {data.trend.direction === 'up' ? '↑' : '↓'} {data.trend.amount}
          </div>
        )}
      </div>
    );
  }

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
          padding: 10,
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          cornerRadius: 6,
          displayColors: true,
          boxPadding: 6,
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

    return (
      <>
        <Bar data={chartData} options={options} />
        <table className="sr-only">
          <caption>{data.yLabel || 'Vertical Bar Chart'}</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((d: any, idx: number) => (
              <tr key={idx}>
                <td>{d.label}</td>
                <td>{d.value}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
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
          padding: 10,
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          cornerRadius: 6,
          displayColors: true,
          boxPadding: 6,
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

    return (
      <>
        <Bar data={chartData} options={options} />
        <table className="sr-only">
          <caption>{data.xLabel || 'Horizontal Bar Chart'}</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((d: any, idx: number) => (
              <tr key={idx}>
                <td>{d.label}</td>
                <td>{d.value}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  if (chartType === 'line') {
    const chartData = {
      labels: data.series[0].data.map((p: any) => p.x),
      datasets: data.series.map((s: any, i: number) => ({
        label: s.name,
        data: s.data.map((p: any) => p.y),
        borderColor: s.color || PALETTE[i % PALETTE.length],
        backgroundColor: s.color ? `${s.color}14` : `${PALETTE[i % PALETTE.length]}14`,
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
          padding: 10,
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          cornerRadius: 6,
          displayColors: true,
          boxPadding: 6,
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

    return (
      <>
        <Line data={chartData} options={options} />
        <table className="sr-only">
          <caption>Line Chart data</caption>
          <thead>
            <tr>
              <th scope="col">Time/Value</th>
              {data.series.map((s: any, idx: number) => (
                <th scope="col" key={idx}>{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.series[0]?.data.map((p: any, pIdx: number) => (
              <tr key={pIdx}>
                <td>{p.x}</td>
                {data.series.map((s: any, sIdx: number) => (
                  <td key={sIdx}>{s.data[pIdx]?.y}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
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
          padding: 10,
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          cornerRadius: 6,
          displayColors: true,
          boxPadding: 6,
          callbacks: {
            label: (context) => ` ${context.label}: ${context.parsed}%`
          }
        }
      },
    };

    return (
      <>
        <Doughnut data={chartData} options={options} />
        <table className="sr-only">
          <caption>Doughnut Chart data</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((d: any, idx: number) => (
              <tr key={idx}>
                <td>{d.label}</td>
                <td>{d.value}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  return null;
}
