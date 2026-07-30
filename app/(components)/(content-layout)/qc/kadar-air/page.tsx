"use client"
import React, { useState, useEffect } from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import { AddButton, ExportButton } from '../../shared/ActionButtons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import CreateKadarAirModal from './CreateKadarAirModal';
import FilterSection from './FilterSection';
import { qcService } from '@/app/services/qcService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { qcKadarAirService } from '@/app/services/qcKadarAirService';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function KadarAirPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [methods, setMethods] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);

  const fetchData = () => {
    qcKadarAirService.getKadarAir().then(res => setTests(res.data || [])).catch(console.error);
  };

  useEffect(() => {
    qcService.getMethods().then(res => setMethods(res.data || [])).catch(console.error);
    commodityService.getCommodities({}).then(res => setCommodities(res.data || [])).catch(console.error);
    varietyService.getVarieties({}).then(res => setVarieties(res.data || [])).catch(console.error);
    fetchData();
  }, []);

  const statItems: StatItem[] = [
    {
      title: "Total Batch Diuji",
      value: "58",
      subtitle: "Batch",
      icon: "ri-drop-line",
      bgColor: "bg-info/10",
      textColor: "text-info"
    },
    {
      title: "Total Sampel",
      value: "116",
      subtitle: "Sampel",
      icon: "ri-flask-line",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      title: "Rata-rata Kadar Air",
      value: "12,45 %",
      subtitle: "Dari semua sampel",
      icon: "ri-drop-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Memenuhi Standar",
      value: "98",
      subtitle: "84,48%",
      icon: "ri-checkbox-circle-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Mendekati Batas",
      value: "15",
      subtitle: "12,93%",
      icon: "ri-time-line",
      bgColor: "bg-warning/10",
      textColor: "text-warning"
    },
    {
      title: "Tidak Memenuhi",
      value: "3",
      subtitle: "2,59%",
      icon: "ri-close-circle-line",
      bgColor: "bg-danger/10",
      textColor: "text-danger"
    }
  ];

  // Charts Configs
  const ringkasanOptions: any = {
    chart: { type: 'donut' },
    labels: ['Memenuhi (≤ 13%)', 'Mendekati (13 - 14%)', 'Tidak Memenuhi (> 14%)'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '12px' }, value: { show: true, fontSize: '24px', fontWeight: 600 }, total: { show: true, label: 'Sampel', formatter: () => '116' } } } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 }
  };
  const ringkasanSeries = [84.48, 12.93, 2.59];

  const trenOptions: any = {
    chart: { type: 'line', toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ['#10b981'],
    stroke: { curve: 'smooth', width: [2] },
    xaxis: { categories: ['01/06', '06/06', '11/06', '16/06', '21/06', '26/06', '30/06'], labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, max: 20, labels: { style: { colors: '#9ca3af', fontSize: '11px' } } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    markers: { size: 4, colors: ['#fff'], strokeColors: ['#10b981'], strokeWidth: 2, hover: { size: 6 } },
    legend: { show: true, position: 'bottom' },
    tooltip: { theme: 'light' }
  };
  const trenSeries = [
    { name: 'Rata-rata Kadar Air (%)', data: [15, 12, 10, 14, 11, 13, 12] }
  ];

  const handleSelectRow = (row: any) => {
    setSelectedTest(row);
  };

  return (
    <>
      <Seo title="Kadar Air" />
      <Pageheader currentpage="Kadar Air" activepage="Quality Control (QC)" mainpage="Kadar Air" />
      <ToastContainer />

      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-bold text-xl text-gray-800 mb-1">Kadar Air</h4>
          <p className="text-sm text-gray-500">Kelola dan pantau hasil uji kadar air benih untuk memastikan kesesuaian dengan standar mutu.</p>
        </div>
        <div className="flex gap-2">
          <AddButton onClick={() => setIsCreateModalOpen(true)} label="Tambah Uji Baru" />
          <ExportButton />
        </div>
      </div>

      <StatsWidgets items={statItems} columns={6} />

      <FilterSection methods={methods} commodities={commodities} varieties={varieties} />

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Daftar Hasil Uji Kadar Air</h5>
            </div>
            <div className="box-body p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">No</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Kode Batch</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Komoditas</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Varietas</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Lot / Sampel</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Tanggal Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Metode Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Kadar Air (%)</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Status</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((row, idx) => (
                      <tr key={idx} onClick={() => handleSelectRow(row)} className={`border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer ${selectedTest?.id === row.id ? 'bg-primary/5' : ''}`}>
                        <td className="text-sm py-2 px-4">{idx + 1}</td>
                        <td className="text-sm font-medium text-primary py-2 px-4">{row.kodeBatch}</td>
                        <td className="text-sm py-2 px-4">{row.commodity?.namaKomoditas || '-'}</td>
                        <td className="text-sm py-2 px-4">{row.variety?.namaVarietas || '-'}</td>
                        <td className="text-sm py-2 px-4">{row.lotNumber || '-'}</td>
                        <td className="text-sm py-2 px-4">{row.tanggalUji ? new Date(row.tanggalUji).toLocaleDateString() : '-'}</td>
                        <td className="text-sm py-2 px-4">{row.testMethod?.nama || '-'}</td>
                        <td className="text-sm py-2 px-4 font-semibold">{row.kadarAir?.toFixed(1).replace('.',',')}</td>
                        <td className="py-2 px-4">
                          <span className={`badge ${row.status === 'Memenuhi' ? 'bg-success/10 text-success' : row.status === 'Mendekati' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center flex justify-center gap-1">
                          <button className="text-gray-400 hover:text-primary transition-colors" title="Lihat Detail"><i className="ri-eye-line text-lg"></i></button>
                          <button className="text-gray-400 hover:text-primary transition-colors" title="Download"><i className="ri-download-2-line text-lg"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="box-footer border-t border-gray-100 p-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Menampilkan 1 - 10 dari 58 data</span>
              <div className="flex items-center gap-2">
                <select className="form-select text-sm h-[38px] py-1 px-2 border-gray-200"><option>10 / halaman</option></select>
                <div className="flex gap-1">
                  <button className="btn btn-sm btn-light p-1 px-2"><i className="ri-arrow-left-s-line"></i></button>
                  <button className="btn btn-sm btn-primary bg-[#1B4E3B] text-white p-1 px-2">1</button>
                  <button className="btn btn-sm btn-light p-1 px-2">2</button>
                  <button className="btn btn-sm btn-light p-1 px-2">3</button>
                  <button className="btn btn-sm btn-light p-1 px-2">...</button>
                  <button className="btn btn-sm btn-light p-1 px-2">6</button>
                  <button className="btn btn-sm btn-light p-1 px-2"><i className="ri-arrow-right-s-line"></i></button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="box shadow-sm">
              <div className="box-header border-b border-gray-100 flex justify-between items-center">
                <h5 className="box-title text-base font-semibold">Tren Rata-rata Kadar Air (%)</h5>
                <select className="form-select text-xs py-1"><option>30 Hari Terakhir</option></select>
              </div>
              <div className="box-body p-4">
                <div id="tren-chart">
                  <ReactApexChart options={trenOptions} series={trenSeries} type="line" height={200} />
                </div>
              </div>
            </div>
            <div className="box shadow-sm">
              <div className="box-header border-b border-gray-100 flex justify-between items-center">
                <h5 className="box-title text-base font-semibold">Top 5 Komoditas (Rata-rata Kadar Air)</h5>
              </div>
              <div className="box-body p-4">
                 <div className="space-y-4">
                   {/* Dummy Top 5 */}
                   <div><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-gray-600">Jagung</span><span className="font-bold">14,51%</span></div><div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"><div className="bg-success h-full" style={{width: '90%'}}></div></div></div>
                   <div><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-gray-600">Padi</span><span className="font-bold">12,28%</span></div><div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"><div className="bg-success h-full" style={{width: '80%'}}></div></div></div>
                   <div><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-gray-600">Kedelai</span><span className="font-bold">9,87%</span></div><div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"><div className="bg-success h-full" style={{width: '60%'}}></div></div></div>
                   <div><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-gray-600">Kacang Hijau</span><span className="font-bold">8,96%</span></div><div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"><div className="bg-success h-full" style={{width: '50%'}}></div></div></div>
                   <div><div className="flex justify-between text-xs mb-1"><span className="font-semibold text-gray-600">Kacang Tanah</span><span className="font-bold">8,21%</span></div><div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden"><div className="bg-success h-full" style={{width: '45%'}}></div></div></div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100 flex justify-between items-center">
              <h5 className="box-title text-base font-semibold">Ringkasan Kadar Air</h5>
              <span className="text-[10px] text-gray-400">Update terakhir: 11/06/2026 14:30 WIB</span>
            </div>
            <div className="box-body p-4">
              <div className="flex items-center justify-between">
                <div className="w-1/2">
                  <div id="ringkasan-chart">
                    <ReactApexChart options={ringkasanOptions} series={ringkasanSeries} type="donut" height={150} />
                  </div>
                </div>
                <div className="w-1/2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-success"></span>
                      <span className="text-xs text-gray-600">Memenuhi (≤ 13%)</span>
                    </div>
                    <span className="text-xs font-bold">98 <span className="text-gray-400 font-normal">(84,48%)</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-warning"></span>
                      <span className="text-xs text-gray-600">Mendekati (13 - 14%)</span>
                    </div>
                    <span className="text-xs font-bold">15 <span className="text-gray-400 font-normal">(12,93%)</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-danger"></span>
                      <span className="text-xs text-gray-600">Tidak Memenuhi (&gt; 14%)</span>
                    </div>
                    <span className="text-xs font-bold">3 <span className="text-gray-400 font-normal">(2,59%)</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100 flex justify-between items-center">
              <h5 className="box-title text-base font-semibold">Parameter & Standar (ISTA)</h5>
            </div>
            <div className="box-body p-0">
               <table className="table min-w-full whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr><th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Komoditas</th><th className="text-right text-xs font-semibold text-gray-500 py-2 px-4">Kadar Air Maksimal (%)</th></tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50"><td className="text-sm py-2 px-4 font-medium">Padi</td><td className="text-sm py-2 px-4 text-right">13,0</td></tr>
                    <tr className="border-b border-gray-50"><td className="text-sm py-2 px-4 font-medium">Jagung</td><td className="text-sm py-2 px-4 text-right">14,0</td></tr>
                    <tr className="border-b border-gray-50"><td className="text-sm py-2 px-4 font-medium">Kedelai</td><td className="text-sm py-2 px-4 text-right">13,0</td></tr>
                    <tr className="border-b border-gray-50"><td className="text-sm py-2 px-4 font-medium">Kacang Hijau</td><td className="text-sm py-2 px-4 text-right">12,0</td></tr>
                    <tr><td className="text-sm py-2 px-4 font-medium">Kacang Tanah</td><td className="text-sm py-2 px-4 text-right">10,0</td></tr>
                  </tbody>
               </table>
               <div className="p-3 border-t border-gray-100 text-xs text-gray-500">Sumber: ISTA Rules 2024</div>
            </div>
          </div>
          
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Dokumentasi Terbaru</h5>
            </div>
            <div className="box-body p-4 space-y-3">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="text-danger p-2"><i className="ri-file-pdf-line text-xl"></i></div>
                <div className="flex-1"><p className="text-xs font-semibold mb-0">Laporan Uji Kadar Air QC-2606-0001</p><p className="text-[10px] text-gray-400">PDF - 245 KB</p></div>
                <button className="text-gray-400 hover:text-primary"><i className="ri-download-2-line"></i></button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="text-danger p-2"><i className="ri-file-pdf-line text-xl"></i></div>
                <div className="flex-1"><p className="text-xs font-semibold mb-0">Prosedur Uji Kadar Air (Oven Method)</p><p className="text-[10px] text-gray-400">PDF - 198 KB</p></div>
                <button className="text-gray-400 hover:text-primary"><i className="ri-download-2-line"></i></button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="text-danger p-2"><i className="ri-file-pdf-line text-xl"></i></div>
                <div className="flex-1"><p className="text-xs font-semibold mb-0">Sertifikat QC Batch BP-2606-0001</p><p className="text-[10px] text-gray-400">PDF - 312 KB</p></div>
                <button className="text-gray-400 hover:text-primary"><i className="ri-download-2-line"></i></button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-success/5 border border-success/20 rounded-md flex gap-3 text-sm text-gray-600">
            <i className="ri-information-line text-success text-lg mt-0.5"></i>
            <p>Uji kadar air mengikuti standar ISTA Rules dan ISO 665:2020 (Seed Determination of Moisture Content).</p>
          </div>

        </div>
      </div>

      {isCreateModalOpen && <CreateKadarAirModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={() => { fetchData(); toast.success('Berhasil menyimpan data Uji Kadar Air!'); }} methods={methods} commodities={commodities} varieties={varieties} />}
    </>
  );
}
