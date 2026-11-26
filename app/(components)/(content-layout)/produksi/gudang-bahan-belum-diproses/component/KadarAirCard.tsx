"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface KadarAirCardProps {
  rataRataKadarAir?: number;
  trendData?: Array<{ date: string; value: number }>;
}

export default function KadarAirCard({
  rataRataKadarAir = 27.5,
  trendData = [
    { date: '1 Jun', value: 28.2 },
    { date: '5 Jun', value: 27.9 },
    { date: '10 Jun', value: 27.5 },
    { date: '15 Jun', value: 27.8 },
    { date: '20 Jun', value: 27.1 },
    { date: '25 Jun', value: 26.8 },
    { date: '30 Jun', value: 27.5 },
  ],
}: KadarAirCardProps) {
  const categories = trendData.map((d) => d.date);
  const values = trendData.map((d) => d.value);

  const series = [
    {
      name: 'Kadar Air',
      data: values,
    },
  ];

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 120,
      sparkline: { enabled: false },
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#059669'], // Emerald-600
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 95, 100],
        colorStops: [
          { offset: 0, color: '#10B981', opacity: 0.4 },
          { offset: 100, color: '#10B981', opacity: 0.0 },
        ],
      },
    },
    markers: {
      size: 3,
      colors: ['#059669'],
      strokeColors: '#ffffff',
      strokeWidth: 1.5,
      hover: { size: 5 },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '9px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 10,
      max: 40,
      tickAmount: 3,
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '9px',
        },
        formatter: (val) => `${val}%`,
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 2,
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  const formattedKadarAir = rataRataKadarAir.toFixed(1).replace('.', ',');

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-emerald-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          Kadar Air Rata-rata
        </h3>
      </div>

      {/* Main big metric */}
      <div className="flex items-center gap-3 my-1">
        <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <div>
          <div className="text-xl font-extrabold text-gray-900 leading-tight">
            {formattedKadarAir}%
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <span>↑</span>
            <span>3,2% dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Line / Area chart */}
      <div className="w-full">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={115}
        />
      </div>
    </div>
  );
}
