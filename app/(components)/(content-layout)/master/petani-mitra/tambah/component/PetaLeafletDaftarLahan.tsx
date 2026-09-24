"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LahanItem } from './ModalTambahLahan';

const Leaflet = (L as any)?.default || L;

interface MapBoundsUpdaterProps {
  items: LahanItem[];
  defaultCenter: [number, number];
}

function MapBoundsUpdater({ items, defaultCenter }: MapBoundsUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const validItems = (items || []).filter(
      (i) => typeof i.latitude === 'number' && typeof i.longitude === 'number' && !isNaN(i.latitude) && !isNaN(i.longitude)
    );

    if (validItems.length === 0) {
      map.setView(defaultCenter, 13);
      return () => clearTimeout(timer);
    }

    if (validItems.length === 1) {
      map.setView([validItems[0].latitude, validItems[0].longitude], 15);
    } else {
      if (Leaflet && Leaflet.latLngBounds) {
        const bounds = Leaflet.latLngBounds(validItems.map((i) => [i.latitude, i.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    }

    return () => clearTimeout(timer);
  }, [items, map, defaultCenter[0], defaultCenter[1]]);

  return null;
}

interface PetaLeafletDaftarLahanProps {
  lahanList: LahanItem[];
  heightClass?: string;
}

const createPinIcon = (color: string, index: number) => {
  if (!Leaflet || !Leaflet.divIcon) return undefined;
  return Leaflet.divIcon({
    className: 'custom-lahan-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
          <div style="transform: rotate(45deg); color: #ffffff; font-size: 11px; font-weight: bold; font-family: sans-serif;">
            ${index + 1}
          </div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function PetaLeafletDaftarLahan({
  lahanList = [],
  heightClass = 'h-[340px]',
}: PetaLeafletDaftarLahanProps) {
  const [mapType, setMapType] = useState<'street' | 'satellite'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const defaultCenter = useMemo<[number, number]>(() => {
    if (lahanList && lahanList.length > 0) {
      const first = lahanList[0];
      if (typeof first.latitude === 'number' && typeof first.longitude === 'number' && !isNaN(first.latitude) && !isNaN(first.longitude)) {
        return [first.latitude, first.longitude];
      }
    }
    return [-7.635200, 110.841200];
  }, [lahanList]);

  // Geocoding search
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=id&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        // Can be used if coordinates are handled
      }
    } catch (err) {
      console.error('Error searching location:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className={`relative w-full ${heightClass} rounded-lg overflow-hidden border border-defaultborder shadow-inner bg-slate-900`}
      style={{ height: '340px', width: '100%', minHeight: '340px' }}
    >
      {/* Top Search Bar */}
      <div className="absolute top-3 left-3 right-16 z-[1000]">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Cari lokasi di peta..."
            className="w-full bg-white/95 backdrop-blur-sm px-4 py-2 pl-9 rounded-md text-xs shadow-md border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <i className="ri-search-line absolute left-3 top-2.5 text-gray-400 text-xs"></i>
          {isSearching && (
            <i className="ri-loader-4-line animate-spin absolute right-3 top-2.5 text-emerald-600 text-xs"></i>
          )}
        </div>
      </div>

      {/* Layer Toggle (Peta / Satelit) */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-md border border-gray-200 flex text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMapType('street')}
          className={`px-3 py-1 rounded transition ${
            mapType === 'street'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Peta
        </button>
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1 rounded transition ${
            mapType === 'satellite'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Satelit
        </button>
      </div>

      {/* Coordinate Overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded text-[11px] font-mono shadow-md flex items-center gap-2">
        <i className="ri-map-pin-2-fill text-emerald-400 text-xs"></i>
        <span>
          Lat: {defaultCenter[0].toFixed(6)} | Long: {defaultCenter[1].toFixed(6)}
        </span>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%', minHeight: '340px' }}
      >
        <MapBoundsUpdater items={lahanList} defaultCenter={defaultCenter} />

        {mapType === 'street' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Markers for every registered Lahan (point only) */}
        {lahanList.map((item, idx) => {
          const pinColor = idx === 0 ? '#10b981' : idx === 1 ? '#0ea5e9' : '#f59e0b';
          const icon = createPinIcon(pinColor, idx);

          return (
            <Marker
              key={item.id || `${item.namaLahan}-${idx}`}
              position={[item.latitude, item.longitude]}
              {...(icon ? { icon } : {})}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-gray-800 text-xs">{item.namaLahan}</h4>
                  </div>
                  <div className="space-y-1 text-[11px] text-gray-600 border-t border-gray-100 pt-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Luas:</span>
                      <span className="font-semibold text-gray-800">{item.luas.toLocaleString('id-ID')} m²</span>
                    </div>
                    {item.komoditas && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Komoditas:</span>
                        <span className="font-semibold text-emerald-700">{item.komoditas}</span>
                      </div>
                    )}
                    {item.varietas && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Varietas:</span>
                        <span className="font-semibold text-gray-800">{item.varietas}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="badge bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 pt-1">
                      {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
