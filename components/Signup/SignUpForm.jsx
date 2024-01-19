"use client"
import { ImagetoBase64 } from '@/utils/ImagetoBase64';
import { set } from 'mongoose';
import Image from 'next/image';
import { useFormState } from "react-dom";
import React, { useEffect, useRef, useState } from 'react';
import { BiHide, BiShow } from "react-icons/bi";
import loginSignUpImage from "@/public/1.gif";
import Link from 'next/link';
import { createUser } from '@/components/Signup/_action';
import toast from 'react-hot-toast';
import { MoonLoader } from 'react-spinners';
import SignUpButton from "@/components/SubmitButton/SubmitButton";
const SignupFormComp = () => {
  const formRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [response, formAction] = useFormState(createUser, 0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    image: "",
    previewImage: loginSignUpImage,
  });

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleUploadProfileImage = async (e) => {
    const file = e.target.files[0];
    try {
      const data = await ImagetoBase64(file);
      const previewImage = URL.createObjectURL(file);

      setData((prev) => ({
        ...prev,
        image: data,
        previewImage,
      }));
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  };

  useEffect(() => {
    const handleResponse = () => {
      const bad_Request = 400;
      const success = 201;
      const server_Error = 500;
      const conflict = 409;
      if (response.status === success) {
        toast.success(response.message);
        setMsg(response.message);
        setData("");
        // resetting the input fields of the form
        formRef.current?.reset();
      } else if (response.status === bad_Request) {
        toast.error(response.message);
      } else if (response.status === server_Error) {
        toast.error(response.message);
      } else if (
        response.status === bad_Request &&
        response.message ===
        `"Password" should contain at least 1 upper-cased letter, "Password" should contain at least 1 number, "Password" should contain at least 1 symbol`
      ) {
        toast.error(
          `"Password must be at least 8 characters long, and include at least 1 uppercase letter, 1 number, and 1 symbol."`
        );
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
      <div className="p-3 bg-slate-100 min-h-[calc(100vh)]">
        <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4 mt-24 shadow-md rounded-md">
          <div variant={"success"} className="bg-green-300 w-full h-full text-center font-bold">{msg ? msg : ""}</div>
          <form
            className="w-full py-3 flex flex-col"
            action={async (formData) => {
              formAction(formData);
            }}
            ref={formRef}
          >
            <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative">
              <Image
                src={data.previewImage ? data.previewImage : loginSignUpImage}
                width={100}
                height={100}
                priority
                alt="avatar-animation"
              />
              <label htmlFor="profileImage">
                <div className="absolute bottom-0 h-1/3 bg-slate-500 bg-opacity-50 w-full text-center cursor-pointer">
                  <p className="text-sm p-1 text-white">Upload</p>
                </div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="hidden"
                  name='image'
                  onChange={handleUploadProfileImage}
                />
              </label>
            </div>
            <label htmlFor="username">Username</label>
            <input
              className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
              type={"text"}
              id="username"
              name="username"
              autoComplete="off"
            />

            <label htmlFor="email">Email</label>
            <input
              className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
              type={"email"}
              id="email"
              name="email"
              autoComplete="on"
            />

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
            <SignUpButton name={"Sign up"} />
          </form>
          <p className="text-left w-full text-sm mt-2">
            Already have Account ?{" "}
            <Link href={"/login"} className="text-red-500 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default SignupFormComp;