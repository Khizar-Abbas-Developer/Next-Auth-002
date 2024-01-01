/* eslint-disable react/no-unescaped-entities */
"use client";


import Image from "next/image";
import loginSignUpImage from "./1.gif"
import Link from "next/link";
import { BiShow, BiHide } from "react-icons/bi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { signInFailure, signInStart, signInSuccess } from "@/components/redux/userSlice";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(signInStart());
      const url = `/api/users/login`;
      if(!data.email || !data.password){
        if(!data.email){
          toast.error("please enter your email")
        }else if(!data.password){
          toast.error("please enter your password")
        }
      }
      const res = await axios.post(url, data);
      dispatch(signInSuccess(res.data.bUser));
      window.location.href = "/"
      toast.success(res.data.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        toast.error(error.response.data.message);
        dispatch(signInFailure(error.response.data.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="p-3 bg-slate-100 min-h-[calc(100vh)] pt-40">
        <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4 shadow-xl rounded-md">
          <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative">
            <Image
              src={loginSignUpImage}
              className="w-full h-full"
              alt="avatar-animation"
              priority
            />
            {/* data.image ? data.image :  */}
          </div>

          <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type={"email"}
              id="email"
              name="email"
              autoComplete="on"
              className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
              value={data.email}
              onChange={handleChange}
            />

            <label htmlFor="password">Password</label>
            <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className=" w-full bg-slate-200 border-none outline-none"
                value={data.password}
                onChange={handleChange}
              />
              <span
                className="flex text-xl cursor-pointer"
                onClick={handleShowPassword}
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </span>
            </div>
            <Link href={"/forgot-password"}>Forget Password?</Link>
            <button
              className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-left w-full text-sm mt-2">
            Doesn't have an Account ?{" "}
            <Link href={"/signup"} className="text-red-500 underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
