"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Leaflet = (L as any)?.default || L;

const customPinIcon = Leaflet?.divIcon ? Leaflet.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
        <div style="width: 10px; height: 10px; background-color: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
}) : undefined;

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.setView(center, map.getZoom());
    }, 200);
    return () => clearTimeout(timer);
  }, [center[0], center[1], map]);
  return null;
}

function LocationMarker({
  position,
  onChange,
}: {
  position: [number, number];
  onChange: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<any>(null);

  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latlng = marker.getLatLng();
          onChange(latlng.lat, latlng.lng);
        }
      },
    }),
    [onChange]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      {...(customPinIcon ? { icon: customPinIcon } : {})}
    />
  );
}

interface ModalLeafletMapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  heightClass?: string;
}

export default function ModalLeafletMap({
  latitude,
  longitude,
  onChange,
  heightClass = 'h-[280px]',
}: ModalLeafletMapProps) {
  const [mapType, setMapType] = useState<'street' | 'satellite'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const position: [number, number] = [
    typeof latitude === 'number' && !isNaN(latitude) ? latitude : -7.635200,
    typeof longitude === 'number' && !isNaN(longitude) ? longitude : 110.841200,
  ];

  // Geocoding search via Nominatim
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
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onChange(lat, lng);
      }
    } catch (err) {
      console.error('Error searching location:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className={`relative w-full ${heightClass} rounded-lg overflow-hidden border border-defaultborder shadow-inner`}
      style={{ height: '280px', width: '100%', minHeight: '280px' }}
    >
      {/* Search Bar Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Cari lokasi, desa, atau kecamatan..."
            className="w-full bg-white/95 backdrop-blur-sm px-3.5 py-1.5 pl-8 rounded-md text-xs shadow-md border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <i className="ri-search-line absolute left-2.5 top-2 text-gray-400 text-xs"></i>
          {isSearching && (
            <i className="ri-loader-4-line animate-spin absolute right-2.5 top-2 text-emerald-600 text-xs"></i>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleSearch()}
          className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-md hover:bg-emerald-700 transition"
        >
          Cari
        </button>
      </div>

      {/* Layer Switcher (Peta / Satelit) */}
      <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-md border border-gray-200 flex text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMapType('street')}
          className={`px-2.5 py-1 rounded transition ${
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
          className={`px-2.5 py-1 rounded transition ${
            mapType === 'satellite'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Satelit
        </button>
      </div>

      {/* Coordinate Indicator Overlay */}
      <div className="absolute bottom-2.5 right-2.5 z-[1000] bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-mono shadow-md flex items-center gap-1.5">
        <i className="ri-map-pin-2-fill text-emerald-400 text-xs"></i>
        <span>
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </span>
      </div>

      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%', minHeight: '280px' }}
      >
        <MapUpdater center={position} />
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
        <LocationMarker position={position} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
