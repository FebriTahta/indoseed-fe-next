import { CustData } from '@/app/types/customer';
import React from 'react';

const DetailInfo = ({ viewed }: { viewed: CustData }) => {
    return (
        <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Nama Customer</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.name}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kategori</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.kategori}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">NPWP</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.NPWP}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Alamat</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.address}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kota</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.city}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kode Pos</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.postalCode}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">No. Telepon</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.phone_no}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Email</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.email}
            </div>
            
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Top Customer</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.isTop ? 'Ya' : 'Tidak'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Limit Credit</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.credit_limit.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Sisa Credit</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewed.remaining_credit.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
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
