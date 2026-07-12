import React from 'react';
import EditBtn from './EditBtn';
import RemoveBtn from './RemoveBtn';
import { CustData } from '@/app/types/customer';



interface TableProps {
    data: CustData[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const Table = ({ data, onEdit, onDelete }: TableProps) => {
    return (
        <div className="table-responsive">
            <table className="table whitespace-nowrap table-bordered min-w-full">
                <thead>
                    <tr className="border-b border-defaultborder">
                        <th scope="col" className="text-start">No</th>
                        <th scope="col" className="text-start">Kode Customer</th>
                        <th scope="col" className="text-start">Nama Customer</th>
                        <th scope="col" className="text-start">Kategori</th>
                        <th scope="col" className="text-start">Kontak Person</th>
                        <th scope="col" className="text-start">No. Telepon</th>
                        <th scope="col" className="text-start">Kota</th>
                        <th scope="col" className="text-start">Status</th>
                        <th scope="col" className="text-start">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr className="border-b border-defaultborder" key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.kodeCust}</td>
                                <td>{item.namaCust}</td>
                                <td>{item.kategori}</td>
                                <td>{item.pic}</td>
                                <td>{item.noTelepon}</td>
                                <td>{item.kota}</td>
                                <td>
                                    <span className={`badge ${item.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                        {item.status === 'Aktif' ? 'Active' : 'Non active'}
                                    </span>
                                </td>
                                <td>
                                    <EditBtn id={item.kodeCust} onClick={onEdit} />
                                    <RemoveBtn id={item.kodeCust} onClick={onDelete} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center text-muted">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
