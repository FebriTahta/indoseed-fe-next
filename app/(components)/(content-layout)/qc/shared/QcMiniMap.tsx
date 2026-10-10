"use client";

import dynamic from "next/dynamic";

/** Peta mini satelit (hanya dirender di client karena pigeon-maps memakai window). */
const QcMiniMap = dynamic(() => import("./QcMiniMapInner"), {
  ssr: false,
  loading: () => <div className="h-[150px] rounded-lg bg-gray-100 animate-pulse" />,
});

export default QcMiniMap;
