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

        // Confirm password validation
        if (!values1.password1) {
            newErrors.password1 = "Please confirm your password.";
        } else if (values.password !== values1.password1) {
            newErrors.password1 = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const router = useRouter()
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            router.push('/');
            toast.success('Save Password successful', {
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
            <Seo title="SignUp Basic" />
            <div className="container">
                <div className="flex justify-center items-center authentication authentication-basic h-full">
                    <div className="xl:max-w-[41.66666667%] md:max-w-[60%]">
                        <div className="box my-4">
                            <div className="box-body !p-[3rem]">
                                <div className="mb-4 flex justify-center">
                                    <Link href="/dashboard/sales">
                                        <Image fill src="../../../assets/images/brand-logos/desktop-logo.png" alt="logo" className="desktop-logo " />
                                        <Image fill src="../../../assets/images/brand-logos/desktop-white.png" alt="logo" className="desktop-white " />
                                    </Link>
                                </div>
                                <p className="h5 mb-2 text-center">Sign Up</p>
                                <p className="mb-4 text-textmuted dark:text-textmuted/50 opacity-70 font-normal text-center">Welcome! Begin by creating your account.</p>
                                <div className="flex mb-3 justify-between gap-2 flex-wrap flex-lg-nowrap">
                                    <SpkButton variant="light" Size="lg" customClass="ti-btn border border-defaultborder dark:border-defaultborder/10 flex items-center justify-center flex-auto">
                                        <span className="avatar avatar-xs">
                                            <Image fill src="../../../assets/images/media/apps/google.png" alt="logo" className="" />
                                        </span>
                                        <span className="leading-[1.2rem] ms-2 text-[13px] text-defaulttextcolor">Signup with Google</span>
                                    </SpkButton>
                                </div>
                                <div className="text-center my-3 authentication-barrier">
                                    <span>OR</span>
                                </div>
                                <Form onSubmit={handleSubmit} >
                                    <div className="grid grid-cols-12 gap-y-4">
                                        <div className="xl:col-span-12 col-span-12">
                                            <label htmlFor="signup-firstname" className="form-label text-defaulttextcolor">Full Name<sup className="text-xs text-danger">*</sup></label>

                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="signup-firstname"
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
                                        <div className="xl:col-span-12 col-span-12">
                                            <label htmlFor="signup-password" className="form-label text-defaulttextcolor">Password<sup className="text-xs text-danger">*</sup></label>
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
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <label htmlFor="signup-confirmpassword" className="form-label text-defaulttextcolor">Confirm Password<sup className="text-xs text-danger">*</sup></label>
                                            <div className="relative">
                                                <input
                                                    type={values1.showPassword1 ? "text" : "password"}
                                                    className={`form-control ${errors.password1 ? 'is-invalid' : ''}`}
                                                    id="signup-confirmpassword"
                                                    placeholder="Confirm Password"
                                                    value={values1.password1}
                                                    onChange={(e) => setValues1({ ...values1, password1: e.target.value })}

                                                />
                                                <Link scroll={false} href="#!" className="show-password-button text-muted"
                                                    onClick={() => setValues1((prev) => ({ ...prev, showPassword1: !prev.showPassword1 }))}>
                                                    {values1.showPassword1 ? (
                                                        <i className="ri-eye-line align-middle"></i>
                                                    ) : (
                                                        <i className="ri-eye-off-line align-middle"></i>
                                                    )}
                                                </Link>
                                                {errors.password1 && (
                                                    <div className="invalid-feedback text-danger">
                                                        {errors.password1}
                                                    </div>
                                                )}

                                            </div>
                                            <div className="form-check mt-3">
                                                <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                <label className="form-check-label text-textmuted dark:text-textmuted/50 font-normal text-[14px]" htmlFor="defaultCheck1">
                                                </label>
                                                By creating a account you agree to our <Link scroll={false} href="/pages/terms-conditions" className="text-success"><u>Terms & Conditions</u></Link> and 
                                                <Link href="#!" scroll={false} className="text-success"><u>Privacy Policy</u></Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid mt-4">
                                        <SpkButton buttontype="submit" variant="primary" customClass="ti-btn">Create Account</SpkButton>
                                    </div>
                                </Form>
                                <div className="text-center">
                                    <p className="text-textmuted dark:text-textmuted/50 mt-3 mb-0">Already have an account? <Link scroll={false} href="/authentication/sign-in/basic/" className="text-primary">Sign In</Link></p>
                                </div>
                                <div className="btn-list text-center mt-3">
                                    <SpkButton variant="soft-primary" customClass="ti-btn ti-btn-icon btn-wave me-2">
                                        <i className="ri-facebook-line leading-none align-center text-[17px]"></i>
                                    </SpkButton>
                                    <SpkButton variant="soft-primary1" customClass="ti-btn ti-btn-icon btn-wave me-2">
                                        <i className="ri-twitter-x-line leading-none align-center text-[17px]"></i>
                                    </SpkButton>
                                    <SpkButton variant="soft-primary2" customClass="ti-btn ti-btn-icon btn-wave me-">
                                        <i className="ri-instagram-line leading-none align-center text-[17px]"></i>
                                    </SpkButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <ToastContainer />
        </Fragment>
    );
};

export default Basic;