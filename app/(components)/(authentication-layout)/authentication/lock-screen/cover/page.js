"use client"
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import Seo from "@/shared/layouts-components/seo/seo";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, Fragment, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const Cover = () => {
    const [formData, setFormData] = useState({
        password: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        passwords: false,
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setFormErrors((prev) => ({ ...prev, [id]: '' }));
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validate = () => {
        const errors = {};

        if (!formData.password || formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const router = useRouter()
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            router.push('/dashboard/sales');
            toast.success('Save Password successful', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };
    return (
        <Fragment>
            <Seo title="Lock-Cover" />
            <div className="grid grid-cols-12 authentication authentication-cover-main mx-0">
                <div className="xxl:col-span-6 xl:col-span-7 col-span-12">
                    <div className="grid grid-cols-12 justify-center items-center h-full">
                        <div className="xxl:col-span-3 xl:col-span-2 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div>
                        <div className="xxl:col-span-6 xl:col-span-8 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12 px-3">
                            <div className="box my-auto border border-defaultborder dark:border-defaultborder/10">
                                <div className="box-body !p-[3rem]">
                                    <p className="h5 mb-3 text-center">Lock Screen</p>
                                    <Form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-12 gap-y-3">

                                            <div className="xl:col-span-12 col-span-12 mb-2">
                                                <label htmlFor="lockscreen-password" className="form-label text-defaulttextcolor">Password<sup className="text-xs text-danger">*</sup></label>
                                                <div className="relative">
                                                    <input
                                                        type={passwordVisibility.password ? 'text' : 'password'}
                                                        className="form-control custom-form-input"
                                                        id="password"
                                                        placeholder="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                    <Link
                                                        scroll={false}
                                                        href="#!"
                                                        onClick={() => togglePasswordVisibility('password')}
                                                        className="show-password-button text-textmuted dark:text-textmuted/50"
                                                    >
                                                        <i className={`align-middle ${passwordVisibility.password ? 'ri-eye-line' : 'ri-eye-off-line'}`}></i>
                                                    </Link>
                                                </div>
                                                {formErrors.password && (
                                                    <p className="text-danger text-xs mt-1">{formErrors.password}</p>
                                                )}
                                                <div className="mt-2">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                        <label className="form-check-label text-textmuted dark:text-textmuted/50 font-normal" htmlFor="defaultCheck1">
                                                            Remember password ?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="xl:col-span-12 col-span-12 grid mt-2">
                                                <SpkButton buttontype="submit" variant="primary" customClass="ti-btn">Unlock</SpkButton>
                                            </div>
                                        </div>
                                    </Form>
                                    <div className="text-center">
                                        <p className="text-textmuted dark:text-textmuted/50 mt-3 mb-0">Back to home ? <Link className="text-primary" href="/dashboard/sales">Click Here</Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="xxl:col-span-3 xl:col-span-2 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div>
                    </div>
                </div>
                <div className="xxl:col-span-6 xl:col-span-5 lg:col-span-12 xl:block hidden px-0">
                    <div className="authentication-cover overflow-hidden">
                        <div className="authentication-cover-logo">
                            <Link href="/dashboard/sales">
                                <Image fill src="../../../assets/images/brand-logos/desktop-white.png" alt="logo" className="authentication-brand desktop-white " />
                            </Link>
                        </div>
                        <div className="aunthentication-cover-content flex items-center justify-center">
                            <div>
                                <h3 className="text-white mb-1 font-medium">Welcome Henry!</h3>
                                <h6 className="text-white mb-3 font-medium">Login to Your Account</h6>
                                <p className="text-white mb-1 op-6">Welcome to the Admin Dashboard. Please log in to securely manage your administrative tools and oversee platform activities. Your credentials ensure system integrity and functionality.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    );
};

export default Cover;