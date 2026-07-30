import React from "react";

export interface TimelineItem {
  title: string;
  date: string;
  total: number;
  color: string;
}

interface TimelineProps {
  items?: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  const defaultItems: TimelineItem[] = [
    {
      title: "Akan Tanam",
      date: "01 - 07 Jun 2026",
      total: 7,
      color: "#f97316", // Orange
    },
    {
      title: "Sedang Berlangsung",
      date: "08 - 24 Jun 2026",
      total: 15,
      color: "#16a34a", // Green
    },
    {
      title: "Menjelang Panen",
      date: "25 Jun - 05 Jul 2026",
      total: 4,
      color: "#f59e0b", // Yellow/Amber
    },
    {
      title: "Selesai",
      date: "> 05 Jul 2026",
      total: 6,
      color: "#2563eb", // Blue
    },
  ];

  const list = items && items.length > 0 ? items : defaultItems;

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-6 mb-6">
      <h3 className="mb-6 text-sm font-bold text-gray-800">
        Timeline Jadwal Tanam
      </h3>

      <div className="relative flex justify-between items-start pt-2 pb-2">
        {/* Background track line */}
        <div className="absolute left-2 right-2 top-[13px] h-[3px] bg-gray-200 z-0" />

        {/* Colored progress line segments */}
        <div className="absolute left-2 right-1/4 top-[13px] h-[3px] bg-gradient-to-r from-orange-500 via-emerald-500 to-amber-500 z-0" />

        {list.map((item, index) => (
          <div
            key={index}
            className="relative z-10 flex flex-1 flex-col items-start pr-2"
          >
            {/* Milestone Dot */}
            <div
              className="h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
              style={{
                backgroundColor: item.color,
              }}
            />

            {/* Content */}
            <div className="mt-3">
              <h4 className="text-xs font-bold text-gray-800">
                {item.title}
              </h4>

              <p className="mt-0.5 text-[11px] text-gray-500 font-medium">
                {item.date}
              </p>

              <p className="mt-1 text-xs font-semibold text-gray-700">
                {item.total} Jadwal
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}