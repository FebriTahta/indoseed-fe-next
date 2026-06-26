import React from 'react';

export interface StatItem {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

interface StatsWidgetsProps {
  items: StatItem[];
}

export default function StatsWidgets({ items }: StatsWidgetsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-6 gap-y-4 mb-6">
      {items.map((stat, i) => (
        <div key={i} className="box border border-defaultborder/60 bg-white shadow-sm rounded-md">
          <div className="box-body flex items-center gap-4 p-4">
            <div className={`avatar avatar-lg rounded-full ${stat.bgColor} ${stat.textColor} flex items-center justify-center text-2xl w-12 h-12`}>
              <i className={stat.icon}></i>
            </div>
            <div>
              <p className="text-textmuted text-xs mb-1 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold mb-0 text-gray-800">{stat.value}</h3>
              <span className="text-[10px] text-textmuted">{stat.subtitle}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
