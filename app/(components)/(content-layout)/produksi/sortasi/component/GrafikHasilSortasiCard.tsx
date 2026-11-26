"use client";

import React from 'react';
import ClientChart from '../../../shared/ClientChart';

interface GrafikHasilSortasiCardProps {
  data?: {
    categories: string[];
    lolos: number[];
    reject: number[];
  };
}

export default function GrafikHasilSortasiCard({ data }: GrafikHasilSortasiCardProps) {
  const categories = data?.categories || ['Melon', 'Cabai', 'Padi', 'Tomat', 'Kangkung'];
  const lolosSeries = data?.lolos || [600, 350, 300, 250, 450];
  const rejectSeries = data?.reject || [50, 35, 30, 25, 40];

  const series = [
    {
      name: 'Lolos',
      data: lolosSeries,
    },
    {
      name: 'Reject',
      data: rejectSeries,
    },
  ];

  const options: any = {
    chart: {
      type: 'bar',
      height: 180,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#10b981', '#f43f5e'],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '10px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '10px',
        },
        formatter: (val: number) => val.toString(),
      },
      tickAmount: 4,
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 3,
      padding: { top: 0, right: 10, bottom: 0, left: 10 },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '11px',
      markers: {
        size: 7,
        shape: 'square',
      },
      itemMargin: { horizontal: 6 },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} kg`,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-xs font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
          <i className="ri-bar-chart-grouped-line text-emerald-600"></i>
          <span>Grafik Hasil Sortasi</span>
        </h4>
      </div>

      <div className="w-full">
        <ClientChart options={options} series={series} type="bar" height={190} />
      </div>
    </div>
  );
}
