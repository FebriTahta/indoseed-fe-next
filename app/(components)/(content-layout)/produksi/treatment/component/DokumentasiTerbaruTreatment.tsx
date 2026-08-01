import React from 'react';

export default function DokumentasiTerbaruTreatment() {
  const photos = [
    {
      title: 'Seed Coating',
      time: '11/06/2026 14:20',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80',
    },
    {
      title: 'Fungisida',
      time: '11/06/2026 13:45',
      img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=200&q=80',
    },
    {
      title: 'Insektisida',
      time: '11/06/2026 13:10',
      img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=200&q=80',
    },
    {
      title: 'Bio Treatment',
      time: '11/06/2026 12:40',
      img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Dokumentasi Terbaru</h3>
        <a href="#" className="text-xs text-emerald-700 font-semibold hover:underline">Lihat Semua</a>
      </div>

      <div className="box-body p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {photos.map((item, idx) => (
          <div key={idx} className="group cursor-pointer">
            <div className="overflow-hidden rounded-lg border border-gray-200 aspect-video mb-1.5 bg-gray-100">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h5 className="text-[11px] font-bold text-gray-800 truncate mb-0.5">{item.title}</h5>
            <span className="text-[9px] text-gray-400 block">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
