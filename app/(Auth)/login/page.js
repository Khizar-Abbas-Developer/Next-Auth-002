/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import loginSignUpImage from "@/public/1.gif"
import Link from "next/link";
import { BiShow, BiHide } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import SignUpButton from "@/components/SubmitButton/SubmitButton";
import { AuthenticateUser } from "./_action";
import { signInFailure, signInStart, signInSuccess } from "@/redux/userSlice";
import SigninButton from "@/components/SigninButton/SigninButton";

const LoginPage = () => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [response, formAction] = useFormState(AuthenticateUser, 0);
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //Response of the Login api
  useEffect(() => {
    const handleResponse = () => {
      const bad_Request = 400;
      const success = 202;
      const created = 201;
      const server_Error = 500;
      const conflict = 409;
      if (response.status === success) {
        dispatch(signInStart());
        toast.success(response.message);
        dispatch(signInSuccess(response.user));
        router.push("/")
        formRef.current?.reset();
      } else if (response.status === bad_Request) {
        dispatch(signInFailure(response.message));
        toast.error(response.message);
      } else if (response.status === created) {
        dispatch(signInFailure(response.message));
        setMsg(response.message);
        toast.success(response.message);
      } else if (response.status === server_Error) {
        dispatch(signInFailure(response.message));
        toast.error(response.message);
      } else if (response.status === conflict) {
        dispatch(signInFailure(response.message));
        toast.error(response.message)
      }
    };

    if (response) {
      handleResponse();
    }
  }, [response, router, dispatch]);

  return (
    <>
      <div className="p-3 bg-slate-100 min-h-[calc(100vh)] pt-40">
        <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4 shadow-xl rounded-md">
          <div variant={"success"} className="bg-green-300 w-full h-full text-center font-bold">{msg ? msg : ""}</div>
          <h3 className="text-center text-3xl md:text-4xl font-bold">Login</h3>
          <form
            className="w-full py-3 flex flex-col"
            action={async (formData) => {
              formAction(formData);
            }}
            ref={formRef}
          >
            <label htmlFor="email">Email</label>
            <input
              type={"email"}
              id="email"
              name="email"
              autoComplete="on"
              className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
            />

            <label htmlFor="password">Password</label>
            <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className=" w-full bg-slate-200 border-none outline-none"
              />
              <span
                className="flex text-xl cursor-pointer"
                onClick={handleShowPassword}
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </span>
            </div>
            <Link href={"/forgot-password"} className="underline text-red-500">Forget Password ?</Link>
            <SignUpButton name={"Submit"} />
          </form>
          <p className="text-left w-full text-sm mt-2">
            Doesn't have an Account?{" "}
            <Link href={"/signup"} className="text-red-500 underline">
              Signup
            </Link>
          </p>
          <div className="mt-2">
            <SigninButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
