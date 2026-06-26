import React from 'react';
import EditBtn from './EditBtn';
import RemoveBtn from './RemoveBtn';

interface Role {
    id: string;
    name: string;
}

interface UserData {
    id: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    activeRole: Role;
    roles: Role[];
}

interface TableProps {
    data: UserData[];
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
                        <th scope="col" className="text-start">Username</th>
                        <th scope="col" className="text-start">Email</th>
                        <th scope="col" className="text-start">Verified</th>
                        <th scope="col" className="text-start">Active Role</th>
                        <th scope="col" className="text-start">All Roles</th>
                        <th scope="col" className="text-start">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr className="border-b border-defaultborder" key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.username}</td>
                                <td>{item.email}</td>
                                <td>
                                    <span className={`badge ${item.isEmailVerified ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                        {item.isEmailVerified ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td>{item.activeRole?.name || '-'}</td>
                                <td>{item.roles?.map(r => r.name).join(', ') || '-'}</td>
                                <td>
                                    <EditBtn id={item.id} onClick={onEdit} />
                                    <RemoveBtn id={item.id} onClick={onDelete} />
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
