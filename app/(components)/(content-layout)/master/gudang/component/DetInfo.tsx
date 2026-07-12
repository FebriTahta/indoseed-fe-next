import { GudData } from '@/app/types/gudang';
import React from 'react';

const DetailInfo = ({ viewed }: { viewed: GudData }) => {
    return (
        <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Nama Gudang</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.namaGudang}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kategori</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.kategori}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Bergabung</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.createdAt ? new Date(viewed.createdAt).toLocaleDateString('id-ID') : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] ${viewed.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : viewed.status === 'Maintenance'
                  ? 'bg-danger/10 text-danger'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                {viewed.status}
              </span>
            </div>

        </div>
    );
};

export default DetailInfo;
