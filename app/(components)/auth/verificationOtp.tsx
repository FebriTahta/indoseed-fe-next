"use client"
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Fragment, Suspense } from "react";
import { ToastContainer, toast } from 'react-toastify';

function VerificationOtpForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [err1, setError1] = useState("");
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    const handleVerify = async (e: any) => {
        e.preventDefault();
        if (!userId) {
            setError1("User ID tidak ditemukan. Silakan daftar kembali.");
            return;
        }

        setIsLoading(true);
        setError1("");
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
            const verifyPath = '/auth/verify-otp';
            
            const response = await fetch(`${baseUrl}${verifyPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    otp: otp
                })
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || 'OTP tidak valid atau kadaluarsa');
            }

            toast.success('OTP berhasil diverifikasi. Silakan login.', {
                position: 'top-right',
                autoClose: 1500,
            });
            setTimeout(() => {
                router.push('/');
            }, 1500);

        } catch (error: any) {
            setError1(error.message || 'Verifikasi OTP gagal (unhandled error)');
            toast.error(error.message || 'Verifikasi OTP gagal (unhandled error)', {
                position: 'top-right',
                autoClose: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                            <div className="text-center mb-4">
                                <h4 className="font-semibold text-lg text-defaulttextcolor">Verifikasi OTP</h4>
                                <p className="text-muted">Masukkan kode OTP yang telah dikirim ke email Anda.</p>
                            </div>
                            <div className="grid grid-cols-12 gap-y-3">
                                <div className="xl:col-span-12 col-span-12">
                                    {err1 && <div className="alert-danger px-4 py-3 shadow-md mb-2" role="alert">
                                        <div className="flex">
                                            <div>{err1}</div>
                                        </div>
                                    </div>}
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label htmlFor="otp-input" className="form-label text-defaulttextcolor">Kode OTP<sup className="text-xs text-danger">*</sup></label>
                                    <input type="text" className="form-control" onChange={(e) => { setOtp(e.target.value); setError1(""); }} value={otp} id="otp-input" placeholder="Masukkan OTP" />
                                </div>
                            </div>
                            <div className="grid mt-4">
                                <button className="ti-btn ti-btn-primary" onClick={handleVerify} disabled={isLoading || !otp}>
                                    {isLoading ? 'Memverifikasi...' : 'Verifikasi OTP'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-3 md:col-span-3 sm:col-span-2 col-span-12"></div>
            </div>
        </div>
    );
}

export default function VerificationOtp() {
    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <VerificationOtpForm />
            </Suspense>
            <ToastContainer />
        </Fragment>
    );
}
