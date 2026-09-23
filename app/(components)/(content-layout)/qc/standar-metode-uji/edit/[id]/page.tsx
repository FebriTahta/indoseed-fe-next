"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MetodeUjiForm from '../../components/MetodeUjiForm';
import { qcService } from '@/app/services/qcService';

export default function EditMetodeUjiPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      qcService.getMethodById(id).then(res => {
        if (res.data) {
          setData(res.data);
        }
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching method", err);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Data tidak ditemukan</div>;
  }

  return (
    <div className="w-full">
      <MetodeUjiForm mode="edit" initialData={data} />
    </div>
  );
}
