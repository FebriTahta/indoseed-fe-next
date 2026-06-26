"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Fragment } from "react";
import { ToastContainer, toast } from 'react-toastify';

export default function SignIn() {
    const [passwordshow1, setpasswordshow1] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Invalid login credentials');
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
            setError1(error.message || 'Login failed');
            toast.error('Invalid login credentials', {
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
                                                <div className="py-1">
                                                </div>
                                                <div>{err1}</div>
                                            </div>
                                        </div>}
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="signin-username" className="form-label text-defaulttextcolor">Username<sup className="text-xs text-danger">*</sup></label>
                                        <input type="text" name="username" className="form-control " onChange={changeHandler} value={username} id="signin-username" placeholder="Username" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12 mb-2">
                                        <label htmlFor="signin-password" className="form-label text-defaulttextcolor block">Password<sup className="text-xs text-danger">*</sup></label>
                                        <div className="relative">
                                            <input type={(passwordshow1) ? 'text' : "password"} className="form-control form-control-lg !rounded-s-md"
                                                name="password"
                                                placeholder="Password" value={password}
                                                onChange={changeHandler} />
                                            <Link scroll={false} href="#!" onClick={(e) => { e.preventDefault(); setpasswordshow1(!passwordshow1); }} className="show-password-button text-textmuted dark:text-textmuted/50" id="button-addon2">
                                                <i className={`${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`}></i>
                                            </Link>
                                        </div>
                                        <div className="mt-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1" />
                                                <label className="form-check-label text-textmuted dark:text-textmuted/50 font-normal" htmlFor="defaultCheck1">
                                                    Remember password ?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid mt-4">
                                    <button className="ti-btn ti-btn-primary" onClick={handleLogin} disabled={isLoading}>
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <p className="text-textmuted dark:text-textmuted/50 mt-3 mb-0">Dont have an account? <Link href="/auth/sign-up" className="text-primary">Sign Up</Link></p>
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
