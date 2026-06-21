"use client"
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import { basePath } from '@/next.config';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {

    const [passwordshow1, setpasswordshow1] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [err1, setError1] = useState("");
    const [data, setData] = useState({
        "username": "",
        "password": "",
    });
    const { username, password } = data;
    
    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setError1("");
    };

    const router = useRouter();
    const RouteChange = () => {
        let path = "/dashboard/sales";
        router.push(path);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
            const loginPath = process.env.NEXT_PUBLIC_API_LOGIN || '/auth/login';
            
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

            toast.success('Login successful', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                RouteChange();
            }, 1200);

        } catch (error) {
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

    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/") {
            document.body.classList.add("authentication-background");
        } else {
            document.body.classList.remove("authentication-background");
        }
    }, [pathname]);

    return (
        <Fragment>
            <div className="container">
                <div className="grid grid-cols-12 justify-center items-center authentication authentication-basic h-full">
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
                        <div className="box my-4">

                            <nav className="!block firebase-data mt-6 bg-light mx-auto p-2 rounded-md" aria-label="Tabs" role='tablist'>
                                <div className="flex justify-center space-x-2  rtl:space-x-reverse">
                                    <Image width={200} height={100} src={`${process.env.NODE_ENV === 'production' ? basePath : ''}/assets/images/logo-web-green.png`} alt="user-img" className='' />
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
                                        <label htmlFor="signin-password" className="form-label text-defaulttextcolor block">Password<sup className="text-xs text-danger">*</sup><Link scroll={false} href="/authentication/reset-password/basic" className="float-end font-normal text-textmuted dark:text-textmuted/50">Forget password ?</Link></label>
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
                                    <p className="text-textmuted dark:text-textmuted/50 mt-3 mb-0">Dont have an account? <Link href="/authentication/sign-up/basic" className="text-primary">Sign Up</Link></p>
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
