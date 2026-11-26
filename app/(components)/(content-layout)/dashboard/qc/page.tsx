"use client";

import React from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import DashboardQcView from "./components/DashboardQcView";

const DashboardQcPage = () => (
  <>
    <Pageheader currentpage="Dashboard QC" activepage="QC & LAB" mainpage="Dashboard QC" />
    <DashboardQcView />
  </>
);

export default DashboardQcPage;
