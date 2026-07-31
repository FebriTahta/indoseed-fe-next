import React, { useState, useMemo } from 'react';
import { JadwalTanam } from '@/app/types/jadwalTanam';

interface KalenderJadwalTanamProps {
  jadwalTanams?: JadwalTanam[];
}

export default function KalenderJadwalTanam({ jadwalTanams = [] }: KalenderJadwalTanamProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const daysHeader = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Generate 35 or 42 calendar grid cells
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const d = new Date(year, month - 1, dayNum);
      const isoKey = d.toISOString().split('T')[0];
      days.push({
        day: dayNum,
        isCurrentMonth: false,
        dateObj: d,
        isoKey,
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(dayNum).padStart(2, '0');
      const isoKey = `${year}-${monthStr}-${dayStr}`;
      days.push({
        day: dayNum,
        isCurrentMonth: true,
        dateObj: d,
        isoKey,
      });
    }

    // Next month days
    const totalCells = days.length > 35 ? 42 : 35;
    const remaining = totalCells - days.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const d = new Date(year, month + 1, dayNum);
      const isoKey = d.toISOString().split('T')[0];
      days.push({
        day: dayNum,
        isCurrentMonth: false,
        dateObj: d,
        isoKey,
      });
    }

    return days;
  }, [currentDate]);

  // Map events to days
  const eventsByDateKey = useMemo(() => {
    const map: Record<string, { items: JadwalTanam[]; hasAkanTanam: boolean; hasBerlangsung: boolean; hasSelesai: boolean }> = {};

    const parseDateToKey = (dateStr?: string) => {
      if (!dateStr) return null;
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      if (dateStr.includes('-')) {
        return dateStr.slice(0, 10);
      }
      return null;
    };

    jadwalTanams.forEach(item => {
      const keyMulai = parseDateToKey(item.informasiUmum?.periodeTanamMulai || item.rencanaTanam?.tanggalTanam);
      if (keyMulai) {
        if (!map[keyMulai]) {
          map[keyMulai] = { items: [], hasAkanTanam: false, hasBerlangsung: false, hasSelesai: false };
        }
        map[keyMulai].items.push(item);

        const st = item.status || item.informasiUmum?.statusJadwal || '';
        if (st === 'Akan Tanam' || st === 'Draft') map[keyMulai].hasAkanTanam = true;
        else if (st === 'Sedang Berlangsung' || st === 'Berjalan') map[keyMulai].hasBerlangsung = true;
        else if (st === 'Selesai') map[keyMulai].hasSelesai = true;
        else map[keyMulai].hasAkanTanam = true;
      }
    });

    return map;
  }, [jadwalTanams]);

  const selectedDayItems = selectedDayKey && eventsByDateKey[selectedDayKey] ? eventsByDateKey[selectedDayKey].items : [];

  const todayIsoKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Kalender Jadwal Tanam</h3>
      </div>
      <div className="box-body p-4">
        {/* Month Selector Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors"
            title="Bulan Sebelumnya"
          >
            <i className="ri-chevron-left-s-line text-base"></i>
          </button>
          <span className="text-xs font-bold text-gray-800 capitalize">{monthYearLabel}</span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors"
            title="Bulan Berikutnya"
          >
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
          {calendarGrid.map((item, idx) => {
            const eventInfo = eventsByDateKey[item.isoKey];
            const isToday = item.isoKey === todayIsoKey;
            const isSelected = selectedDayKey === item.isoKey;

            return (
              <button
                type="button"
                key={idx}
                onClick={() => setSelectedDayKey(item.isoKey)}
                className={`relative flex flex-col items-center justify-center py-1 min-h-[32px] rounded cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <span
                  className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs font-medium ${
                    isToday
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : item.isCurrentMonth
                      ? 'text-gray-700'
                      : 'text-gray-300'
                  }`}
                >
                  {item.day}
                </span>

                {/* Status Dots */}
                {eventInfo && (
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    {eventInfo.hasAkanTanam && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" title="Akan Tanam"></span>
                    )}
                    {eventInfo.hasBerlangsung && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Sedang Berlangsung"></span>
                    )}
                    {eventInfo.hasSelesai && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" title="Selesai"></span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Agenda Items */}
        {selectedDayKey && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-700 mb-1.5">
              Jadwal Tanggal {selectedDayKey.split('-').reverse().join('/')}:
            </p>
            {selectedDayItems.length > 0 ? (
              <div className="space-y-1.5">
                {selectedDayItems.map((evt, eIdx) => (
                  <div key={eIdx} className="p-2 bg-gray-50 rounded border border-gray-100 text-[11px] text-left">
                    <div className="flex items-center justify-between font-semibold text-gray-800">
                      <span>{evt.informasiUmum?.kodeJadwalTanam}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        evt.status === 'Sedang Berlangsung' ? 'bg-emerald-100 text-emerald-700' :
                        evt.status === 'Selesai' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {evt.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-0.5">
                      {evt.lahanKomoditas?.komoditas} - {evt.lahanKomoditas?.varietas} ({evt.lahanKomoditas?.namaLahan})
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">Tidak ada jadwal tanam pada tanggal ini.</p>
            )}
          </div>
        )}

        {/* Legend Footer */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600 flex-wrap gap-2">
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
