import React, { useState } from 'react';

export default function KalenderJadwalTanam() {
  const [currentMonth, setCurrentMonth] = useState('Juni 2026');

  const daysHeader = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const calendarDays = [
    // Week 1 (May 2026 prev month)
    { day: 25, isCurrentMonth: false },
    { day: 26, isCurrentMonth: false },
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },

    // Week 2 (June)
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true, hasGreenDot: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true, hasOrangeCircle: true },

    // Week 3
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true, hasGreenDot: true },
    { day: 12, isCurrentMonth: true, hasGreenDot: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },

    // Week 4
    { day: 15, isCurrentMonth: true, hasOrangeDot: true, isOrangeMarked: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true, isSelected: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true, hasOrangeDot: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },

    // Week 5
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },

    // Week 6
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false },
    { day: 4, isCurrentMonth: false },
    { day: 6, isCurrentMonth: false },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Kalender Jadwal Tanam</h3>
      </div>
      <div className="box-body p-4">
        {/* Month Selector Header */}
        <div className="flex items-center justify-between mb-3">
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
            <i className="ri-chevron-left-s-line text-base"></i>
          </button>
          <span className="text-xs font-bold text-gray-800">{currentMonth}</span>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
            <i className="ri-chevron-right-s-line text-base"></i>
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {daysHeader.map((d, idx) => (
            <span key={idx} className="text-[11px] font-semibold text-gray-500 py-1">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 text-center text-xs">
          {calendarDays.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center justify-center py-1 min-h-[30px]">
              {item.isSelected ? (
                <span className="w-6.5 h-6.5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {item.day}
                </span>
              ) : item.hasOrangeCircle ? (
                <span className="w-6.5 h-6.5 rounded-full border-2 border-orange-500 text-orange-600 flex items-center justify-center font-bold text-xs">
                  {item.day}
                </span>
              ) : item.isOrangeMarked ? (
                <span className="w-6.5 h-6.5 rounded-full border border-orange-400 text-orange-600 flex items-center justify-center font-medium text-xs">
                  {item.day}
                </span>
              ) : (
                <span className={`font-medium ${item.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}`}>
                  {item.day}
                </span>
              )}

              {/* Dots underneath dates */}
              {item.hasGreenDot && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5"></span>
              )}
              {item.hasOrangeDot && !item.isOrangeMarked && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-0.5"></span>
              )}
            </div>
          ))}
        </div>

        {/* Legend Footer */}
        <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
            <span>Akan Tanam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Sedang Berlangsung</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            <span>Selesai</span>
          </div>
        </div>
      </div>
    </div>
  );
}
