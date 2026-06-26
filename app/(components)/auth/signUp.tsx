"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Fragment, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

export default function SignUp() {
    const [passwordshow1, setpasswordshow1] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [err1, setError1] = useState("");
    const [data, setData] = useState({
        "username": "",
        "email": "",
        "password": "",
    });
    const { username, email, password } = data;
    
    const changeHandler = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setError1("");
    };

    const router = useRouter();

    useEffect(() => {
        let timer: any;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setError1("");
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
            const registerPath = '/auth/register';
            
            const response = await fetch(`${baseUrl}${registerPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (result.sisaWaktu) {
                    setCountdown(result.sisaWaktu);
                    setError1(result.error || `Silakan kirimkan OTP ulang ke email tersebut dalam sisa waktu ${result.sisaWaktu} detik.`);
                } else if (result.error) {
                    setError1(result.error);
                } else {
                    throw new Error('Terjadi kesalahan saat mendaftar');
                }
                toast.error(result.error || 'Terjadi kesalahan saat mendaftar', {
                    position: 'top-right',
                    autoClose: 1500,
                });
                return;
            }

            if (result.userId || result.message) {
                toast.success(result.message || 'User registered successfully. Please check your email for OTP.', {
                    position: 'top-right',
                    autoClose: 1500,
                });
                if (result.userId) {
                    setTimeout(() => {
                        // kita bisa buat /verify-otp jika ada
                        router.push(`/auth/verify-otp?userId=${result.userId}`);
                    }, 1500);
                }
            } else {
                toast.success('Pendaftaran berhasil, silahkan cek email untuk OTP', {
                    position: 'top-right',
                    autoClose: 1500,
                });
            }

        } catch (error: any) {
            setError1(error.message || 'Terjadi kesalahan unhandled saat mendaftar');
            toast.error(error.message || 'Terjadi kesalahan unhandled saat mendaftar', {
                position: 'top-right',
                autoClose: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Fragment>
            <div className="container">
                <div className="grid grid-cols-12 justify-center items-center authentication authentication-basic h-full">
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
                        <div className="box my-4">
                            <nav className="!block firebase-data mt-6 bg-light mx-auto p-2 rounded-md" aria-label="Tabs" role='tablist'>
                                <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                                    <Image width={200} height={100} src="/assets/images/logo-web-green.png" alt="user-img" className='' />
                                </div>
                            </nav>
                            <div className="box-body !p-[3rem]">
                                <div className="grid grid-cols-12 gap-y-3">
                                    <div className="xl:col-span-12 col-span-12">
                                        {err1 && <div className="alert-danger px-4 py-3 shadow-md mb-2" role="alert">
                                            <div className="flex">
                                                <div>{err1} {countdown > 0 && `(Sisa waktu: ${countdown}s)`}</div>
                                            </div>
                                        </div>}
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="signup-username" className="form-label text-defaulttextcolor">Username<sup className="text-xs text-danger">*</sup></label>
                                        <input type="text" name="username" className="form-control " onChange={changeHandler} value={username} id="signup-username" placeholder="Username" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="signup-email" className="form-label text-defaulttextcolor">Email<sup className="text-xs text-danger">*</sup></label>
                                        <input type="email" name="email" className="form-control " onChange={changeHandler} value={email} id="signup-email" placeholder="Email" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12 mb-2">
                                        <label htmlFor="signup-password" className="form-label text-defaulttextcolor block">Password<sup className="text-xs text-danger">*</sup></label>
                                        <div className="relative">
                                            <input type={(passwordshow1) ? 'text' : "password"} className="form-control form-control-lg !rounded-s-md"
                                                name="password"
                                                placeholder="Password" value={password}
                                                onChange={changeHandler} />
                                            <Link scroll={false} href="#!" onClick={(e) => { e.preventDefault(); setpasswordshow1(!passwordshow1); }} className="show-password-button text-textmuted dark:text-textmuted/50" id="button-addon2">
                                                <i className={`${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`}></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid mt-4">
                                    <button className="ti-btn ti-btn-primary" onClick={handleRegister} disabled={isLoading || countdown > 0}>
                                        {isLoading ? 'Signing Up...' : (countdown > 0 ? `Tunggu ${countdown}s` : 'Sign Up')}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <p className="text-textmuted dark:text-textmuted/50 mt-3 mb-0">Already have an account? <Link href="/" className="text-primary">Sign In</Link></p>
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
}
