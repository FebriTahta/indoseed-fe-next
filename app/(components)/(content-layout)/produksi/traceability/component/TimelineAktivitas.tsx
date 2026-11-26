import React from 'react';
import { ActivityTimelineItem } from '@/app/types/traceability';

interface Props {
  activities: ActivityTimelineItem[];
}

export default function TimelineAktivitas({ activities }: Props) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-5 h-full">
      <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
        Timeline Aktivitas
      </h3>

      <div className="table-responsive">
        <table className="table whitespace-nowrap min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-slate-50 text-gray-600 font-semibold">
              <th className="p-2.5 text-start">Tahap</th>
              <th className="p-2.5 text-start">Tanggal & Waktu</th>
              <th className="p-2.5 text-start">Oleh</th>
              <th className="p-2.5 text-start">Lokasi</th>
              <th className="p-2.5 text-start">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {activities.map((act, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0 font-bold border border-emerald-300">
                      <i className={act.icon}></i>
                    </div>
                    <span className="font-bold text-gray-800">{act.stageName}</span>
                  </div>
                </td>
                <td className="p-2.5 text-gray-500 text-[11px]">{act.dateTime}</td>
                <td className="p-2.5 text-gray-700 font-medium">{act.actor}</td>
                <td className="p-2.5 text-gray-600">{act.location}</td>
                <td className="p-2.5 text-gray-600">{act.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
