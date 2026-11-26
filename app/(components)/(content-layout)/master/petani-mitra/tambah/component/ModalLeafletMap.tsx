"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, CircleMarker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Leaflet = (L as any)?.default || L;
const MapContainerAny = MapContainer as any;
const TileLayerAny = TileLayer as any;
const PolygonAny = Polygon as any;
const CircleMarkerAny = CircleMarker as any;
const MarkerAny = Marker as any;

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
    <MarkerAny
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      {...(customPinIcon ? { icon: customPinIcon } : {})}
    />
  );
}

function MapControls({ onLocate }: { onLocate: () => void }) {
  const map = useMap();
  return (
    <div className="absolute right-2.5 top-12 z-[1000] flex flex-col gap-1 shadow-md">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        className="w-7 h-7 bg-white/95 hover:bg-gray-100 text-gray-700 rounded-t border border-gray-200 flex items-center justify-center text-xs font-bold transition"
        title="Zoom In"
      >
        <i className="ri-add-line"></i>
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        className="w-7 h-7 bg-white/95 hover:bg-gray-100 text-gray-700 rounded-b border-x border-b border-gray-200 flex items-center justify-center text-xs font-bold transition"
        title="Zoom Out"
      >
        <i className="ri-subtract-line"></i>
      </button>
      <button
        type="button"
        onClick={onLocate}
        className="w-7 h-7 mt-1.5 bg-white/95 hover:bg-emerald-50 text-emerald-700 rounded border border-gray-200 flex items-center justify-center text-xs font-bold transition shadow-xs"
        title="Gunakan Lokasi Saya"
      >
        <i className="ri-crosshair-2-line"></i>
      </button>
    </div>
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
  heightClass = 'h-[270px]',
}: ModalLeafletMapProps) {
  const [mapType, setMapType] = useState<'street' | 'satellite'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const position: [number, number] = [
    typeof latitude === 'number' && !isNaN(latitude) ? latitude : -7.635200,
    typeof longitude === 'number' && !isNaN(longitude) ? longitude : 110.841200,
  ];

  // Plot polygon around center coordinates (farm parcel aesthetic)
  const plotPolygon = useMemo(() => {
    const lat = position[0];
    const lng = position[1];
    const r = 0.00045;
    return [
      [lat + r * 0.9, lng - r * 0.7],
      [lat + r * 0.7, lng + r * 0.8],
      [lat - r * 0.4, lng + r * 1.1],
      [lat - r * 0.9, lng + r * 0.3],
      [lat - r * 0.6, lng - r * 0.9],
    ] as [number, number][];
  }, [position[0], position[1]]);

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

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung geolokasi');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error('Error getting location:', err);
        alert('Gagal mendeteksi lokasi saat ini. Pastikan izin lokasi aktif.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-gray-200 shadow-inner`}
      style={{ height: '270px', width: '100%', minHeight: '270px' }}
    >
      {/* Search Bar Overlay */}
      <div className="absolute top-2.5 left-2.5 right-12 z-[1000] flex items-center bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 px-3 py-1.5">
        <i className="ri-search-line text-gray-400 text-xs mr-2"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Cari lokasi di peta..."
          className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
        />
        {isSearching && (
          <i className="ri-loader-4-line animate-spin text-emerald-600 text-xs mr-1"></i>
        )}
        <button
          type="button"
          onClick={() => handleSearch()}
          className="text-gray-400 hover:text-emerald-700 transition"
          title="Cari"
        >
          <i className="ri-arrow-right-line text-xs font-bold text-emerald-600"></i>
        </button>
      </div>

      {/* Layer Switcher (Peta / Satelit) */}
      <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-white/95 backdrop-blur-sm p-0.5 rounded-md shadow-md border border-gray-200 flex text-[10px] font-semibold">
        <button
          type="button"
          onClick={() => setMapType('street')}
          className={`px-2 py-0.5 rounded transition ${
            mapType === 'street'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Peta
        </button>
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-2 py-0.5 rounded transition ${
            mapType === 'satellite'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Satelit
        </button>
      </div>

      {/* Coordinate Indicator Overlay */}
      <div className="absolute bottom-2.5 right-2.5 z-[1000] bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono shadow-md flex items-center gap-1">
        <i className="ri-map-pin-2-fill text-emerald-400 text-[10px]"></i>
        <span>
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </span>
      </div>

      <MapContainerAny
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%', minHeight: '270px' }}
      >
        <MapUpdater center={position} />
        <MapControls onLocate={handleLocateMe} />

        {mapType === 'street' ? (
          <TileLayerAny
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayerAny
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Boundary Polygon representing Agricultural Land Parcel */}
        <PolygonAny
          positions={plotPolygon}
          pathOptions={{
            color: '#ffffff',
            weight: 2,
            dashArray: '4, 4',
            fillColor: '#10b981',
            fillOpacity: 0.35,
          }}
        />

        {/* Vertex dots */}
        {plotPolygon.map((pt, idx) => (
          <CircleMarkerAny
            key={idx}
            center={pt}
            radius={3.5}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#10b981',
              fillOpacity: 1,
              weight: 1.5,
            }}
          />
        ))}

        <LocationMarker position={position} onChange={onChange} />
      </MapContainerAny>
    </div>
  );
}
