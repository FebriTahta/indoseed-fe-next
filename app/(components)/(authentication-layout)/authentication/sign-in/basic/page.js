"use client"
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import Seo from "@/shared/layouts-components/seo/seo";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, Fragment, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Basic = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false
    });

    const [values1, setValues1] = useState({
        password1: '',
        showPassword1: false
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // Email validation
        if (!values.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = "Invalid email format.";
        }

        // Password validation
        if (!values.password) {
            newErrors.password = "Password is required.";
        } else if (values.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted:', values, values1);
            router.push('/dashboard/sales');
            toast.success('Verify Your Account successful', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // Handle form submission logic here
        }
    };

    return (
        <Fragment>
            <Seo title="Signin Basic" />
            <div className="container">
                <div className="grid grid-cols-12 justify-center items-center authentication authentication-basic h-full">
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
                        <div className="box my-4">
                            <div className="box-body !p-[3rem]">
                                <div className="mb-3 flex justify-center">
                                    <Link href="/dashboard/sales">
                                        <Image fill src="../../../assets/images/brand-logos/desktop-logo.png" alt="logo" className="desktop-logo " />
                                        <Image fill src="../../../assets/images/brand-logos/desktop-white.png" alt="logo" className="desktop-white " />

                                    </Link>
                                </div>
                                <p className="h5 mb-2 text-center">Sign In</p>
                                <p className="mb-4 text-textmuted dark:text-textmuted/50 opacity-70 font-normal text-center">Welcome back Henry !</p>
                                <Form onSubmit={handleSubmit} >
                                    <div className="grid grid-cols-12 gap-y-3">
                                        <div className="xl:col-span-12 col-span-12">
                                            <label htmlFor="signin-username" className="form-label text-defaulttextcolor">User Name<sup className="text-xs text-danger">*</sup></label>

                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="signup-username"
                                                placeholder="Enter Email ID"
                                                value={values.email}
                                                onChange={(e) => setValues({ ...values, email: e.target.value })}
                                            />
                                            {errors.email && (
                                                <div className="invalid-feedback text-danger">
                                                    {errors.email}
                                                </div>
                                            )}

                                        </div>
                                        <div className="xl:col-span-12 col-span-12 mb-2">
                                            <label htmlFor="signin-password" className="form-label text-defaulttextcolor block">Password<sup className="text-xs text-danger">*</sup><Link scroll={false} href="/authentication/reset-password/basic/" className="float-end font-normal text-textmuted dark:text-textmuted/50">Forget password ?</Link></label>
                                            <div className="relative">
                                                <input
                                                    type={values.showPassword ? "text" : "password"}
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    id="signup-password"
                                                    placeholder="Password"
                                                    value={values.password}
                                                    onChange={(e) => setValues({ ...values, password: e.target.value })}

                                                />
                                                <Link scroll={false} href="#!" className="show-password-button text-muted"
                                                    onClick={() => setValues((prev) => ({ ...prev, showPassword: !prev.showPassword }))}>
                                                    {values.showPassword ? (
                                                        <i className="ri-eye-line align-middle"></i>
                                                    ) : (
                                                        <i className="ri-eye-off-line align-middle"></i>
                                                    )}
                                                </Link>
                                                {errors.password && (
                                                    <div className="invalid-feedback text-danger">
                                                        {errors.password}
                                                    </div>
                                                )}



                                            </div>
                                            <div className="mt-2">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                    <label className="form-check-label text-textmuted dark:text-textmuted/50 font-normal" htmlFor="defaultCheck1">
                                                        Remember password ?
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid mt-4">
                                        <SpkButton buttontype="submit" variant="primary" customClass="ti-btn">Sign In</SpkButton>
                                    </div>
                                </Form>
                                <div className="text-center">
                                    <p className="text-textmuted dark:text-textmuted/50 mt-3 mb-0">Dont have an account? <Link href="/authentication/sign-up/basic/" className="text-primary">Sign Up</Link></p>
                                </div>
                                <div className="btn-list text-center mt-3">
                                    <SpkButton variant="soft-primary" customClass="ti-btn ti-btn-icon btn-wave me-2">
                                        <i className="ri-facebook-line leading-none align-center text-[17px]"></i>
                                    </SpkButton>
                                    <SpkButton variant="soft-primary1" customClass="ti-btn ti-btn-icon btn-wave me-2">
                                        <i className="ri-twitter-x-line leading-none align-center text-[17px]"></i>
                                    </SpkButton>
                                    <SpkButton variant="soft-primary2" customClass="ti-btn ti-btn-icon btn-wave">
                                        <i className="ri-instagram-line leading-none align-center text-[17px]"></i>
                                    </SpkButton>
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