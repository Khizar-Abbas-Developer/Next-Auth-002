"use client";

import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import success from "@/public/assest/success.png";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";
import Loader from "@/app/(Auth)/(Loader2)/thirdLoader/loading";

const EmailVerify = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        setError(false); // Reset error state

        if (!params || !params.id || !params.id[0] || !params.id[2]) {
          throw new Error("Invalid parameters in the URL");
        }

        const url = `/api/users/${params.id[0]}/verify/${params.id[2]}`;
        const { data } = await axios.get(url);
        toast.success(data.message);
        setVerified(true);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    verifyEmailUrl();
  }, [params]);

  return (
    <div className="flex justify-center items-center h-96">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      ) : error && !verified ? (
        <div className="flex flex-col justify-center items-center h-96 gap-6">
          <h1 className="text-2xl font-bold md:text-5xl">
            Your token has expired!
          </h1>
          <h3 className="text-xl md:text-3xl">Please try again</h3>
          <p className="text-5xl md:text-6xl">⚠️</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-96">
          <h1 className="text-2xl font-bold md:text-4xl lg:text-5xl text-center">
            Email Verified Successfully
          </h1>
          <p className="text-7xl md:text-8xl">✅</p>
          <Link href={"/login"} className="underline text-xl">
            Login to your account
          </Link>
        </div>
      )}
    </div>
  );
   
};

export default EmailVerify;
