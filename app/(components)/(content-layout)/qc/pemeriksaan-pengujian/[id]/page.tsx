"use client";

import React from "react";
import PemeriksaanForm from "../components/PemeriksaanForm";

const PemeriksaanDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  return (
    <>
      <PemeriksaanForm id={id} />
    </>
  );
};

export default PemeriksaanDetailPage;
