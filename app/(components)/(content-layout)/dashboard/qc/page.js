"use client"
import React, { Fragment, useState } from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";

const DashboardQC = () => {
    // Mock Data for Top Cards
    const summaryCards = [
        { title: "TOTAL SAMPEL", value: "136", unit: "Sampel", percent: "18.8%", trend: "up", icon: "ri-flask-line", color: "primary" },
        { title: "UJI SELESAI", value: "102", unit: "Sampel", percent: "22.1%", trend: "up", icon: "ri-clipboard-line", color: "info" },
        { title: "UJI PROSES", value: "24", unit: "Sampel", percent: "4.3%", trend: "up", icon: "ri-time-line", color: "warning" },
        { title: "UJI TIDAK LULUS", value: "10", unit: "Sampel", percent: "2.1%", trend: "down", icon: "ri-close-circle-line", color: "danger" },
        { title: "TINGKAT KELULUSAN", value: "90.2%", unit: "Lulus", percent: "3.6%", trend: "up", icon: "ri-checkbox-circle-line", color: "success" },
        { title: "SERTIFIKAT DITERBITKAN", value: "28", unit: "Sertifikat", percent: "16.7%", trend: "up", icon: "ri-file-paper-2-line", color: "warning" },
    ];

    // Mock Data for Charts
    const ringkasanHasilSeries = [122, 10, 4];
    const ringkasanHasilOptions = {
        chart: { type: 'donut', height: 250 },
        labels: ['Lulus', 'Tidak Lulus', 'Proses'],
        colors: ['#22c55e', '#ef4444', '#eab308'],
        plotOptions: {
            pie: { donut: { size: '75%', labels: { show: true, name: { show: true }, value: { show: true } } } }
        },
        dataLabels: { enabled: false },
        legend: { show: false }
    };

    const hasilPerParameterSeries = [
        { name: 'Lulus (%)', data: [92.1, 88.3, 91.6, 87.5, 92.7] },
        { name: 'Tidak Lulus (%)', data: [7.9, 11.7, 8.4, 12.5, 7.3] }
    ];
    const hasilPerParameterOptions = {
        chart: { type: 'bar', height: 250, stacked: false },
        colors: ['#22c55e', '#ef4444'],
        plotOptions: { bar: { columnWidth: '40%', borderRadius: 2 } },
        xaxis: { categories: ['Daya Tumbuh', 'Kadar Air', 'Kemurnian', 'Vigor', 'Uji Lab'] },
        dataLabels: { enabled: false },
        legend: { position: 'top', horizontalAlign: 'left' }
    };

    const trendKelulusanSeries = [{ name: 'Tingkat Kelulusan (%)', data: [83.2, 85.1, 87.3, 89.6, 90.2] }];
    const trendKelulusanOptions = {
        chart: { type: 'line', height: 250 },
        colors: ['#22c55e'],
        stroke: { width: 3, curve: 'smooth' },
        markers: { size: 4 },
        xaxis: { categories: ['1-5 Jun', '6-10 Jun', '11-14 Jun', '15-20 Jun', '21-25 Jun'] },
        dataLabels: { enabled: true, offsetY: -10, style: { fontSize: '10px' } },
    };

    // Table Data
    const tableData = [
        { id: "SMP-2406-001", produk: "Padi IR64", batch: "BCH-2406-001", param: "Daya Tumbuh", penguji: "Budi Santoso", tgl: "14/06/2024", status: "Selesai", hasil: "Lulus", badge: "success", text: "success" },
        { id: "SMP-2406-002", produk: "Padi Ciherang", batch: "BCH-2406-002", param: "Kadar Air", penguji: "Ani Wulandari", tgl: "14/06/2024", status: "Selesai", hasil: "Lulus", badge: "success", text: "success" },
        { id: "SMP-2406-003", produk: "Tomat Servo", batch: "BCH-2406-003", param: "Kemurnian", penguji: "Rudi Hartono", tgl: "13/06/2024", status: "Selesai", hasil: "Tidak Lulus", badge: "danger", text: "danger" },
        { id: "SMP-2406-004", produk: "Cabai Lado F1", batch: "BCH-2406-004", param: "Vigor", penguji: "Budi Santoso", tgl: "13/06/2024", status: "Proses", hasil: "-", badge: "warning", text: "warning" },
        { id: "SMP-2406-005", produk: "Sawi Caisim", batch: "BCH-2406-005", param: "Uji Lab", penguji: "Ani Wulandari", tgl: "12/06/2024", status: "Selesai", hasil: "Lulus", badge: "success", text: "success" },
    ];

    return (
        <Fragment>
            <Seo title="Dashboard QC" />
            <Pageheader title="Dashboard QC" currentpage="Quality Control" activepage="Dashboard QC" />

            {/* Filter Section (Simulated) */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h5 className="text-lg font-semibold dark:text-white">Ringkasan aktivitas Quality Control secara real-time</h5>
                </div>
                <div className="flex gap-2">
                    <button type="button" className="ti-btn ti-btn-outline-light bg-white dark:bg-bodybg">
                        <i className="ri-calendar-line"></i> 01/06/2024 - 14/06/2024
                    </button>
                    <button type="button" className="ti-btn ti-btn-success text-white">
                        <i className="ri-filter-3-line"></i> Filter
                    </button>
                </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-12 gap-x-6">
                {summaryCards.map((card, idx) => (
                    <div className="col-span-12 md:col-span-4 xl:col-span-2" key={idx}>
                        <div className="box">
                            <div className="box-body flex items-center justify-between p-4">
                                <div>
                                    <span className="text-textmuted text-[12px] font-semibold mb-1 block">{card.title}</span>
                                    <h4 className="font-bold text-[22px] mb-1">{card.value}</h4>
                                    <span className="text-[12px] text-textmuted block mb-2">{card.unit}</span>
                                    <div className="flex items-center text-[12px]">
                                        <span className={`text-${card.trend === 'up' ? 'success' : 'danger'} font-semibold flex items-center`}>
                                            <i className={`ri-arrow-${card.trend}-s-fill text-[14px]`}></i> {card.percent}
                                        </span>
                                        <span className="ms-1 text-textmuted">dari periode lalu</span>
                                    </div>
                                </div>
                                <div className={`avatar avatar-md bg-${card.color}/10 text-${card.color} rounded-full`}>
                                    <i className={`${card.icon} text-[20px]`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-12 gap-x-6 mb-6">
                <div className="xl:col-span-4 col-span-12">
                    <div className="box custom-box h-full">
                        <div className="box-header">
                            <div className="box-title">Ringkasan Hasil Uji</div>
                        </div>
                        <div className="box-body">
                            <div className="flex flex-col justify-center items-center">
                                <Spkapexcharts chartOptions={ringkasanHasilOptions} chartSeries={ringkasanHasilSeries} type="donut" width={"100%"} height={250} />
                                <div className="mt-4 w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="flex items-center text-sm"><span className="w-2 h-2 rounded-full bg-success me-2"></span>Lulus</span>
                                        <span className="text-sm font-semibold">122 (90.2%)</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="flex items-center text-sm"><span className="w-2 h-2 rounded-full bg-danger me-2"></span>Tidak Lulus</span>
                                        <span className="text-sm font-semibold">10 (7.4%)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center text-sm"><span className="w-2 h-2 rounded-full bg-warning me-2"></span>Proses</span>
                                        <span className="text-sm font-semibold">4 (2.4%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <div className="box custom-box h-full">
                        <div className="box-header">
                            <div className="box-title">Hasil Uji per Parameter</div>
                        </div>
                        <div className="box-body">
                            <Spkapexcharts chartOptions={hasilPerParameterOptions} chartSeries={hasilPerParameterSeries} type="bar" width={"100%"} height={320} />
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <div className="box custom-box h-full">
                        <div className="box-header">
                            <div className="box-title">Trend Tingkat Kelulusan</div>
                        </div>
                        <div className="box-body">
                            <Spkapexcharts chartOptions={trendKelulusanOptions} chartSeries={trendKelulusanSeries} type="line" width={"100%"} height={320} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-6 col-span-12">
                    <div className="box custom-box h-full">
                        <div className="box-header justify-between">
                            <div className="box-title">Sampel Terbaru</div>
                            <a href="#!" className="text-primary text-[13px]">Lihat semua sampel <i className="ri-arrow-right-line"></i></a>
                        </div>
                        <div className="box-body p-0">
                            <div className="table-responsive">
                                <Spktables tableClass='table whitespace-nowrap table-hover border-b border-defaultborder' header={[{ title: 'No.' }, { title: 'Kode Sampel' }, { title: 'Produk / Varietas' }, { title: 'Batch' }, { title: 'Parameter Uji' }, { title: 'Penguji' }, { title: 'Tgl Uji' }, { title: 'Status' }, { title: 'Hasil' }]}>
                                    {tableData.map((row, index) => (
                                        <tr key={index} className="border-b border-defaultborder">
                                            <td>{index + 1}</td>
                                            <td><span className="font-semibold">{row.id}</span></td>
                                            <td>{row.produk}</td>
                                            <td>{row.batch}</td>
                                            <td>{row.param}</td>
                                            <td>{row.penguji}</td>
                                            <td>{row.tgl}</td>
                                            <td>
                                                <SpkBadge variant={`${row.badge}/10`} customClass={`text-${row.text}`}>
                                                    {row.status}
                                                </SpkBadge>
                                            </td>
                                            <td>
                                                <span className={row.hasil === 'Lulus' ? 'text-success font-semibold' : row.hasil === 'Tidak Lulus' ? 'text-danger font-semibold' : ''}>{row.hasil}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Simplified remaining sections just for layout */}
                <div className="xl:col-span-3 col-span-12">
                     <div className="box custom-box h-full">
                        <div className="box-header">
                            <div className="box-title">Distribusi Parameter Uji</div>
                        </div>
                        <div className="box-body">
                             {/* Mock donut chart for distribution */}
                             <div className="flex justify-center mb-4">
                                <Spkapexcharts chartOptions={{...ringkasanHasilOptions, labels: ['Daya Tumbuh', 'Kadar Air', 'Kemurnian', 'Vigor', 'Uji Lab'], colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#6b7280']}} chartSeries={[36, 28, 26, 24, 22]} type="donut" width={"100%"} height={275} />
                             </div>
                             <a href="#!" className="text-primary text-[13px]">Lihat detail parameter <i className="ri-arrow-right-line"></i></a>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-3 col-span-12">
                    <div className="box custom-box h-full">
                        <div className="box-header justify-between">
                            <div className="box-title">Notifikasi QC</div>
                            <a href="#!" className="text-success text-[13px]">Lihat semua</a>
                        </div>
                        <div className="box-body">
                            <ul className="list-none mb-0">
                                <li className="mb-4">
                                    <div className="flex items-start">
                                        <div className="avatar avatar-sm bg-danger/10 text-danger rounded-full me-3">
                                            <i className="ri-close-circle-line"></i>
                                        </div>
                                        <div>
                                            <p className="mb-0 font-semibold text-[13px]">10 sampel tidak lulus uji</p>
                                            <p className="text-textmuted text-[12px]">Beberapa sampel pada parameter kemurnian</p>
                                        </div>
                                        <div className="ms-auto text-[11px] text-textmuted">1 jam lalu</div>
                                    </div>
                                </li>
                                <li className="mb-4">
                                    <div className="flex items-start">
                                        <div className="avatar avatar-sm bg-warning/10 text-warning rounded-full me-3">
                                            <i className="ri-time-line"></i>
                                        </div>
                                        <div>
                                            <p className="mb-0 font-semibold text-[13px]">24 sampel sedang diuji</p>
                                            <p className="text-textmuted text-[12px]">Proses pengujian sedang berlangsung</p>
                                        </div>
                                        <div className="ms-auto text-[11px] text-textmuted">2 jam lalu</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-start">
                                        <div className="avatar avatar-sm bg-success/10 text-success rounded-full me-3">
                                            <i className="ri-checkbox-circle-line"></i>
                                        </div>
                                        <div>
                                            <p className="mb-0 font-semibold text-[13px]">28 sertifikat QC diterbitkan</p>
                                            <p className="text-textmuted text-[12px]">Sertifikat berhasil dibuat</p>
                                        </div>
                                        <div className="ms-auto text-[11px] text-textmuted">3 jam lalu</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer Performance Summary */}
            <div className="box mt-4">
                <div className="box-header">
                    <div className="box-title">Ringkasan Performa QC</div>
                </div>
                <div className="box-body">
                    <div className="grid grid-cols-12 gap-4 text-center">
                        <div className="col-span-12 md:col-span-2">
                            <div className="flex flex-col items-center">
                                <i className="ri-timer-line text-[24px] text-primary mb-2"></i>
                                <span className="text-textmuted text-[12px]">Rata-rata Waktu Uji</span>
                                <h4 className="font-bold text-[20px]">2.4 Hari</h4>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-2">
                             <div className="flex flex-col items-center">
                                <i className="ri-group-line text-[24px] text-info mb-2"></i>
                                <span className="text-textmuted text-[12px]">Sampel per Penguji</span>
                                <h4 className="font-bold text-[20px]">27</h4>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-2">
                             <div className="flex flex-col items-center">
                                <i className="ri-flask-line text-[24px] text-success mb-2"></i>
                                <span className="text-textmuted text-[12px]">Metode Uji Aktif</span>
                                <h4 className="font-bold text-[20px]">15</h4>
                            </div>
                        </div>
                         <div className="col-span-12 md:col-span-2">
                             <div className="flex flex-col items-center">
                                <i className="ri-bookmark-line text-[24px] text-warning mb-2"></i>
                                <span className="text-textmuted text-[12px]">Standar Acuan Aktif</span>
                                <h4 className="font-bold text-[20px]">23</h4>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-2">
                             <div className="flex flex-col items-center">
                                <i className="ri-folder-2-line text-[24px] text-primary mb-2"></i>
                                <span className="text-textmuted text-[12px]">Dokumen Pendukung</span>
                                <h4 className="font-bold text-[20px]">42</h4>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-2">
                             <div className="flex flex-col items-center">
                                <i className="ri-tools-line text-[24px] text-success mb-2"></i>
                                <span className="text-textmuted text-[12px]">Alat Terkalibrasi</span>
                                <h4 className="font-bold text-[20px]">18 / 20</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    );
};

export default DashboardQC;
