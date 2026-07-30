import React from 'react';

export default function AktivitasTerbaru() {
  const activities = [
    {
      id: 1,
      title: 'Pemupukan Urea - LA-2605-0001',
      actor: 'oleh Budi Santoso',
      time: '11/06/2026 10:15',
      icon: 'ri-flask-line',
      bgColor: 'bg-emerald-100/90',
      iconColor: 'text-emerald-700',
    },
    {
      id: 2,
      title: 'Pengendalian Hama - LA-2605-0003',
      actor: 'oleh Rina Agustina',
      time: '10/06/2026 15:30',
      icon: 'ri-bug-line',
      bgColor: 'bg-amber-100/90',
      iconColor: 'text-amber-700',
    },
    {
      id: 3,
      title: 'Irigasi - LA-2605-0002',
      actor: 'oleh Dedi Kurniawan',
      time: '10/06/2026 09:45',
      icon: 'ri-drop-line',
      bgColor: 'bg-blue-100/90',
      iconColor: 'text-blue-700',
    },
    {
      id: 4,
      title: 'Penyiangan Gulma - LA-2605-0004',
      actor: 'oleh Slamet Riyadi',
      time: '09/06/2026 14:20',
      icon: 'ri-plant-line',
      bgColor: 'bg-emerald-100/90',
      iconColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Aktivitas Terbaru</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Semua</a>
      </div>

      <div className="box-body p-4 space-y-3">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-100 hover:bg-gray-50/80 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${act.bgColor} ${act.iconColor} flex items-center justify-center font-bold text-sm shrink-0`}>
                <i className={act.icon}></i>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-0.5">{act.title}</h4>
                <span className="text-[10px] text-gray-400 font-medium block">{act.actor}</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
