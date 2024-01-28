/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect, useState } from 'react';
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import { useFormState } from "react-dom";
import { ForgotAPI } from './_action';
import Loader from '@/components/Loader/Loader';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [response, formAction] = useFormState(ForgotAPI, 0);
    useEffect(() => {
        const handleResponse = () => {
            const bad_Request = 404;
            const success = 201;
            const server_Error = 500;
            const conflict = 409;
            if (response.status === success) {
                router.replace(`/reset-verification/${response.id}`)
            } else if (response.status === bad_Request) {
                toast.error(response.message);
            } else if (response.status === server_Error) {
                toast.error(response.message);
            }
        };
        if (response) {
            handleResponse();
        }
    }, [response, router]);
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className={"w-full h-[75vh] flex justify-center items-center overflow-hidden"}>
                        <form className={"w-[400px] p-[20px] bg-slate-100 rounded-[10px] flex flex-col items-center shadow-xl"}
                            action={async (formData) => {
                                formAction(formData);
                            }}
                        >
                            <h1 className="text-3xl mb-4 font-extrabold tracking-wide text-center sm:text-center">Forgot Password</h1>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                required
                                autoComplete="off"
                                className="mt-1 px-3 mb-2 w-full bg-slate-200 text-black py-2 rounded focus-within:outline-blue-300 text-md"
                            />
                            <SubmitButton name={"Reset"} />
                        </form>
                    </div>
                </>
            )}
        </>
    )
}

export default ForgotPassword;