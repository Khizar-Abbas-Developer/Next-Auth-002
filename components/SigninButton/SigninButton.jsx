"use client"

import { app } from "@/components/redux/firebase";
// import Image from "next/image";
import "./SigninButton.css";
import { signInStart, signInSuccess, signInFailure } from "@/components/redux/userSlice";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
            const res = await axios.post(`/api/users/OAuth`, dataToSend);
            const responseData = await res.data;
            toast.success("Logged in successfully")
            dispatch(signInSuccess(responseData.data));
            setLoading(false)
            window.location.href = "/";
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