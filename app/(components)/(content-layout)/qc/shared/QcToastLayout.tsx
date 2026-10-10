"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** Layout halaman alur QC: menyediakan wadah notifikasi toast (aplikasi tidak memiliki container global). */
export default function QcToastLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* z-index di atas modal/pratinjau (z-[10000]) agar pesan error unduhan tetap terlihat. */}
      <ToastContainer position="top-right" autoClose={3000} newestOnTop style={{ zIndex: 10050 }} />
    </>
  );
}
