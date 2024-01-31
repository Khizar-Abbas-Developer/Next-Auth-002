"use client"
import { revalidatePath } from 'next/cache';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { BiHide, BiShow } from "react-icons/bi";


const Form = ({message}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    useEffect(() => {
            if (message) {
                toast.error(message);
            }
    }, [message]);
    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
      };
      const handleShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
      };
    return (
        <>
            <label htmlFor="password">Password</label>
            <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
                <input
                    className=" w-full bg-slate-200 border-none outline-none"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                />
                <span
                    className="flex text-xl cursor-pointer"
                    onClick={handleShowPassword}
                >
                    {showPassword ? <BiShow /> : <BiHide />}
                </span>
            </div>

            <label htmlFor="confirmpassword">Confirm Password</label>
            <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
                <input
                    className=" w-full bg-slate-200 border-none outline-none"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpassword"
                    name="confirmpassword"
                />
                <span
                    className="flex text-xl cursor-pointer"
                    onClick={handleShowConfirmPassword}
                >
                    {showConfirmPassword ? <BiShow /> : <BiHide />}
                </span>
            </div>
        </>
    )
}

export default Form;