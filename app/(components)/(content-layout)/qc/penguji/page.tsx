"use client";

import React from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import PengujiList from "./components/PengujiList";

const PengujiPage = () => (
  <>
    <Pageheader currentpage="Penguji" activepage="Quality Control (QC)" mainpage="Penguji" />
    <PengujiList />
  </>
);

export default PengujiPage;
