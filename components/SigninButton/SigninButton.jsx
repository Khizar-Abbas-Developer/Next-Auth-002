"use client"

import { app } from "@/redux/firebase";
// import Image from "next/image";
import "./SigninButton.css";
import React from 'react';
import { signInStart, signInSuccess, signInFailure } from "@/redux/userSlice";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInGoogle } from "./_action";

const SigninButton = () => {
    const [loading, setLoading] = useState(false); // Add loading state
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try {
            setLoading(true)
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const username = result.user.displayName
            const email = result.user.email
            const image = result.user.photoURL
            const dataToSend = { username, email, image }
            dispatch(signInStart());
            const response = await signInGoogle(dataToSend);
            if (response && response.status) {
                if (response.status === 200) {
                    toast.success(response.message)
                    dispatch(signInSuccess(response.data));
                    setLoading(false)
                    window.location.href = "/";
                } else if (response.status === 201) {
                    dispatch(signInSuccess(response.data));
                    setLoading(false)
                    window.location.href = "/"
                } else if (response.status === 400) {
                    toast.error(response.message)
                    setLoading(false)
                } else if (response.status === 500) {
                    toast.error(response.message)
                    setLoading(false)
                }
            }
        } catch (error) {
            setLoading(false)
            console.log("Could not login with google", error);
        }
    }
    return (
        <>
            <button onClick={handleGoogleClick} type="button" className="login-with-google-btn" >
                {loading ? "Please wait... Signing in..." : "Sign in with Google"}
            </button>
        </>
    )
}
export default SigninButton;