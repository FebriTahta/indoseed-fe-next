"use client"
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { FC, Fragment, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import Form from "next/form";

const VerifyOtp = () => {
    const [inputValues, setInputValues] = useState({
        one: '',
        two: '',
        three: '',
        four: '',
        five: '',
        six: ''
    });

    const [error, setError] = useState('');

    const inputsRef = {
        one: useRef(null),
        two: useRef(null),
        three: useRef(null),
        four: useRef(null),
        five: useRef(null),
        six: useRef(null)
    };

    const handleChange = (
        current,
        next,
        value
    ) => {
        if (!/^\d?$/.test(value)) return; // Only allow one digit

        const updatedValues = { ...inputValues, [current]: value };
        setInputValues(updatedValues);

        if (value && next && inputsRef[next].current) {
            inputsRef[next].current?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

        if (paste.length === 6) {
            setInputValues({
                one: paste[0],
                two: paste[1],
                three: paste[2],
                four: paste[3],
                five: paste[4],
                six: paste[5]
            });

            inputsRef.six.current?.focus();
        }

        e.preventDefault();
    };
    
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { one, two, three, four, five, six } = inputValues;

        if (!one || !two || !three || !four || !five || !six) {
            setError('All fields are required.');
            return;
        }

        const fullOTP = `${one}${two}${three}${four}${five}${six}`;
        
        // Example implementation using env variables
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const verifyOtpPath = '/verify-otp';
        
        try {
            // Assume userId is stored in localStorage or context after register
            const userId = localStorage.getItem('registeredUserId') || 'guest-user-id';
            const roleName = 'guest'; // Default role

            /* 
            // Uncomment when connecting to actual API
            const response = await fetch(`${baseUrl}${verifyOtpPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    otp: fullOTP,
                    roleName
                })
            });

            if (!response.ok) {
                throw new Error('Verification failed');
            }
            */
            
            toast.success('Account verification successful!', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.log('Submitted OTP:', fullOTP, 'Role:', roleName);
            setError('');
            
            setTimeout(() => {
                router.push('/authentication/sign-in/basic');
            }, 1500);

        } catch (err) {
            setError(err.message || 'Something went wrong');
        }
    };

    const handleResend = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const resendOtpPath = '/resend-otp';
        
        try {
            const userId = localStorage.getItem('registeredUserId') || 'guest-user-id';
            
            /*
            // Uncomment when connecting to actual API
            await fetch(`${baseUrl}${resendOtpPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
            });
            */
            
            toast.info('OTP has been resent', {
                position: 'top-right',
                autoClose: 1500
            });
        } catch (err) {
            toast.error('Failed to resend OTP');
        }
    };

    return (
        <Fragment>
            <Seo title="Verify OTP" />
            <div className="container-lg">
                <div className="grid grid-cols-12 justify-center items-center authentication two-step-verification authentication-basic h-full">
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
                                <p className="h5 mb-2 text-center">Verify Your Account</p>
                                <p className="mb-4 text-textmuted dark:text-textmuted/50 opacity-70 font-normal text-center text-xs">Enter the 6 digit code sent to your email.</p>
                                <Form onSubmit={handleSubmit} >
                                <div className="grid grid-cols-12 gy-3">
                                    <div className="xl:col-span-12 col-span-12 mb-2">
                                        <div className="grid grid-cols-12 gap-x-2">
                                            <div className="col-span-2">
                                                <input
                                                    ref={inputsRef.one}
                                                    type="text"
                                                    maxLength={1}
                                                    value={inputValues.one}
                                                    onChange={(e) => handleChange('one', 'two', e.target.value)}
                                                    onPaste={handlePaste}
                                                    className="form-control text-center px-1"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    ref={inputsRef.two}
                                                    type="text"
                                                    maxLength={1}
                                                    value={inputValues.two}
                                                    onChange={(e) => handleChange('two', 'three', e.target.value)}
                                                    className="form-control text-center px-1"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    ref={inputsRef.three}
                                                    type="text"
                                                    maxLength={1}
                                                    value={inputValues.three}
                                                    onChange={(e) => handleChange('three', 'four', e.target.value)}
                                                    className="form-control text-center px-1"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    ref={inputsRef.four}
                                                    type="text"
                                                    maxLength={1}
                                                    value={inputValues.four}
                                                    onChange={(e) => handleChange('four', 'five', e.target.value)}
                                                    className="form-control text-center px-1"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    ref={inputsRef.five}
                                                    type="text"
                                                    maxLength={1}
                                                    value={inputValues.five}
                                                    onChange={(e) => handleChange('five', 'six', e.target.value)}
                                                    className="form-control text-center px-1"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    ref={inputsRef.six}
                                                    type="text"
                                                    maxLength={1}
                                                    value={inputValues.six}
                                                    onChange={(e) => handleChange('six', null, e.target.value)}
                                                    className="form-control text-center px-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <label className="text-[14px]">
                                                Didn't receive a code ?<button type="button" onClick={handleResend} className="text-primary ms-2 inline-block bg-transparent border-none cursor-pointer">Resend</button>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-12 col-span-12 grid mt-2">
                                        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                                        <SpkButton buttontype="submit" variant="primary" customClass="ti-btn">Verify Account</SpkButton>
                                    </div>
                                </div>
                                </Form>
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

export default VerifyOtp;
