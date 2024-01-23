"use client";

import { useEffect, useState, Fragment, useMemo } from "react";
import styles from "./styles.module.css";
import { useFormState } from "react-dom";
import { redirect } from 'next/navigation'
import { BiHide, BiShow } from "react-icons/bi";
import Loader from "@/components/Loader/Loader";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { confirmResetLink, resetPassword } from "./_action";
import SignUpButton from "@/components/SubmitButton/SubmitButton";

const PasswordReset = ({ params }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validUrl, setValidUrl] = useState(null);
  const [password, setPassword] = useState("");
  const [response, verifyLink] = useFormState(confirmResetLink, 0);
  const [responseAgain, setNewPassword] = useFormState(resetPassword, 0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const id = params.id[0];
  const token = params.id[1];
  const router = useRouter();
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const IdAndToken = useMemo(() => {
    return {
      id: params.id[0],
      token: params.id[1],
    };
  }, [params]);
  const handleResetPassword = async () => {
    setLoading(true);
    await verifyLink(IdAndToken);
  }
  //handle response
  useEffect(() => {
    const handleResponse = () => {
      const bad_Request = 400;
      const success = 200;
      const server_Error = 500;
      const conflict = 409;
      if (response.status === success) {
        setLoading(false)
        setValidUrl(true)
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
  //handle response again/ second response
  useEffect(() => {
    const handleResponseAgain = () => {
      const bad_Request = 400;
      const success = 200;
      const server_Error = 500;
      const conflict = 409;
      if (responseAgain.status === success) {
        setLoading(false)
        toast.success(responseAgain.message);
        redirect("/login")
      } else if (responseAgain.status === bad_Request) {
        setLoading(false)
        setError(true)
        toast.error(responseAgain.message);
      } else if (responseAgain.status === server_Error) {
        setLoading(false)
        setError(true)
        toast.error(responseAgain.message);
      }
    };

    if (responseAgain) {
      handleResponseAgain();
    }
  }, [responseAgain]);
  return (
    <Fragment>
      {loading && <Loader />}
      {validUrl === false && !loading && (
        <div className="flex justify-center items-center text-2xl h-96 ml-2 text-center md:ml-0 md:mr-0">
          {error}
        </div>
      )}
      {validUrl && !loading && (
        <div className={styles.container}>
          <form className={styles.form_container}
            action={async (formData) => {
              setNewPassword(formData);
            }}
          >
            <h1 className="text-2xl mb-4 font-bold text-center md:text-left">
              Add New Password
            </h1>
            <div className="flex px-2 py-1 md:py-2 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
              <input
                className=" w-full bg-slate-200 border-none outline-none"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="New password"
                name="password"
              />
              <span
                className="flex text-xl cursor-pointer"
                onClick={handleShowPassword}
              >
                {showPassword ? <BiShow /> : <BiHide />}
              </span>
            </div>
            <input type="text" name="id" hidden defaultValue={IdAndToken.id}  />
            <input type="text" name="token" hidden defaultValue={IdAndToken.token} />
            <SignUpButton name={"Reset"} />
          </form>
        </div>
      )}
      {
        !error && !validUrl && !loading && (
          <div className="flex justify-center items-center h-[50vh]">
            <button onClick={handleResetPassword} className="px-4 py-4 bg-black text-red-500 border-none rounded-lg text-md">Click to Reset Password</button>
          </div>
        )
      }
    </Fragment>
  );
};

export default PasswordReset;
