/* eslint-disable react/no-unescaped-entities */

"use client"
import React, { useEffect, useRef, useState } from 'react';
import styles from "./styles.module.css";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import { useFormState } from "react-dom";
import { ForgotAPI } from './_action';
import Loader from '@/components/Loader/Loader';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const formRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [response, formAction] = useFormState(ForgotAPI, 0);
    const [msg, setMsg] = useState("");

    //handle Forgot response
    useEffect(() => {
        const handleResponse = () => {
            const bad_Request = 400;
            const success = 200;
            const server_Error = 500;
            const conflict = 409;
            if (response.status === success) {
                formRef.current?.reset();
                toast.success(response.message);
                setMsg(response.message);
                // resetting the input fields of the form
                formRef.current?.reset();
            } else if (response.status === bad_Request) {
                toast.error(response.message);
            } else if (response.status === server_Error) {
                toast.error(response.message);
            } else if (response.status === conflict) {
                toast.error(response.message)
            }
        };

        if (response) {
            handleResponse();
        }
    }, [response]);
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className={styles.container}>
                        <form className={styles.form_container}
                            // onSubmit={handleSubmit}
                            action={async (formData) => {
                                formAction(formData);
                            }}
                            ref={formRef}
                        >
                            <h1 className="text-3xl mb-4 font-extrabold tracking-wide">Reset your password</h1>
                            <h3 className='text-lg font-semibold'>You'll get an email with a reset link</h3>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                required
                                autoComplete="off"
                                className={styles.input}
                            />
                            {msg && <div className={styles.success_msg}>{msg}</div>}
                            <SubmitButton name={"Reset"} />
                        </form>
                    </div>
                </>
            )}
        </>
    )
}

export default ForgotPassword