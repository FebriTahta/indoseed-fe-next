"use client";

import React from 'react';
import ClientChart from '../../../shared/ClientChart';

interface PerbandinganKualitasCardProps {
  data?: {
    categories: string[];
    lolos: number[];
    reject: number[];
  };
}

export default function PerbandinganKualitasCard({ data }: PerbandinganKualitasCardProps) {
  const categories = data?.categories || [
    '10 Jun',
    '12 Jun',
    '15 Jun',
    '18 Jun',
    '20 Jun',
    '22 Jun',
    '24 Jun',
    '27 Jun',
    '28 Jun',
  ];
  const lolosSeries = data?.lolos || [90.0, 90.9, 91.1, 92.9, 88.6, 93.3, 90.0, 92.5, 92.0];
  const rejectSeries = data?.reject || [10.0, 9.1, 8.9, 7.1, 11.4, 6.7, 10.0, 7.5, 8.0];

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
      type: 'line',
      height: 180,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    stroke: {
      curve: 'smooth',
      width: 2.2,
    },
    colors: ['#10b981', '#f43f5e'],
    markers: {
      size: 3.5,
      strokeWidth: 0,
      hover: {
        size: 5,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '9.5px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '10px',
        },
        formatter: (val: number) => `${val}%`,
      },
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
        size: 6,
      },
      itemMargin: { horizontal: 6 },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-xs font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
          <i className="ri-line-chart-line text-emerald-600"></i>
          <span>Perbandingan Kualitas</span>
        </h4>
      </div>

      <div className="w-full">
        <ClientChart options={options} series={series} type="line" height={190} />
      </div>
    </div>
  );
}
