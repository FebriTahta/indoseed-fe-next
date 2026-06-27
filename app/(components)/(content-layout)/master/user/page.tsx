"use client"
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import Table from '../../../myiamseed/Table';
import AddBtn from '../../../myiamseed/AddBtn';

import { useUser } from '@/app/hooks/useUser';

export default function MasterUser() {
    const {
        users,
        loading,
        error,
        handleAdd,
        handleEdit,
        handleDelete,
    } = useUser();

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
