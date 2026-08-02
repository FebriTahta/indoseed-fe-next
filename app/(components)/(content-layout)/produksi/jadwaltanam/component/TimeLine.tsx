import React, { useMemo } from "react";
import { JadwalTanam } from "@/app/types/jadwalTanam";

export interface TimelineItem {
  title: string;
  date: string;
  total: number;
  color: string;
}

interface TimelineProps {
  items?: TimelineItem[];
  jadwalTanams?: JadwalTanam[];
}

export default function Timeline({ items, jadwalTanams }: TimelineProps) {
  const computedItems = useMemo<TimelineItem[]>(() => {
    if (items && items.length > 0) return items;

    // Get current date / month / year info
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const curMonthName = monthShorts[currentMonthIndex];
    const nextMonthName = monthShorts[(currentMonthIndex + 1) % 12];
    const nextYear = currentMonthIndex === 11 ? currentYear + 1 : currentYear;

    let akanTanamCount = 0;
    let sedangBerlangsungCount = 0;
    let menjelangPanenCount = 0;
    let selesaiCount = 0;

    (jadwalTanams || []).forEach(item => {
      const st = (item.status || item.informasiUmum?.statusJadwal || '').toLowerCase();
      if (st === 'selesai') {
        selesaiCount++;
      } else if (st === 'sedang berlangsung' || st === 'berjalan') {
        let isMenjelangPanen = false;
        if (item.rencanaTanam?.perkiraanPanen) {
          const parts = item.rencanaTanam.perkiraanPanen.split('/');
          if (parts.length === 3) {
            const harvestDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
            const diffDays = Math.ceil((harvestDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
            if (diffDays >= 0 && diffDays <= 14) {
              isMenjelangPanen = true;
            }
          }
        }
        if (isMenjelangPanen) {
          menjelangPanenCount++;
        } else {
          sedangBerlangsungCount++;
        }
      } else {
        akanTanamCount++;
      }
    });

    return [
      {
        title: "Akan Tanam",
        date: `01 - 07 ${curMonthName} ${currentYear}`,
        total: akanTanamCount,
        color: "#f97316", // Orange
      },
      {
        title: "Sedang Berlangsung",
        date: `08 - 24 ${curMonthName} ${currentYear}`,
        total: sedangBerlangsungCount,
        color: "#16a34a", // Green
      },
      {
        title: "Menjelang Panen",
        date: `25 ${curMonthName} - 05 ${nextMonthName} ${nextYear}`,
        total: menjelangPanenCount,
        color: "#f59e0b", // Yellow/Amber
      },
      {
        title: "Selesai",
        date: `> 05 ${nextMonthName} ${nextYear}`,
        total: selesaiCount,
        color: "#2563eb", // Blue
      },
    ];
  }, [jadwalTanams, items]);

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

        {computedItems.map((item, index) => (
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