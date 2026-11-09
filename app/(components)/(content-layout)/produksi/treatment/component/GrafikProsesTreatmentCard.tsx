"use client";

import React from 'react';
import ClientChart from '../../../shared/ClientChart';

interface GrafikProsesTreatmentCardProps {
  data?: Array<{
    komoditas: string;
    selesai: number;
    dalamProses: number;
    menunggu: number;
  }>;
}

export default function GrafikProsesTreatmentCard({ data }: GrafikProsesTreatmentCardProps) {
  const chartData = data && data.length > 0 ? data : [
    { komoditas: 'Melon', selesai: 380, dalamProses: 250, menunggu: 0 },
    { komoditas: 'Cabai', selesai: 150, dalamProses: 150, menunggu: 120 },
    { komoditas: 'Padi', selesai: 300, dalamProses: 0, menunggu: 400 },
    { komoditas: 'Tomat', selesai: 120, dalamProses: 100, menunggu: 0 },
    { komoditas: 'Kangkung', selesai: 100, dalamProses: 0, menunggu: 0 },
    { komoditas: 'Selada', selesai: 80, dalamProses: 0, menunggu: 0 },
  ];

  const categories = chartData.map((d) => d.komoditas);
  const selesaiSeries = chartData.map((d) => d.selesai);
  const dalamProsesSeries = chartData.map((d) => d.dalamProses);
  const menungguSeries = chartData.map((d) => d.menunggu);

  const series = [
    {
      name: 'Selesai',
      data: selesaiSeries,
    },
    {
      name: 'Dalam Proses',
      data: dalamProsesSeries,
    },
    {
      name: 'Menunggu',
      data: menungguSeries,
    },
  ];

  const options: any = {
    chart: {
      type: 'bar',
      height: 200,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '42%',
        borderRadius: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#10B981', '#0EA5E9', '#F59E0B'],
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
          fontSize: '9.5px',
        },
      },
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3,
    },
    legend: {
      show: false, // Customized header legend used below
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} kg`,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs space-y-3">
      {/* Header with Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <i className="ri-bar-chart-grouped-line text-emerald-600 text-sm"></i>
          <h3 className="text-xs font-bold text-gray-800">Grafik Proses Treatment (kg)</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[10px]">
          <span className="flex items-center gap-1 text-gray-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Selesai
          </span>
          <span className="flex items-center gap-1 text-gray-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Dalam Proses
          </span>
          <span className="flex items-center gap-1 text-gray-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Menunggu
          </span>
        </div>
      </div>

      {/* Chart */}
      <ClientChart
        options={options}
        series={series}
        type="bar"
        height={190}
        dataKey={JSON.stringify(chartData)}
      />
    </div>
  );
}
