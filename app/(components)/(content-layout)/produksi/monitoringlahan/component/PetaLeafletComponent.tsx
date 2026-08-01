"use client";

import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LahanPlot {
  id: string;
  kodeLahan: string;
  lokasi: string;
  komoditas: string;
  varietas: string;
  luas: string;
  kondisi: 'Baik' | 'Perlu Perhatian' | 'Buruk' | 'Belum Tanam';
  color: string;
  fillColor: string;
  positions: [number, number][];
  center: [number, number];
}

const LAHAN_PLOTS: LahanPlot[] = [
  {
    id: '1',
    kodeLahan: 'LA-2605-0001',
    lokasi: 'Blok A - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: '12,50 Ha',
    kondisi: 'Baik',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [
      [-7.1220, 112.1210],
      [-7.1215, 112.1240],
      [-7.1235, 112.1245],
      [-7.1240, 112.1215]
    ],
    center: [-7.1227, 112.1227]
  },
  {
    id: '2',
    kodeLahan: 'LA-2605-0002',
    lokasi: 'Blok A - Petak 2',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    luas: '8,20 Ha',
    kondisi: 'Baik',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [
      [-7.1215, 112.1248],
      [-7.1210, 112.1278],
      [-7.1230, 112.1282],
      [-7.1235, 112.1252]
    ],
    center: [-7.1222, 112.1265]
  },
  {
    id: '3',
    kodeLahan: 'LA-2605-0003',
    lokasi: 'Blok B - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    luas: '10,00 Ha',
    kondisi: 'Perlu Perhatian',
    color: '#f59e0b',
    fillColor: '#f59e0b',
    positions: [
      [-7.1210, 112.1285],
      [-7.1205, 112.1315],
      [-7.1225, 112.1320],
      [-7.1230, 112.1290]
    ],
    center: [-7.1217, 112.1302]
  },
  {
    id: '4',
    kodeLahan: 'LA-2605-0004',
    lokasi: 'Blok B - Petak 2',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    luas: '9,75 Ha',
    kondisi: 'Baik',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [
      [-7.1245, 112.1218],
      [-7.1240, 112.1248],
      [-7.1265, 112.1252],
      [-7.1270, 112.1222]
    ],
    center: [-7.1255, 112.1235]
  },
  {
    id: '5',
    kodeLahan: 'LA-2605-0005',
    lokasi: 'Blok C - Petak 1',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    luas: '6,30 Ha',
    kondisi: 'Buruk',
    color: '#ef4444',
    fillColor: '#ef4444',
    positions: [
      [-7.1240, 112.1255],
      [-7.1235, 112.1285],
      [-7.1260, 112.1288],
      [-7.1265, 112.1258]
    ],
    center: [-7.1250, 112.1271]
  },
  {
    id: '6',
    kodeLahan: 'LA-2605-0006',
    lokasi: 'Blok C - Petak 2',
    komoditas: 'Padi',
    varietas: 'Ciherang',
    luas: '11,20 Ha',
    kondisi: 'Baik',
    color: '#10b981',
    fillColor: '#10b981',
    positions: [
      [-7.1235, 112.1292],
      [-7.1230, 112.1322],
      [-7.1255, 112.1325],
      [-7.1260, 112.1295]
    ],
    center: [-7.1245, 112.1308]
  },
];

export default function PetaLeafletComponent() {
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
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            <span className="text-gray-700 font-medium">Belum Tanam</span>
          </div>
        </div>
      </div>

      {/* React Leaflet Map Container */}
      <MapContainer
        center={[-7.1236, 112.1265]}
        zoom={15}
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

        {LAHAN_PLOTS.map((plot) => (
          <Polygon
            key={plot.id}
            positions={plot.positions}
            pathOptions={{
              color: plot.color,
              fillColor: plot.fillColor,
              fillOpacity: 0.45,
              weight: 2.5,
            }}
          >
            <Tooltip permanent direction="center" className="custom-leaflet-tooltip font-sans bg-emerald-950/80 text-white border-0 shadow-md rounded px-2 py-1 text-center">
              <div className="text-center font-bold text-[11px] leading-tight text-white">{plot.kodeLahan}</div>
              <div className="text-[10px] text-gray-200">{plot.komoditas} - {plot.varietas}</div>
              <div className="text-[10px] font-semibold text-emerald-300">{plot.luas}</div>
            </Tooltip>
            <Popup>
              <div className="p-1 text-xs">
                <h5 className="font-bold text-gray-800 text-sm mb-1">{plot.kodeLahan} ({plot.lokasi})</h5>
                <p className="mb-0.5"><strong>Komoditas:</strong> {plot.komoditas}</p>
                <p className="mb-0.5"><strong>Varietas:</strong> {plot.varietas}</p>
                <p className="mb-0.5"><strong>Luas:</strong> {plot.luas}</p>
                <p className="mb-0"><strong>Kondisi:</strong> <span className="font-semibold">{plot.kondisi}</span></p>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}
