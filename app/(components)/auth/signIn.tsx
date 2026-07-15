"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Fragment } from "react";
import { ToastContainer, toast } from 'react-toastify';


// import Turnstile from "./Turnstile";

export default function SignIn() {
    const [passwordshow1, setpasswordshow1] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [turnstileKey, setTurnstileKey] = useState(0);

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
    const RouteChange = (role?: string) => {
        let path = "/dashboard/sales";
        if (role === 'superadmin' || role === 'admin') {
            path = "/master/greenhouse";
        }
        router.push(path);
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();

        // const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNISTILE_SITE_KEY || '0x4AAAAAADsac7zEzG0Ar8xw';
        // if (siteKey && !captchaToken) {
        //     toast.error('Silakan selesaikan captcha terlebih dahulu', {
        //         position: 'top-right',
        //         autoClose: 1500,
        //     });
        //     return;
        // }

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
            // Optionally save token
            if (result && result.token) {
                localStorage.setItem('token', result.token);
            }

            let userRole = "";
            try {
                if (result.token) {
                    const base64Url = result.token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const payload = JSON.parse(jsonPayload);

                    const firstRole = payload.roles && payload.roles.length > 0 ? payload.roles[0] : null;
                    userRole = payload.role || payload.activeRole?.name || (firstRole ? (typeof firstRole === 'object' ? firstRole.name : firstRole) : "");
                }
            } catch (e) {
                console.error("Could not parse JWT token for role", e);
            }

            if (!userRole) {
                userRole = result.user?.activeRole?.name ||
                    result.data?.activeRole?.name ||
                    result.role ||
                    (result.user?.roles && result.user.roles.length > 0 ? (result.user.roles[0].role?.name || result.user.roles[0].name) : "") ||
                    "";
            }

            toast.success('Login successful', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                RouteChange(userRole);
            }, 1200);

        } catch (error: any) {
            setTurnstileKey(prev => prev + 1);
            setCaptchaToken(null);
            setError1(error.message || 'Login failed');
            toast.error(error.message || 'Invalid login credentials', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Fragment>
            <div className="container">
                <div className="grid grid-cols-12 justify-center items-center authentication authentication-basic h-full">
                    <div className="col-span-6"></div>
                    <div className="col-span-6 flex justify-center items-center h-full">
                        <div className="box w-full">

                            

                            {/* <nav className="!block firebase-data mt-6 bg-light mx-auto p-2 rounded-md" aria-label="Tabs" role='tablist'>
                                <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                                    <Image width={200} height={100} src="/assets/images/logo-web-green.png" alt="user-img" className='' />
                                </div>
                            </nav> */}
                            <div className="box-body !p-[3rem]">

                                <h4 className="mb-1">
                                    Selamat Datang Kembali
                                </h4>

                                <span className="text-textmuted dark:text-textmuted/50">
                                    Silahkan login untuk mengakses <br/> sistem informasi perusahaan benih.
                                </span>

                                <div className="grid grid-cols-12 gap-y-3 mt-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        {err1 && <div className="alert-danger px-4 py-3 shadow-md mb-2" role="alert">
                                            <div className="flex">
                                                <div className="py-1">
                                                </div>
                                                <div>{err1}</div>
                                            </div>
                                        </div>}
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="signin-username" className="form-label text-defaulttextcolor">Email / Username <sup className="text-xs text-danger">*</sup></label>
                                        {/* <input type="text" name="username" className="form-control" onChange={changeHandler} value={username} id="signin-username" placeholder="Username" /> */}
                                        <div className="input-group">
                                            <div className="input-group-text"><i className="ri-user-line"></i></div>
                                            <input type="text" name="username" className="form-control" onChange={changeHandler} value={username} id="signin-username" placeholder="Username"/>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-12 col-span-12 mb-2">
                                        <label htmlFor="signin-password" className="form-label text-defaulttextcolor block">Kata Sandi<sup className="text-xs text-danger">*</sup></label>
                                        <div className="relative">
                                            <div className="input-group">
                                                <div className="input-group-text"><i className="ri-lock-line"></i></div>
                                                <input type={(passwordshow1) ? 'text' : "password"} className="form-control form-control-lg !rounded-s-md "
                                                name="password"
                                                placeholder="Password" value={password}
                                                onChange={changeHandler}/>
                                            </div>
                                            {/* <input type={(passwordshow1) ? 'text' : "password"} className="form-control form-control-lg !rounded-s-md "
                                                name="password"
                                                placeholder="Password" value={password}
                                                onChange={changeHandler} /> */}
                                            <Link scroll={false} href="#!" onClick={(e) => { e.preventDefault(); setpasswordshow1(!passwordshow1); }} className="show-password-button text-textmuted dark:text-textmuted/50" id="button-addon2">
                                                <i className={`${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`}></i>
                                            </Link>
                                        </div>
                                        <div className="mt-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1" />
                                                <label className="form-check-label text-textmuted dark:text-textmuted/50 font-normal" htmlFor="defaultCheck1">
                                                    Ingat Saya ?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <Turnstile
                                    key={turnstileKey}
                                    siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNISTILE_SITE_KEY || '0x4AAAAAADsac7zEzG0Ar8xw'}
                                    onSuccess={(token) => setCaptchaToken(token)}
                                    onExpire={() => setCaptchaToken(null)}
                                    onError={() => setCaptchaToken(null)}
                                /> */}
                                <div className="grid mt-4">
                                    <button className="ti-btn ti-btn-primary" onClick={handleLogin} disabled={isLoading}>
                                        <i className="ti ti-login-2" /> {isLoading ? 'Process Login...' : 'Login'}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <p className="text-textmuted dark:text-textmuted/50 mt-3 mb-0">Dont have an account? <Link href="/auth/sign-up" className="text-primary">Sign Up</Link></p>
                                </div>
                                

                                <div className="flex items-center gap-4 rounded-xl bg-emerald-50 mt-5 px-5 py-4">
                                    <div className="flex h-10 w-10 items-center justify-center">
                                        {/* <AlertTriangle
                                            className="h-6 w-6 text-yellow-500"
                                            fill="#FACC15"
                                            strokeWidth={2}
                                        /> */}
                                        <i className="fa-solid fa-triangle-exclamation text-yellow-400 text-2xl ti ti-alert-triangle"></i>
                                    </div>

                                    <div>
                                        <p className="text-sm text-emerald-700">
                                            Sistem ini dilindungi dengan enkripsi SSL
                                        </p>

                                        <p className="mt-1 text-sm  text-emerald-700">
                                            dan <span className="font-semibold">standar keamanan tinggi.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-textmuted italic dark:text-textmuted/50 mt-3 mb-0">Sistem informasi perusahaan benih</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    {/* <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div> */}
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    );
}
