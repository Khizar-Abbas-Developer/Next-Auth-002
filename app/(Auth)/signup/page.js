"use client";

import Link from "next/link";
import Image from "next/image";
import { BiShow, BiHide } from "react-icons/bi";
import loginSignUpImage from "./1.gif";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../(Loader2)/thirdLoader/loading";
import { ImagetoBase64 } from "@/utils/ImagetoBase64";
import SigninButton from "@/components/SigninButton/SigninButton";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [sMsg, setSMsg] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    image: "",
    previewImage: loginSignUpImage,
  });
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
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

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const url = `/api/users/signup`;

      // Check for empty fields first
      if (!data.username || !data.email || !data.password || !data.confirmpassword) {
        if(!data.username){
          toast.error("Please Enter userName");
        }else if(!data.email){
          toast.error("Please Enter your Email address");
        }else if(!data.password){
          toast.error("Please Enter your Password")
        }else if(!data.confirmpassword){
          toast.error("Please Confirm your Password")
        }
        return setLoading(false)
      }

      // Check if password and confirm password match
      if (data.password !== data.confirmpassword) {
        setLoading(false)
        toast.error("password & confirm password should match");
        return;
      }

      // Store only the password in the data object
      const { username, email, password, image } = data;
      const requestData = { username, email, password, image };
      const response = await axios.post(url, requestData);

      // Check if the signup was successful
      if (response.status === 201) {
        setSMsg(true);
        setMsg(response.data.message);
        toast.success(response.data.message);
        // Clear all fields except password
        setData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmpassword: "",
          image: "",
        });
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("An Unexpected error occured try again later")
      }
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setLoading(false);
        toast.error(error.response.data.message);
      } else {
        setLoading(false);
        toast.error("An unexpected error occurred.");
      }
    }
  };
  return (
    <>
      {loading ? (
        <>
          <div className="flex flex-col justify-center items-center h-96 md:mt-20">
            <Loader />
          </div>
        </>
      ) : (
        <>
          <div className="p-3 bg-slate-100 min-h-[calc(100vh)]">
            <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4 mt-24 shadow-md rounded-md">
            <div variant={"success"} className="bg-green-300 w-full h-full text-center font-bold">{sMsg ? msg : ""}</div>
              {/* <h1 className='text-center text-2xl font-bold'>Sign Up</h1> */}
              <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative">
                <Image
                  src={data.previewImage ? data.previewImage : loginSignUpImage}
                  width={100} // Set your desired width
                  height={100} // Set your desired height
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
                    onChange={handleUploadProfileImage}
                  />
                </label>
              </div>

              <form
                className="w-full py-3 flex flex-col"
                onSubmit={handleSubmit}
              >
                <label htmlFor="username">Username</label>
                <input
                  type={"text"}
                  id="username"
                  name="username"
                  autoComplete="off"
                  className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
                  value={data.username}
                  onChange={handleChange}
                />

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

                <label htmlFor="confirmpassword">Confirm Password</label>
                <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpassword"
                    name="confirmpassword"
                    className=" w-full bg-slate-200 border-none outline-none"
                    value={data.confirmpassword}
                    onChange={handleChange}
                  />
                  <span
                    className="flex text-xl cursor-pointer"
                    onClick={handleShowConfirmPassword}
                  >
                    {showConfirmPassword ? <BiShow /> : <BiHide />}
                  </span>
                </div>
                <button className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4">
                  Sign Up
                </button>
              </form>
              <p className="text-left w-full text-sm mt-2">
                Already have Account ?{" "}
                <Link href={"/login"} className="text-red-500 underline">
                  Login
                </Link>
              </p>
              <div className="mt-4 drop-shadow-md">
              <SigninButton />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUp;
