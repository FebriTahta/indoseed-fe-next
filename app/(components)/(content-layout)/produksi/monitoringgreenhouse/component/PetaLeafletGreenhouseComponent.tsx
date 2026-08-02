"use client";

import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface GreenhouseUnit {
  id: string;
  kodeGreenhouse: string;
  lokasi: string;
  komoditas: string;
  varietas: string;
  luas: string;
  kondisi: 'Baik' | 'Perlu Perhatian' | 'Buruk' | 'Tidak Aktif';
  status: string;
  color: string;
  fillColor: string;
  positions: [number, number][];
}

const GREENHOUSE_UNITS: GreenhouseUnit[] = [
  {
    id: '1',
    kodeGreenhouse: 'GH-01',
    lokasi: 'Zona Alpha - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: '500 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1330, 112.1380], [-7.1330, 112.1390], [-7.1340, 112.1390], [-7.1340, 112.1380]]
  },
  {
    id: '2',
    kodeGreenhouse: 'GH-02',
    lokasi: 'Zona Alpha - Petak 2',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    luas: '450 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1330, 112.1395], [-7.1330, 112.1405], [-7.1340, 112.1405], [-7.1340, 112.1395]]
  },
  {
    id: '3',
    kodeGreenhouse: 'GH-03',
    lokasi: 'Zona Beta - Petak 1',
    komoditas: 'Tomat',
    varietas: 'Servo',
    luas: '600 m²',
    kondisi: 'Perlu Perhatian',
    status: 'Aktif',
    color: '#f59e0b',
    fillColor: '#f59e0b',
    positions: [[-7.1330, 112.1410], [-7.1330, 112.1420], [-7.1340, 112.1420], [-7.1340, 112.1410]]
  },
  {
    id: '4',
    kodeGreenhouse: 'GH-04',
    lokasi: 'Zona Beta - Petak 2',
    komoditas: 'Cabai',
    varietas: 'Laris',
    luas: '480 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1330, 112.1425], [-7.1330, 112.1435], [-7.1340, 112.1435], [-7.1340, 112.1425]]
  },
  {
    id: '5',
    kodeGreenhouse: 'GH-05',
    lokasi: 'Zona Gamma - Petak 1',
    komoditas: 'Mentimun',
    varietas: 'Mistar',
    luas: '520 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1330, 112.1440], [-7.1330, 112.1450], [-7.1340, 112.1450], [-7.1340, 112.1440]]
  },
  {
    id: '6',
    kodeGreenhouse: 'GH-06',
    lokasi: 'Zona Gamma - Petak 2',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: '500 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1345, 112.1380], [-7.1345, 112.1390], [-7.1355, 112.1390], [-7.1355, 112.1380]]
  },
  {
    id: '7',
    kodeGreenhouse: 'GH-07',
    lokasi: 'Zona Delta - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    luas: '550 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1345, 112.1395], [-7.1345, 112.1405], [-7.1355, 112.1405], [-7.1355, 112.1395]]
  },
  {
    id: '8',
    kodeGreenhouse: 'GH-08',
    lokasi: 'Zona Delta - Petak 2',
    komoditas: 'Tomat',
    varietas: 'Servo',
    luas: '600 m²',
    kondisi: 'Buruk',
    status: 'Aktif',
    color: '#ef4444',
    fillColor: '#ef4444',
    positions: [[-7.1345, 112.1410], [-7.1345, 112.1420], [-7.1355, 112.1420], [-7.1355, 112.1410]]
  },
  {
    id: '9',
    kodeGreenhouse: 'GH-09',
    lokasi: 'Zona Epsilon - Petak 1',
    komoditas: 'Melon',
    varietas: 'Golden',
    luas: '400 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1345, 112.1425], [-7.1345, 112.1435], [-7.1355, 112.1435], [-7.1355, 112.1425]]
  },
  {
    id: '10',
    kodeGreenhouse: 'GH-10',
    lokasi: 'Zona Epsilon - Petak 2',
    komoditas: 'Cabai',
    varietas: 'Laris',
    luas: '480 m²',
    kondisi: 'Tidak Aktif',
    status: 'Maintenance',
    color: '#9ca3af',
    fillColor: '#9ca3af',
    positions: [[-7.1345, 112.1440], [-7.1345, 112.1450], [-7.1355, 112.1450], [-7.1355, 112.1440]]
  },
  {
    id: '11',
    kodeGreenhouse: 'GH-11',
    lokasi: 'Zona Zeta - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    luas: '520 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1360, 112.1380], [-7.1360, 112.1390], [-7.1370, 112.1390], [-7.1370, 112.1380]]
  },
  {
    id: '12',
    kodeGreenhouse: 'GH-12',
    lokasi: 'Zona Zeta - Petak 2',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    luas: '450 m²',
    kondisi: 'Perlu Perhatian',
    status: 'Aktif',
    color: '#f59e0b',
    fillColor: '#f59e0b',
    positions: [[-7.1360, 112.1395], [-7.1360, 112.1405], [-7.1370, 112.1405], [-7.1370, 112.1395]]
  },
  {
    id: '13',
    kodeGreenhouse: 'GH-13',
    lokasi: 'Zona Eta - Petak 1',
    komoditas: 'Selada',
    varietas: 'Grand',
    luas: '380 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1360, 112.1410], [-7.1360, 112.1420], [-7.1370, 112.1420], [-7.1370, 112.1410]]
  },
  {
    id: '14',
    kodeGreenhouse: 'GH-14',
    lokasi: 'Zona Eta - Petak 2',
    komoditas: 'Bayam',
    varietas: 'Hijau',
    luas: '350 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1360, 112.1425], [-7.1360, 112.1435], [-7.1370, 112.1435], [-7.1370, 112.1425]]
  },
  {
    id: '15',
    kodeGreenhouse: 'GH-15',
    lokasi: 'Zona Theta - Petak 1',
    komoditas: 'Mentimun',
    varietas: 'Mistar',
    luas: '520 m²',
    kondisi: 'Baik',
    status: 'Aktif',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [[-7.1360, 112.1440], [-7.1360, 112.1450], [-7.1370, 112.1450], [-7.1370, 112.1440]]
  },
];

