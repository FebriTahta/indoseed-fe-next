"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartPanenData } from '@/app/types/panen';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface GrafikHasilPanenCardProps {
  chartData: ChartPanenData;
}

export default function GrafikHasilPanenCard({ chartData }: GrafikHasilPanenCardProps) {
  const [period, setPeriod] = useState<string>('7 Hari Terakhir');

  const categories = chartData.categories || ['23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun'];
  const series = chartData.series || [
    { name: 'Melon', data: [1200, 1500, 1100, 1800, 1400, 2100, 1950] },
    { name: 'Cabai', data: [800, 950, 850, 1200, 1100, 1450, 1300] },
    { name: 'Padi', data: [1500, 1800, 1400, 2000, 1750, 2300, 2200] },
    { name: 'Tomat', data: [600, 800, 750, 900, 850, 1100, 1050] },
    { name: 'Kangkung', data: [400, 550, 450, 650, 600, 750, 700] },
  ];

  const colors = ['#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4'];

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 260,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 3,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 1.5,
      colors: ['transparent'],
    },
    colors: colors,
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: 'Jumlah (kg)',
        style: {
          color: '#9CA3AF',
          fontSize: '10px',
          fontWeight: 500,
        },
      },
      min: 0,
      max: 2500,
      tickAmount: 5,
      labels: {
        formatter: (val: number) => val.toLocaleString('id-ID'),
        style: {
          colors: '#9CA3AF',
          fontSize: '10px',
        },
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 3,
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString('id-ID')} kg`,
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      markers: {
        size: 5,
        strokeWidth: 0,
      },
      itemMargin: { horizontal: 8, vertical: 4 },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <i className="ri-bar-chart-2-line text-base"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-900">Grafik Hasil Panen</h3>
        </div>

        {/* Range Dropdown Filter */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="7 Hari Terakhir">7 Hari Terakhir</option>
          <option value="30 Hari Terakhir">30 Hari Terakhir</option>
          <option value="Bulan Ini">Bulan Ini</option>
        </select>
      </div>

      {/* Apex Chart Component */}
      <div className="min-h-[260px]">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={260}
        />
      </div>
    </div>
  );
}
