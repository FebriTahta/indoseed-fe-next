import React from "react";

export interface TimelineItem {
  title: string;
  date: string;
  total: number;
  color: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({
  items,
}: TimelineProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-8 text-lg font-semibold text-slate-800">
        Timeline Jadwal Tanam
      </h3>

      <div className="relative flex justify-between">

        {/* garis abu */}
        <div className="absolute left-0 right-0 top-[8px] h-[2px] bg-slate-200" />

        {items.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-1 flex-col"
          >
            {/* garis warna */}
            {index < items.length - 1 && (
              <div
                className="absolute top-[8px] left-0 w-full h-[2px]"
                style={{
                  background: item.color,
                }}
              />
            )}

            {/* titik */}
            <div
              className="relative z-10 h-3 w-3 top-[0.25rem] rounded-full"
              style={{
                background: item.color,
              }}
            />

            {/* content */}
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-slate-700">
                {item.title}
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                {item.date}
              </p>

              <p className="mt-2 text-xs font-semibold text-slate-600">
                {item.total} Jadwal
              </p>
            </div>
          </div>
        ))}

        {/* titik terakhir abu */}
        <div className="absolute right-0 top-[2px] h-3 w-3 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}