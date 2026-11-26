import React from 'react';

export interface StatTrend {
  /** Perubahan persen terhadap periode pembanding; null = belum ada pembanding. */
  value: number | null;
  /** Arah yang dianggap baik (mis. "down" untuk jumlah tidak lulus). */
  goodWhen: 'up' | 'down';
  label?: string;
}

export interface StatItem {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  bgColor: string;
  textColor: string;
  /** Bila diisi, baris bawah menampilkan tren menggantikan subtitle. */
  trend?: StatTrend;
}

function TrendLine({ trend, fallback }: { trend: StatTrend; fallback: string }) {
  if (trend.value === null) return <span className="text-[10px] text-textmuted">{fallback}</span>;
  const up = trend.value > 0;
  const flat = trend.value === 0;
  const good = flat ? null : up === (trend.goodWhen === 'up');
  const tone = good === null ? 'text-textmuted' : good ? 'text-emerald-600' : 'text-rose-600';
  const icon = flat ? 'ri-subtract-line' : up ? 'ri-arrow-up-line' : 'ri-arrow-down-line';
  return (
    <span className="text-[10px] text-textmuted inline-flex items-center gap-0.5">
      <span className={`${tone} font-semibold inline-flex items-center`}>
        <i className={icon} aria-hidden="true"></i>
        {Math.abs(trend.value)}%
      </span>
      {trend.label ?? 'dari periode sebelumnya'}
    </span>
  );
}

interface StatsWidgetsProps {
  items: StatItem[];
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export default function StatsWidgets({ items, columns = 5 }: StatsWidgetsProps) {
  const gridColsClass = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
    7: 'xl:grid-cols-7',
    8: 'xl:grid-cols-8',
  }[columns] || 'xl:grid-cols-5';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gridColsClass} gap-x-6 gap-y-4 mb-6`}>
      {items.map((stat, i) => (
        <div key={i} className="box border border-defaultborder/60 bg-white shadow-sm rounded-md">
          <div className="box-body flex items-center gap-4 p-4">
            <div className={`avatar avatar-lg rounded-full ${stat.bgColor} ${stat.textColor} flex items-center justify-center text-2xl w-12 h-12`}>
              <i className={stat.icon}></i>
            </div>
            <div>
              <p className="text-textmuted text-xs mb-1 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold mb-0 text-gray-800">{stat.value}</h3>
              {stat.trend ? (
                <TrendLine trend={stat.trend} fallback={stat.subtitle} />
              ) : (
                <span className="text-[10px] text-textmuted">{stat.subtitle}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
