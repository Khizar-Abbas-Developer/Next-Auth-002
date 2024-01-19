"use client";

import { verifyEmail } from "./_action";
import { useEffect, useState, Fragment, useMemo } from "react";
import success from "@/public/success.png";
import { motion } from "framer-motion";
import Link from "next/link";
import { redirect } from 'next/navigation';
import Image from "next/image";
import toast from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";
import Loader from "@/components/Loader/Loader";
import { useFormState } from "react-dom";

const EmailVerify = ({ params }) => {
    const [loading, setLoading] = useState(true);
    const [response, formAction] = useFormState(verifyEmail, 0)
    const [verified, setVerified] = useState(true);
    const [error, setError] = useState(false);
    const IdAndToken = useMemo(() => ({
        id: params.id[0],
        token: params.id[2]
    }), [params]);
    useEffect(() => {
        return () => {
            const verifyEmailUrl = async () => {
                try {
                    setError(false);
                    if (!params || !params.id || !params.id[0] || !params.id[2]) {
                        setLoading(false)
                        throw new Error("Invalid parameters in the URL");
                    } else {
                        formAction(IdAndToken)
                        setLoading(false)
                    }
                } catch (error) {
                    setLoading(false)
                    console.error(error);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };
            verifyEmailUrl();
        }
    }, [params, IdAndToken, formAction])
    //handle Response
    useEffect(() => {
            const handleResponse = () => {
                const bad_Request = 400;
                const success = 200;
                const server_Error = 500;
                const conflict = 409;
                if (response.status === success) {
                    toast.success(response.message);
                    setVerified(true)
                    redirect('/login');
                } else if (response.status === bad_Request) {
                    toast.error(response.message);
                    setError(true)
                } else if (response.status === server_Error) {
                    setError(true)
                    toast.error(response.message);
                } else if (response.status === conflict) {
                    setError(true)
                    toast.error(response.message)
                }
            };
        if (response) {
            handleResponse();
        }
    }, [response]);

    return (
        <>
            <div className="flex justify-center items-center h-96">
                {!response || loading ? (
                    <>
                        <div className="flex items-center justify-center h-96">
                            <Loader />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Your condition: check if verified is true and error is false */}
                        {verified && !error ? (
                            <div className="flex flex-col justify-center items-center h-96">
                                <h1 className="text-2xl font-bold md:text-4xl lg:text-5xl text-center">
                                    Email Verified Successfully
                                </h1>
                                <p className="text-7xl md:text-8xl">✅</p>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center h-96 gap-6">
                                <h1 className="text-2xl font-bold md:text-5xl">
                                    Your token has expired!
                                </h1>
                                <h3 className="text-xl md:text-3xl">Please try again</h3>
                                <p className="text-5xl md:text-6xl">⚠️</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );

};

export default EmailVerify;
