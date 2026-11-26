"use client"
import Image from "next/image";
import { clearSession, getUserRoles } from '@/app/lib/auth';
import { getHomePath } from '@/shared/layouts-components/sidebar/nav';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Fragment } from "react";
import { ToastContainer, toast } from 'react-toastify';

export default function SignIn() {
    const [passwordshow1, setpasswordshow1] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const [err1, setError1] = useState("");
    const [data, setData] = useState({
        "username": "",
        "password": "",
    });
    const { username, password } = data;

    const changeHandler = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setError1("");
    };

    const router = useRouter();
    /** Arahkan ke halaman awal sesuai role (mis. penguji → Pemeriksaan / Pengujian). */
    const RouteChange = () => {
        router.push(getHomePath(getUserRoles()));
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
            const loginPath = '/auth/login';

            const response = await fetch(`${baseUrl}${loginPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    captchaToken: captchaToken
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Invalid login credentials');
            }

            const result = await response.json();
            if (result && result.token) {
                clearSession(); // buang sisa sesi "login sebagai" sebelumnya
                localStorage.setItem('token', result.token);
            }

            toast.success('Login berhasil', { position: 'top-right', autoClose: 1500 });
            setTimeout(() => {
                RouteChange();
            }, 1200);

        } catch (error: any) {
            setCaptchaToken(null);
            setError1(error.message || 'Login failed');
            toast.error(error.message || 'Invalid login credentials', { position: 'top-right', autoClose: 1500 });
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
                        <div className="box w-full max-w-sm bg-white py-6 px-6 shadow-2xl shadow-emerald-900/10 border-0 rounded-2xl">
                            
                            <div className="flex justify-center mb-4">
                                <Image width={160} height={64} src="/assets/images/logo-web-green.png" alt="Indoseed Logo" className="object-contain drop-shadow-sm" />
                            </div>
                            
                            <h2 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight">
                                Selamat Datang
                            </h2>
                            <p className="mt-1 mb-5 text-center text-xs text-gray-600">
                                Masuk ke sistem informasi perusahaan benih
                            </p>

                            {err1 && (
                                <div className="mb-4 rounded-lg bg-red-50 p-3 border border-red-100 flex items-start">
                                    <i className="ri-error-warning-fill text-red-500 text-lg mt-0.5 mr-3"></i>
                                    <div>
                                        <h3 className="text-sm font-medium text-red-800">Login Gagal</h3>
                                        <div className="mt-1 text-xs text-red-700">{err1}</div>
                                    </div>
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="username" className="block text-xs font-medium text-gray-700">
                                        Email atau Username
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
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleLogin(e);
                                                }
                                            }}
                                            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                                            placeholder="Masukkan email / username"
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
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleLogin(e);
                                                }
                                            }}
                                            className="block w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
                                            placeholder="••••••••"
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

                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-3 w-3 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700">
                                            Ingat saya
                                        </label>
                                    </div>

                                    <div className="text-xs">
                                        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                                            Lupa sandi?
                                        </a>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 transition-colors"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <i className="ri-loader-4-line animate-spin"></i> Memproses...
                                            </span>
                                        ) : (
                                            "Masuk"
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
                                        <span className="px-2 bg-white text-gray-500">Atau</span>
                                    </div>
                                </div>

                                <div className="mt-4 text-center text-xs">
                                    <span className="text-gray-600">Belum punya akun? </span>
                                    <Link href="/auth/sign-up" className="font-medium text-emerald-600 hover:text-emerald-500">
                                        Daftar Sekarang
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-5 bg-emerald-50 rounded-xl p-3 flex items-start gap-2 border border-emerald-100">
                                <div className="shrink-0">
                                    <i className="ri-shield-check-fill text-emerald-500 text-lg"></i>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-emerald-800">Koneksi Aman</p>
                                    <p className="text-[10px] text-emerald-700 mt-0.5 leading-tight">
                                        Sistem ini dilindungi dengan standar keamanan tinggi dan enkripsi data end-to-end.
                                    </p>
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
