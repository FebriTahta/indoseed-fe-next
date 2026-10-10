"use client";

import React from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import QcPageHeader from "../shared/QcPageHeader";
import AuditTrailList from "./components/AuditTrailList";
import { useAuditTrail } from "@/app/hooks/useAuditTrail";

const AuditTrailPage = () => {
  const state = useAuditTrail();

  return (
    <>
      <Pageheader currentpage="Audit Trail" activepage="Quality Control" mainpage="Audit Trail" />

      <QcPageHeader
        title="Audit Trail"
        description="Lacak semua aktivitas dan perubahan data pada sistem untuk memastikan transparansi dan akuntabilitas."
        icon="ri-history-line"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        actionButtons={
          <button type="button" onClick={state.exportCsv} disabled={state.exporting} className={buttonClass("secondary")}>
            <i className={state.exporting ? "ri-loader-4-line animate-spin" : "ri-download-2-line"}></i>
            {state.exporting ? "Mengekspor..." : "Export CSV"}
          </button>
        }
      />

      <AuditTrailList state={state} />
    </>
  );
};

export default AuditTrailPage;
