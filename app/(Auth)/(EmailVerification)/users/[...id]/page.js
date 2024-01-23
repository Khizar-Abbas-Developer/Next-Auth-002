"use client";

import { useEffect, useState, Fragment, useMemo } from "react";
import success from "@/public/success.png";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";
import Loader from "@/components/Loader/Loader";
import { verifyEmail } from "./_action";

const EmailVerify = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [response, formAction] = useFormState(verifyEmail, 0);
  const router = useRouter();
  const IdAndToken = useMemo(() => {
    return {
      id: params.id[0],
      token: params.id[2],
    };
  }, [params]);
  const handleVerify = async () => {
    setLoading(true)
    if (!params || !params.id || !params.id[0] || !params.id[2]) {
      setLoading(false)
      throw new Error("Invalid parameters in the URL");
    } else {
      await formAction(IdAndToken)
    }
  }
  //handle Response
  useEffect(() => {
    const handleResponse = () => {
      const bad_Request = 400;
      const success = 200;
      const server_Error = 500;
      const conflict = 409;
      if (response.status === success) {
        setLoading(false)
        setVerified(true)
        toast.success(response.message);
      } else if (response.status === bad_Request) {
        setLoading(false)
        setError(true)
        toast.error(response.message);
      } else if (response.status === server_Error) {
        setLoading(false)
        setError(true)
        toast.error(response.message);
      }
    };

    if (response) {
      handleResponse();
    }
  }, [response]);


  return (
    <div className="flex justify-center items-center h-96">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      ) : error && (
        <div className="flex flex-col justify-center items-center h-96 gap-6">
          <h1 className="text-2xl font-bold md:text-5xl">
            Your token has expired!
          </h1>
          <h3 className="text-xl md:text-3xl">Please try again</h3>
          <p className="text-5xl md:text-6xl">⚠️</p>
        </div>
      )}
      {verified && (
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

      {
        !error && !verified && !loading && (
          <button onClick={handleVerify} className="px-4 py-4 bg-black text-red-500 border-none rounded-lg text-md">Click to Verify</button>
        )
      }
    </div>
  );
};

export default EmailVerify;