export default function PetaLeafletGreenhouseComponent() {
  const [tileMode, setTileMode] = useState<'satellite' | 'street'>('satellite');

  const tileUrl = tileMode === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="relative w-full h-[380px]">
      {/* Map Switcher Toggle (Top Left) */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-1 shadow-md flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setTileMode('satellite')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
            tileMode === 'satellite' ? 'bg-[#078836] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Satelit
        </button>
        <button
          type="button"
          onClick={() => setTileMode('street')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
            tileMode === 'street' ? 'bg-[#078836] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Peta Jalan
        </button>
      </div>

      {/* Floating Legend Box (Top Right) */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-md z-[400] text-xs w-44">
        <h4 className="font-bold text-gray-800 text-[11px] mb-2 border-b border-gray-100 pb-1">Legenda Kondisi</h4>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-gray-700 font-medium">Baik</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-gray-700 font-medium">Perlu Perhatian</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-gray-700 font-medium">Buruk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
            <span className="text-gray-700 font-medium">Tidak Aktif</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[-7.1350, 112.1415]}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full z-[10]"
      >
        <TileLayer
          url={tileUrl}
          attribution={
            tileMode === 'satellite'
              ? 'Tiles &copy; Esri'
              : '&copy; OpenStreetMap'
          }
        />

        {GREENHOUSE_UNITS.map((gh) => (
          <Polygon
            key={gh.id}
            positions={gh.positions}
            pathOptions={{
              color: gh.color,
              fillColor: gh.fillColor,
              fillOpacity: 0.5,
              weight: 2.5,
            }}
          >
            <Tooltip permanent direction="center" className="custom-leaflet-tooltip font-sans bg-emerald-950/80 text-white border-0 shadow-md rounded px-2 py-1 text-center">
              <div className="text-center font-bold text-[11px] leading-tight text-white">{gh.kodeGreenhouse}</div>
              <div className="text-[10px] text-gray-200">{gh.komoditas}</div>
              <div className="text-[9px] font-semibold text-emerald-300">{gh.kondisi}</div>
            </Tooltip>
            <Popup>
              <div className="p-1 text-xs">
                <h5 className="font-bold text-gray-800 text-sm mb-1">{gh.kodeGreenhouse} ({gh.lokasi})</h5>
                <p className="mb-0.5"><strong>Komoditas:</strong> {gh.komoditas}</p>
                <p className="mb-0.5"><strong>Varietas:</strong> {gh.varietas}</p>
                <p className="mb-0.5"><strong>Luas:</strong> {gh.luas}</p>
                <p className="mb-0.5"><strong>Status:</strong> {gh.status}</p>
                <p className="mb-0"><strong>Kondisi:</strong> <span className="font-semibold">{gh.kondisi}</span></p>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}
