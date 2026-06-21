"use client"
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, Fragment, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import Form from "next/form";
const Basic = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    const router = useRouter();
    const onSubmit = (data) => {
        router.push('/dashboard/sales');
        toast.success('Created Password successful', {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const newPassword = watch('newPassword');
    return (
        <Fragment>
            <Seo title="ResetPassword Basic" />
            <div className="container">
                <div className="grid grid-cols-12 justify-center items-center authentication authentication-basic h-full">
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12 px-3">
                        <div className="box my-4">
                            <div className="box-body !p-[3rem]">
                                <div className="mb-3 flex justify-center">
                                    <Link href="/dashboard/sales">
                                        <Image fill src="../../../assets/images/brand-logos/desktop-logo.png" alt="logo" className="desktop-logo " />
                                        <Image fill src="../../../assets/images/brand-logos/desktop-white.png" alt="logo" className="desktop-white " />
                                    </Link>
                                </div>
                                <p className="h5 mb-2 text-center">Reset Password</p>
                                <p className="mb-4 text-textmuted dark:text-textmuted/50 opacity-70 font-normal text-center text-[14px]">Hi Henry!</p>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-12 gap-y-4">
                                        {/* Current Password */}
                                        <div className="xl:col-span-12 col-span-12">
                                            <label htmlFor="currentPassword" className="ti-form-label text-default">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={passwordVisibility.current ? 'text' : 'password'}
                                                    id="currentPassword"
                                                    placeholder="Current password"
                                                    className="form-control custom-form-input custom-reset-pass"
                                                    {...register('currentPassword', { required: 'Current password is required' })}
                                                />
                                                <Link href="#!" scroll={false} onClick={() => togglePasswordVisibility('current')} className="show-password-button text-textmuted dark:text-textmuted/50">
                                                    <i className={`${passwordVisibility.current ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`} />
                                                </Link>
                                            </div>
                                            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
                                        </div>
                                        {/* New Password */}
                                        <div className="xl:col-span-12 col-span-12">
                                            <label htmlFor="newPassword" className="ti-form-label text-default">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={passwordVisibility.new ? 'text' : 'password'}
                                                    id="newPassword"
                                                    placeholder="New password"
                                                    className="form-control custom-form-input custom-reset-pass"
                                                    {...register('newPassword', {
                                                        required: 'New password is required',
                                                        minLength: {
                                                            value: 6,
                                                            message: 'Password must be at least 6 characters',
                                                        },
                                                    })}
                                                />
                                                <Link href="#!" scroll={false} onClick={() => togglePasswordVisibility('new')} className="show-password-button text-textmuted dark:text-textmuted/50">
                                                    <i className={`${passwordVisibility.new ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`} />
                                                </Link>
                                            </div>
                                            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="xl:col-span-12 col-span-12">
                                            <label htmlFor="confirmPassword" className="ti-form-label text-default">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={passwordVisibility.confirm ? 'text' : 'password'}
                                                    id="confirmPassword"
                                                    placeholder="Confirm password"
                                                    className="form-control custom-form-input custom-reset-pass"
                                                    {...register('confirmPassword', {
                                                        required: 'Please confirm your password',
                                                        validate: (value) =>
                                                            value === newPassword || 'Passwords do not match',
                                                    })}
                                                />
                                                <Link href="#!" scroll={false} onClick={() => togglePasswordVisibility('confirm')} className="show-password-button text-textmuted dark:text-textmuted/50">
                                                    <i className={`${passwordVisibility.confirm ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`} />
                                                </Link>
                                            </div>
                                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                                        </div>

                                        <div className="xl:col-span-12 col-span-12 mt-2">
                                            <div className="form-check mb-0">
                                                <input className="form-check-input" type="checkbox" id="defaultCheck1" />
                                                <label className="form-check-label text-textmuted dark:text-textmuted/50 font-normal text-[0.75rem]" htmlFor="defaultCheck1">
                                                    Remember password?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid mt-4">
                                        <SpkButton buttontype="submit" variant="primary" customClass="ti-btn">Create</SpkButton>
                                    </div>
                                </Form>
                                <div className="text-center">
                                    <p className="text-textmuted dark:text-textmuted/50 mt-3">Remembered your password? <Link href="/authentication/sign-in/basic/" className="text-primary">Sign In</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div>
                </div>
            </div>
                <ToastContainer />
        </Fragment>
    );
};

export default Basic;