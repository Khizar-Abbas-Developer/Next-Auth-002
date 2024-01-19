"use client";

import { useEffect, useState, Fragment, useRef, useMemo } from "react";
import { useFormState } from "react-dom";
import { BiHide, BiShow } from "react-icons/bi";
import styles from "./styles.module.css";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import Loader from "@/components/Loader/Loader";
import { redirect } from 'next/navigation';
import toast from "react-hot-toast";
import { confirmResetLink, resetPassword } from "./_action";

const PasswordReset = ({ params }) => {
    const [validUrl, setValidUrl] = useState(null);
    const formRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [response, formAction] = useFormState(confirmResetLink, 0);
    const [responseAgain, formActionAgain] = useFormState(resetPassword, 0);

    const IdAndToken = useMemo(() => ({
        id: params.id[0],
        token: params.id[1]
    }), [params]);

    useEffect(() => {
        return () => {
            formAction(IdAndToken)
        }
    }, [IdAndToken, formAction])

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };
    //handle response
    useEffect(() => {
        const handleResponse = () => {
            const bad_Request = 400;
            const success = 200;
            const server_Error = 500;
            const conflict = 409;
            if (response.status === success) {
                setValidUrl(true);
                toast.success(response.message);
                formRef.current?.reset();
                setLoading(false)
            } else if (response.status === bad_Request) {
                setValidUrl(false);
                setError("Your Password Reset Link is expired!");
                toast.error(response.message);
                setLoading(false)
            } else if (response.status === server_Error) {
                toast.error(response.message);
                setLoading(false)
            } else if (response.status === conflict) {
                toast.error(response.message)
                setLoading(false)
            }
        };

        if (response) {
            handleResponse();
        }
    }, [response]);

    const navigateToLogin = () => {
        window.location.href = "/login"
    }
    //handle second response
    //handle response
    useEffect(() => {
        const handleResponseAgain = () => {
            const bad_Request = 400;
            const success = 200;
            const server_Error = 500;
            const conflict = 409;
            if (responseAgain.status === success) {
                toast.success(responseAgain.message);
                formRef.current?.reset();
                setLoading(false)
                redirect('/login');
            } else if (responseAgain.status === bad_Request) {
                toast.error(responseAgain.message);
                setLoading(false)
            } else if (responseAgain.status === server_Error) {
                toast.error(responseAgain.message);
                setLoading(false)
            } else if (responseAgain.status === conflict) {
                toast.error(responseAgain.message)
                setLoading(false)
            }
        };

        if (responseAgain) {
            handleResponseAgain();
        }
    }, [responseAgain]);
    return (
        <Fragment>
            {loading && <Loader />}
            {validUrl === null && !loading && (
                <div className="flex justify-center items-center text-2xl h-96 ml-2 text-center md:ml-0 md:mr-0">
                    Checking the password reset link...
                </div>
            )}
            {validUrl === false && !loading && (
                <div className="flex justify-center items-center text-2xl h-96 ml-2 text-center md:ml-0 md:mr-0">
                    {error}
                </div>
            )}
            {validUrl && !loading && (
                <>
                    <div className={styles.container}>
                        <form className={styles.form_container}
                            action={async (formData) => {
                                formActionAgain(formData);
                            }}
                            ref={formRef}
                        >
                            <h1 className="text-2xl mb-4 font-extrabold tracking-wide">Add New Password</h1>
                            <div className="flex px-4 py-[12px] bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300 w-full">
                                <input
                                    className="w-full bg-slate-200 rounded outline-none"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="New Password"
                                    name="password"
                                />
                                <input type="text" hidden name="id" defaultValue={IdAndToken.id} />
                                <input type="text" hidden name="token" defaultValue={IdAndToken.token} />
                                <span
                                    className="flex text-xl cursor-pointer"
                                    onClick={handleShowPassword}
                                >
                                    {showPassword ? <BiShow /> : <BiHide />}
                                </span>
                            </div>
                            {msg && <div className={styles.success_msg}>{msg}</div>}
                            <SubmitButton name={"Reset"} />
                        </form>
                    </div>
                </>
            )}


        </Fragment>
    );
};

export default PasswordReset;