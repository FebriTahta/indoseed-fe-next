"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface GrafikStokCardProps {
  data?: Array<{
    komoditas: string;
    masuk: number;
    keluar: number;
  }>;
}

export default function GrafikStokCard({ data }: GrafikStokCardProps) {
  const stockData = data && data.length > 0 ? data : [
    { komoditas: 'Melon', masuk: 1600, keluar: 250 },
    { komoditas: 'Cabai', masuk: 950, keluar: 150 },
    { komoditas: 'Tomat', masuk: 900, keluar: 200 },
    { komoditas: 'Padi', masuk: 980, keluar: 350 },
    { komoditas: 'Kangkung', masuk: 670, keluar: 120 },
    { komoditas: 'Selada', masuk: 720, keluar: 180 },
  ];

  const categories = stockData.map((d) => d.komoditas);
  const seriesMasuk = stockData.map((d) => d.masuk);
  const seriesKeluar = stockData.map((d) => d.keluar);

  const series = [
    { name: 'Masuk', data: seriesMasuk },
    { name: 'Keluar', data: seriesKeluar },
  ];

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 200,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 2,
      },
    },
    colors: ['#065F46', '#A7F3D0'], // Deep emerald and mint light
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '11px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 2000,
      tickAmount: 4,
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '10px',
        },
        formatter: (val) => `${val}`,
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 3,
      yaxis: { lines: { show: true } },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '11px',
      markers: { size: 5, shape: 'square' },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} kg`,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-emerald-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Grafik Stok Bahan Belum Diproses
        </h3>
      </div>

      <div className="w-full">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={190}
        />
      </div>
    </div>
  );
}
