import React, { useMemo } from 'react';
import ClientChart from '../../shared/ClientChart';

interface TrendChartProps {
  data: any[];
  dateKey: string;
  valueKey: string;
  title: string;
  seriesName: string;
  id: string;
  color?: string;
  height?: number;
}

export default function TrendChart({
  data,
  dateKey,
  valueKey,
  title,
  seriesName,
  id,
  color = '#10b981',
  height = 200
}: TrendChartProps) {
  const { categories, seriesData } = useMemo(() => {
    const trendDataMap: Record<string, { total: number, count: number }> = {};
    
    data.forEach(item => {
      const dateVal = item[dateKey];
      const val = item[valueKey];
      
      if (dateVal && typeof val === 'number') {
        const date = new Date(dateVal);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateStr = `${day}/${month}`;
        
        if (!trendDataMap[dateStr]) {
          trendDataMap[dateStr] = { total: 0, count: 0 };
        }
        trendDataMap[dateStr].total += val;
        trendDataMap[dateStr].count += 1;
      }
    });

    const sortedDates = Object.keys(trendDataMap).sort((a, b) => {
      const [dayA, monthA] = a.split('/');
      const [dayB, monthB] = b.split('/');
      return new Date(2000, Number(monthA) - 1, Number(dayA)).getTime() - new Date(2000, Number(monthB) - 1, Number(dayB)).getTime();
    });

    const dynamicCategories = sortedDates.length > 0 ? sortedDates : ['01/06', '06/06', '11/06', '16/06', '21/06', '26/06', '30/06'];
    const dynamicData = sortedDates.length > 0 ? sortedDates.map(d => Number((trendDataMap[d].total / trendDataMap[d].count).toFixed(2))) : [15, 12, 10, 14, 11, 13, 12];

    return { categories: dynamicCategories, seriesData: dynamicData };
  }, [data, dateKey, valueKey]);

  const options: any = {
    chart: { type: 'line', id, toolbar: { show: false }, sparkline: { enabled: false } },
    colors: [color],
    stroke: { curve: 'smooth', width: [2] },
    xaxis: { categories, labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, max: 20, labels: { style: { colors: '#9ca3af', fontSize: '11px' } } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    markers: { size: 4, colors: ['#fff'], strokeColors: [color], strokeWidth: 2, hover: { size: 6 } },
    legend: { show: true, position: 'bottom' },
    tooltip: { theme: 'light' }
  };

  const series = [
    { name: seriesName, data: seriesData }
  ];

  return (
    <div className="box shadow-sm">
      <div className="box-header border-b border-gray-100 flex justify-between items-center">
        <h5 className="box-title text-base font-semibold">{title}</h5>
        <select className="form-select text-xs py-1"><option>30 Hari Terakhir</option></select>
      </div>
      <div className="box-body p-4">
        <ClientChart id={id} dataKey={data.length} options={options} series={series} type="line" height={height} />
      </div>
    </div>
  );
}
