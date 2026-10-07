"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Fragment, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import Turnstile from "./Turnstile";

export default function SignUp() {
    const [passwordshow1, setpasswordshow1] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [turnstileKey, setTurnstileKey] = useState(0);

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
        
        const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNISTILE_SITE_KEY || '0x4AAAAAADsac7zEzG0Ar8xw';
        if (siteKey && !captchaToken) {
            toast.error('Silakan selesaikan captcha terlebih dahulu', {
                position: 'top-right',
                autoClose: 1500,
            });
            return;
        }

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
                    password: password,
                    captchaToken: captchaToken
                })
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                setTurnstileKey(prev => prev + 1);
                setCaptchaToken(null);
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
                toast.success(result.message || 'Pendaftaran berhasil. Silahkan cek email untuk OTP.', {
                    position: 'top-right',
                    autoClose: 1500,
                });
                if (result.userId) {
                    setTimeout(() => {
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
            setTurnstileKey(prev => prev + 1);
            setCaptchaToken(null);
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
                <div className="grid grid-cols-12 justify-center items-center authentication authentication-basic h-full min-h-screen">
                    {/* The Empty Div for Background on Left */}
                    <div className="hidden lg:block lg:col-span-7"></div>
                    
                    {/* Form container on Right */}
                    <div className="col-span-12 sm:col-span-10 sm:col-start-2 md:col-span-8 md:col-start-3 lg:col-span-5 lg:col-start-8 flex justify-center lg:justify-end items-center h-full pr-0 lg:pr-8 xl:pr-12">
                        <div className="box w-full max-w-sm bg-white py-5 px-6 shadow-2xl shadow-emerald-900/10 border-0 rounded-2xl my-4">
                            
                            <div className="flex justify-center mb-4">
                                <Image width={160} height={64} src="/assets/images/logo-web-green.png" alt="Indoseed Logo" className="object-contain drop-shadow-sm" />
                            </div>
                            
                            <h2 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight">
                                Buat Akun Baru
                            </h2>
                            <p className="mt-1 mb-5 text-center text-xs text-gray-600">
                                Bergabung dengan sistem informasi perusahaan benih
                            </p>

                            {err1 && (
                                <div className="mb-4 rounded-lg bg-red-50 p-3 border border-red-100 flex items-start">
                                    <i className="ri-error-warning-fill text-red-500 text-lg mt-0.5 mr-3"></i>
                                    <div>
                                        <h3 className="text-sm font-medium text-red-800">Pendaftaran Gagal</h3>
                                        <div className="mt-1 text-xs text-red-700">
                                            {err1} {countdown > 0 && <span className="font-semibold block mt-1">Sisa waktu: {countdown}s</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleRegister}>
                                <div>
                                    <label htmlFor="username" className="block text-xs font-medium text-gray-700">
                                        Username
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-user-line text-gray-400 text-sm"></i>
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            value={username}
                                            onChange={changeHandler}
                                            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                                            placeholder="Pilih username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                                        Alamat Email
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-mail-line text-gray-400 text-sm"></i>
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={changeHandler}
                                            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                                            placeholder="nama@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                                        Kata Sandi
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="ri-lock-line text-gray-400 text-sm"></i>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={passwordshow1 ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={changeHandler}
                                            className="block w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                                            placeholder="Minimal 8 karakter"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setpasswordshow1(!passwordshow1)}
                                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            >
                                                <i className={passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"} style={{ fontSize: '14px' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <div className="flex justify-center border border-gray-100 rounded-lg bg-gray-50/50 p-2 overflow-hidden">
                                        <Turnstile
                                            key={turnstileKey}
                                            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNISTILE_SITE_KEY || '0x4AAAAAADsac7zEzG0Ar8xw'}
                                            onSuccess={(token) => setCaptchaToken(token)}
                                            onExpire={() => setCaptchaToken(null)}
                                            onError={() => setCaptchaToken(null)}
                                        />
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <button
                                        type="submit"
                                        disabled={isLoading || countdown > 0}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 transition-colors"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <i className="ri-loader-4-line animate-spin"></i> Mendaftar...
                                            </span>
                                        ) : countdown > 0 ? (
                                            `Tunggu ${countdown}s`
                                        ) : (
                                            "Daftar Akun"
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-5">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-white text-gray-500">Sudah memiliki akun?</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link 
                                        href="/" 
                                        className="w-full flex justify-center py-2 px-4 border border-emerald-200 rounded-lg shadow-sm text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                                    >
                                        Kembali ke Login
                                    </Link>
                                </div>
                            </div>
                            
                            <p className="text-center text-[10px] text-gray-400 mt-5">
                                &copy; {new Date().getFullYear()} SI BENIH - Sistem Informasi Perusahaan Benih.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    );
}
