"use client";

import React from 'react';
import ClientChart from '../../../shared/ClientChart';

interface MetodeItem {
  nama: string;
  count: number;
  persentase: number;
  color: string;
}

interface MetodeTreatmentDonutCardProps {
  data?: MetodeItem[];
  totalBatch?: number;
}

export default function MetodeTreatmentDonutCard({
  data,
  totalBatch = 12,
}: MetodeTreatmentDonutCardProps) {
  const defaultData: MetodeItem[] = [
    { nama: 'Fungisida', count: 5, persentase: 41.7, color: '#10B981' },
    { nama: 'Insektisida', count: 4, persentase: 33.3, color: '#0EA5E9' },
    { nama: 'ZPT', count: 2, persentase: 16.7, color: '#F59E0B' },
    { nama: 'Biofungisida', count: 1, persentase: 8.3, color: '#6366F1' },
  ];

  const items = data && data.length > 0 ? data : defaultData;
  const series = items.map((i) => i.count);
  const labels = items.map((i) => i.nama);
  const colors = items.map((i) => i.color || '#10B981');

  const options: any = {
    chart: {
      type: 'donut',
      height: 180,
      fontFamily: 'inherit',
    },
    labels,
    colors,
    stroke: {
      width: 2,
      colors: ['#ffffff'],
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '11px',
              fontWeight: 500,
              color: '#6b7280',
              offsetY: 14,
              formatter: () => 'Batch',
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 800,
              color: '#111827',
              offsetY: -10,
              formatter: () => `${totalBatch}`,
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Batch',
              fontSize: '11px',
              fontWeight: 500,
              color: '#6b7280',
              formatter: () => `${totalBatch}`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false, // We render the clean customized side legend matching screenshot
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} Batch`,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
        <i className="ri-pie-chart-2-line text-emerald-600 text-sm"></i>
        <h3 className="text-xs font-bold text-gray-800">Metode Treatment</h3>
      </div>

      <div className="grid grid-cols-12 items-center gap-2 pt-1">
        {/* Donut Chart (5 cols) */}
        <div className="col-span-5 flex items-center justify-center">
          <ClientChart
            options={options}
            series={series}
            type="donut"
            height={160}
            dataKey={JSON.stringify(items)}
          />
        </div>

        {/* Legend List (7 cols) */}
        <div className="col-span-7 space-y-2 pl-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: it.color }}
                ></span>
                <span className="text-gray-700 font-medium">{it.nama}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900">{it.count}</span>{' '}
                <span className="text-[10px] text-gray-400">({it.persentase}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
