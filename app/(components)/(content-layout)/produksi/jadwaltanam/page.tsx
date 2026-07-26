"use client"
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';


import { useJadwalTanams } from '@/app/hooks/useJadwalTanam';
import AddBtn from './component/AddBtn';
import Table from './component/Table';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from './component/FilterRow';
import DataTable from '../../shared/DataTable';

import { JadwalTanam,InformasiUmum, LahanKomoditas } from '@/app/types/jadwalTanam';
import EditBtn from './component/EditBtn';
import RemoveBtn from './component/RemoveBtn';
import DetailPanel, { DetailAction, TabConfig } from '../../shared/DetailPanel';

import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import SpkDatepickr from '@/shared/@spk-reusable-components/spk-packages/datepicker-component';
import Spkapexcharts from '@/shared/@spk-reusable-components/spk-packages/apexcharts-component';
import Spktables from '@/shared/@spk-reusable-components/tables/spk-tables';
import NoteCard from './component/NoteCard';
import Timeline from './component/TimeLine';
  
export default function JadwalTanamPage() {
  const {
      jadwalTanams,
      loading,
      error,
      search,
      setSearch,
      filterPeriode,
      setFilterPeriode,
      filterLahan,
      setFilterLahan,
      filterKomoditas,
      setFilterKomoditas,
      filterVarietas,
      setFilterVarietas,
      filterStatus,
      setFilterStatus,
      viewed,
      setViewed,
      isDetailLoading,
      setIsDetailLoading,
      activeDetailTab,
      setActiveDetailTab,
      currentPage,
      setCurrentPage,
      pageSize,
      setPageSize,
      totalRecords,
      setTotalRecords,
      totalPages,
      setTotalPages,
      kategoriOptions,
      commodityOptions,
      varietasOptions,
      statusOptions,
      isTableLoading,
      isModalOpen,
      setIsModalOpen,
      handleResetFilters,
      handleExportData,
      handleAdd,
      statItems
  } = useJadwalTanams();

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: '',
      onChange: (val: any) => { setFilterLahan(val); setCurrentPage(1); },
      options: kategoriOptions,
      placeholder: 'Pilih Lahan',
			title: 'Periode Tanam',
      widthClass: 'sm:w-48',
			type: 'date'
    },
		{
      value: filterLahan,
      onChange: (val: any) => { setFilterLahan(val); setCurrentPage(1); },
      options: kategoriOptions,
      placeholder: 'Pilih Lahan',
			title: 'Lahan',
      widthClass: 'sm:w-44',
			type: 'opsi'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => { setFilterKomoditas(val); setCurrentPage(1); },
      options: commodityOptions,
      placeholder: 'Pilih Komoditas',
			title: 'Komoditas',
      widthClass: 'sm:w-44',
			type: 'opsi'
    },
    {
      value: filterVarietas,
      onChange: (val: any) => { setFilterVarietas(val); setCurrentPage(1); },
      options: varietasOptions,
      placeholder: 'Pilih Varietas',
			title: 'Varietas',
      widthClass: 'sm:w-44',
			type: 'opsi'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Pilih Status',
			title: 'Status',
      widthClass: 'sm:w-40',
			type: 'opsi'
    },
  ];

  // Render Row for DataTable
  const renderTableRow = (item: JadwalTanam, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewed && viewed.kodeJadwalTanam === item.informasiUmum?.kodeJadwalTanam;
    return (
      <tr className="border-b border-defaultborder" key={item.informasiUmum?.kodeJadwalTanam}>
          <td>{index + 1}</td>
          <td>{item.informasiUmum?.kodeJadwalTanam}</td>
          <td>{item.lahanKomoditas?.komoditas}</td>
          <td>{item.lahanKomoditas?.varietas}</td>
					<td>{item.lahanKomoditas?.namaLahan}</td>
					<td>{item.lahanKomoditas?.luasTanam}</td>
					<td>{item.rencanaTanam?.tanggalTanam}</td>
					<td>{item.rencanaTanam?.perkiraanPanen}</td>
          <td>
              <span className={`badge ${item.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {item.status === 'Aktif' ? 'Active' : 'Non active'}
              </span>
          </td>
					<td>{item.informasiUmum?.penanggungJawab}</td>
          <td>
              <EditBtn id={item.informasiUmum?.kodeJadwalTanam} onClick={undefined} />
              <RemoveBtn id={item.informasiUmum?.kodeJadwalTanam} onClick={undefined} />
          </td>
      </tr>
    );
  };

  // Detail Panel Config
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'kontak', label: 'Kontak' },
    { id: 'riwayat', label: 'Riwayat Pembelian' },
    { id: 'note', label: 'Catatan' }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Jadwal', 'Komoditas', 'Varietas', 'Lahan', 'Luas (Ha)', 'Tanggal Tanam', 'Perkiraan Panen', 'Status', 'Penanggun Jawab', 'Aksi'];

//   const detailActions: DetailAction[] = viewed ? [
//     {
//       label: 'Edit Data',
//       onClick: () => handleOpenEditModal(viewed),
//       icon: 'ri-edit-line',
//       className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
//     },
//     {
//       label: viewed.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
//       onClick: () => handleToggleStatus(viewed),
//       icon: 'ri-shut-down-line',
//       className: viewed.status === 'Aktif'
//         ? 'border border-red-500 text-red-500 hover:bg-red-50'
//         : 'border border-success text-success hover:bg-emerald-50'
//     }
//   ] : [];

//   const renderDetailTabContent = (tabId: string) => {
//     if (!viewed) return null;
//     switch (tabId) {
//       case 'info':
//         return (
//           <DetailInfo viewed={viewed} />
//         );
//       case 'kondisi':
//         return (
//           <div className="space-y-4 py-2">
//             <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
//               <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
//                 <i className="ri-temp-hot-line text-lg text-red-500"></i> Suhu Udara
//               </span>
//               <span className="text-sm font-bold text-gray-800">27.8 °C</span>
//             </div>
//             <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
//               <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
//                 <i className="ri-contrast-drop-line text-lg text-blue-500"></i> Kelembapan Udara
//               </span>
//               <span className="text-sm font-bold text-gray-800">72%</span>
//             </div>
//             <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
//               <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
//                 <i className="ri-flask-line text-lg text-purple-500"></i> Keasaman Tanah (pH)
//               </span>
//               <span className="text-sm font-bold text-gray-800">6.4 pH</span>
//             </div>
//             <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
//               <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
//                 <i className="ri-pin-distance-line text-lg text-emerald-500"></i> Sistem Irigasi
//               </span>
//               <span className="text-xs font-semibold bg-success/15 text-success rounded px-2 py-0.5">Otomatis - Aktif</span>
//             </div>
//           </div>
//         );
//       case 'riwayat':
//         return (
//           <div className="space-y-3 text-xs py-1">
//             <p className="font-semibold text-gray-700 mb-2">Musim Panen Terakhir:</p>
//             <div className="border border-defaultborder rounded divide-y divide-defaultborder">
//               <div className="p-3 flex justify-between items-center">
//                 <div>
//                   <p className="font-bold text-gray-800">Musim Tanam II - Ceri</p>
//                   <span className="text-[10px] text-textmuted">Hasil panen melimpah</span>
//                 </div>
//                 <span className="font-bold text-emerald-600">950 Kg</span>
//               </div>
//               <div className="p-3 flex justify-between items-center">
//                 <div>
//                   <p className="font-bold text-gray-800">Musim Tanam I - Roma</p>
//                   <span className="text-[10px] text-textmuted">Panen akhir tahun 2025</span>
//                 </div>
//                 <span className="font-bold text-emerald-600">1.2 Ton</span>
//               </div>
//             </div>
//           </div>
//         );
//       case 'dokumen':
//         return (
//           <div className="space-y-3 py-1">
//             <div className="p-2.5 border border-defaultborder/60 hover:bg-gray-50 rounded flex items-center justify-between gap-3 text-xs cursor-pointer group">
//               <div className="flex items-center gap-2 overflow-hidden">
//                 <i className="ri-file-pdf-fill text-red-500 text-lg flex-shrink-0"></i>
//                 <span className="truncate font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Sertifikat Lahan Prima 1.pdf</span>
//               </div>
//               <i className="ri-download-line text-textmuted group-hover:text-emerald-600 text-sm"></i>
//             </div>
//             <div className="p-2.5 border border-defaultborder/60 hover:bg-gray-50 rounded flex items-center justify-between gap-3 text-xs cursor-pointer group">
//               <div className="flex items-center gap-2 overflow-hidden">
//                 <i className="ri-file-pdf-fill text-red-500 text-lg flex-shrink-0"></i>
//                 <span className="truncate font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">SOP Budidaya Tomat.pdf</span>
//               </div>
//               <i className="ri-download-line text-textmuted group-hover:text-emerald-600 text-sm"></i>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };
  

  if (error) {
      return <div className="p-4 text-center text-danger">{error}</div>;
  }

	
	// Site Referrals
	const Siteseries = [300, 450, 200, 150, 100]
	const Siteoptions = {
		chart: {
			height: 120,
			type: "donut",
		},
		labels: ["Search Engines", "Social Media", "Direct", "Referral Sites", "Email"],
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		colors: [
			"rgb(227, 84, 212)",
			"rgba(var(--primary-rgb))",
			"rgb(255, 93, 159)",
			"rgb(255, 142, 111)",
			"rgb(158, 92, 247)",
		],
		plotOptions: {
			pie: {
				expandOnClick: false,
				donut: {
					size: "55%",
					background: "transparent",
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: "20px",
							color: "#495057",
							offsetY: -4,
						},
						value: {
							show: true,
							fontSize: "18px",
							color: undefined,
							offsetY: 8,
							formatter: function (val) {
								return val + "%";
							},
						},
						total: {
							show: true,
							showAlways: true,
							label: "Total",
							fontSize: "22px",
							fontWeight: 600,
							color: "#495057",
						},
					},
				},
			},
		},
	}
  const series = [
    {
      name: "Padi",
      value: 45,
      area: 19.0,
      color: "#16a34a",
    },
    {
      name: "Jagung",
      value: 25,
      area: 10.62,
      color: "#2563eb",
    },
    {
      name: "Kedelai",
      value: 15,
      area: 6.37,
      color: "#4f46e5",
    },
    {
      name: "Kacang Hijau",
      value: 10,
      area: 4.25,
      color: "#d97706",
    },
    {
      name: "Sorgum",
      value: 5,
      area: 2.26,
      color: "#d1d5db",
    },
  ];

  const timelineData = [
    {
      title: "Akan Tanam",
      date: "01 - 07 Juni 2026",
      total: 7,
      color: "#F97316",
    },
    {
      title: "Sedang Berlangsung",
      date: "08 - 24 Juni 2026",
      total: 15,
      color: "#16A34A",
    },
    {
      title: "Menjelang Panen",
      date: "25 Juni - 05 Juli 2026",
      total: 4,
      color: "#F59E0B",
    },
    {
      title: "Selesai",
      date: "> 05 Juli 2026",
      total: 6,
      color: "#2563EB",
    },
  ];

  return (
    <Fragment>
        <Pageheader title="Produksi" 
          currentpage="Jadwal Tanam" 
          activepage="Jadwal Tanam" 
          mainpage="Jadwal Tanam" 
          description="Kelola dan atur jadwal tanam untuk setiap lahan produksi" 
          customButton={
              <SpkButton
                {...({
                  onclickfunc: handleAdd,
                  style: { backgroundColor: '#078836', color: 'white' },
                  className: "hover:bg-[#06732d] hover:text-white",
                  customClass: "ti-btn !border-0 btn-wave !me-0 flex items-center gap-1.5"
                } as any)}
              >
                <i className="ri-add-line text-lg"></i> Buat Jadwal Tanam Baru
              </SpkButton>
            } />

					<div className="grid grid-cols-12">

						<div className="col-span-12">
							{/* Filters Bar */}
							<FilterRow
								search={search}
								onSearchChange={(val) => { setSearch(val); }}
								searchPlaceholder="Cari gudang..."
								selectFilters={filterConfig}
								onSearch={undefined}
								onReset={handleResetFilters}
							/>
						</div>
						
					</div>

						
        
        {/* Summary Cards */}
        <StatsWidgets items={statItems} />

        <div className="grid grid-cols-12 gap-x-6">
          {/* Left Side (Table & Filters) */}
          <div className="xl:col-span-9 col-span-12">
            
  
            {/* Table list with pagination */}
            <DataTable
              headers={tableHeaders}
              items={jadwalTanams}
              renderRow={renderTableRow}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              totalRecords={totalRecords}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              emptyMessage="Tidak ada data customer yang cocok dengan filter pencarian."
              isLoading={loading}
            />

            <Timeline items={timelineData}  />
          </div>
  
          {/* Right Side (Detail Panel) */}
          <div className="xl:col-span-3 col-span-12">
              <div className="box">
									<div className="box-header">
											<div className="box-title">
													Kalender Jadwal Tanam
											</div>
									</div>
									<div className="box-body">
											<div className="form-group overflow-auto">
													<SpkDatepickr className="form-control" Inline={true} selected={undefined} onChange={undefined} minDate={undefined} maxDate={undefined} Timeinput={undefined} isClearable={undefined} Iconvisible={undefined} showTimeSelectOnly={undefined} showTimeInput={undefined} Localtime={undefined} Caption={undefined} Yearpicker={undefined} selectsRange={undefined} startDate={undefined} endDate={undefined}/>
											</div>
									</div>
							</div>

							<div className="box">
									<div className="box-header justify-between">
											<div className="box-title">
													Ringkasan per Komoditas
											</div>
									</div>
									<div className="box-body sm:flex items-center">
                    <div className="flex items-center gap-8">

                      <Spkapexcharts
                          chartOptions={Siteoptions}
                          chartSeries={Siteseries}
                          type="donut"
                          width={140}
                          height={140}
                      />

                      <div className="flex flex-col gap-3 w-60">
                          {series.map((item, index) => (
                              <div
                                  key={item.name}
                                  className="flex items-center justify-between"
                              >
                                  <div className="flex items-center gap-3">
                                      <span
                                          className="w-3 h-3 rounded"
                                          style={{ background: item.color }}
                                      />
                                      <span>{item.name}</span>
                                  </div>

                                  <span className="font-medium text-gray-600">
                                      {item.area}% ({item.area} Ha)
                                  </span>
                              </div>
                          ))}
                      </div>

                  </div>
											{/* <div id="referrals-chart" className="p-4 flex-shrink-0 px-0">
													<Spkapexcharts chartOptions={Siteoptions} chartSeries={Siteseries} type="donut" width={120} height={120} />
											</div>
											<div className="table-responsive overflow-auto table-bordered-default">
													<table className="ti-custom-table custom-table1 text-nowrap" >
															<tr>
																	<td>Padi</td>
																	<td className="text-center font-medium">300</td>
																	<td className="text-success">+5.2%</td>
															</tr>
															<tr>
																	<td>Social Media</td>
																	<td className="text-center font-medium">450</td>
																	<td className="text-success">+10.3%</td>
															</tr>
															<tr>
																	<td>Direct</td>
																	<td className="text-center font-medium">200</td>
																	<td className="text-success">+2.5%</td>
															</tr>
															<tr>
																	<td>Referral Sites</td>
																	<td className="text-center font-medium">150</td>
																	<td className="text-danger">-1.2%</td>
															</tr>
															<tr>
																	<td>Email</td>
																	<td className="text-center font-medium">100</td>
																	<td className="text-success">+3.8%</td>
															</tr>
                            </table>
											</div> */}
									</div>
							</div>

              <NoteCard description='Pastikan seluruh jadwal tanam diverifikasi dan laham dalam kondisi siap tanam' />
					</div>
        </div>

    </Fragment>
  );
}
