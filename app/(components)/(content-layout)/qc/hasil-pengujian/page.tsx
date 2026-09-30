"use client";

import React from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import HasilPengujianList from "./components/HasilPengujianList";

const HasilPengujianPage = () => {
  return (
    <div>
      <Pageheader currentpage="Hasil Pengujian" activepage="QC & LAB" mainpage="Hasil Pengujian" />
      <div className="mt-4">
        <HasilPengujianList />
      </div>
    </div>
  );
};

export default HasilPengujianPage;
