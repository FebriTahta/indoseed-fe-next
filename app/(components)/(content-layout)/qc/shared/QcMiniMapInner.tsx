"use client";

import React from "react";
import { Map as PigeonMap, Marker as PigeonMarker } from "pigeon-maps";

/** Citra satelit Esri World Imagery (tanpa API key). */
const satelliteProvider = (x: number, y: number, z: number) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;

export interface QcMiniMapProps {
  lat: number;
  lng: number;
  height?: number;
  zoom?: number;
}

/** Peta mini satelit dengan satu penanda lokasi. */
export default function QcMiniMapInner({ lat, lng, height = 150, zoom = 16 }: QcMiniMapProps) {
  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-100" style={{ height }}>
      <PigeonMap provider={satelliteProvider} defaultCenter={[lat, lng]} defaultZoom={zoom} height={height} mouseEvents touchEvents attribution={<span>Imagery © Esri</span>}>
        <PigeonMarker anchor={[lat, lng]} width={36} color="#2563eb" />
      </PigeonMap>
      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Buka peta penuh"
        className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-md shadow flex items-center justify-center text-gray-700 hover:bg-white"
      >
        <i className="ri-fullscreen-line text-sm"></i>
      </a>
    </div>
  );
}
