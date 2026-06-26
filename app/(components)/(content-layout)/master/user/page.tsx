"use client"
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import Table from '../../../myiamseed/Table';
import AddBtn from '../../../myiamseed/AddBtn';

export default function MasterUser() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                let currentUserRole = '';
                if (token) {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        const payload = JSON.parse(jsonPayload);
                        const firstRole = payload.roles && payload.roles.length > 0 ? payload.roles[0] : null;
                        currentUserRole = payload.role || payload.activeRole?.name || (firstRole ? (typeof firstRole === 'object' ? firstRole.name : firstRole) : "");
                    } catch (e) {
                        console.error("Could not parse token", e);
                    }
                }

                if (!token || (currentUserRole !== 'superadmin' && currentUserRole !== 'admin')) {
                    setError('Unauthorized access');
                    router.push('/');
                    return;
                }

                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
                const response = await fetch(`${baseUrl}/master/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401 || response.status === 403) {
                    setError('Unauthorized access');
                    router.push('/');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const result = await response.json();
                if (result.success) {
                    setUsers(result.data);
                } else {
                    setError(result.message || 'Failed to fetch user data');
                }
                setLoading(false);

            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to fetch data');
                setLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [router]);

    const handleAdd = () => {
        console.log("Add user clicked");
        // router.push('/master/user/create');
    };

    const handleEdit = (id: string) => {
        console.log("Edit user", id);
        // router.push(`/master/user/edit/${id}`);
    };

    const handleDelete = (id: string) => {
        console.log("Delete user", id);
        // Implement delete logic
    };

    if (error) {
        return <div className="p-4 text-center text-danger">{error}</div>;
    }

    return (
        <Fragment>
            <Pageheader title="Master Data" currentpage="Master User" activepage="Users" mainpage="User" description="Kelola Data User" />
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header flex justify-between items-center">
                            <h5 className="box-title mb-0">User Data</h5>
                            <AddBtn onClick={handleAdd} />
                        </div>
                        <div className="box-body">
                            {loading ? (
                                <div className="text-center py-4">Loading...</div>
                            ) : (
                                <Table data={users} onEdit={handleEdit} onDelete={handleDelete} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
