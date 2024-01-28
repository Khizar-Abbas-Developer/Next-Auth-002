"use client";

import { useEffect, useState, Fragment, useMemo } from "react";
import { useFormState } from "react-dom";
import { redirect } from 'next/navigation'
import { BiHide, BiShow } from "react-icons/bi";
import Loader from "@/components/Loader/Loader";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { resetPassword } from "./_action";
import SignUpButton from "@/components/SubmitButton/SubmitButton";

const PasswordReset = ({ params }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validUrl, setValidUrl] = useState(null);
  const [password, setPassword] = useState("");
  const [response, formAction] = useFormState(resetPassword, 0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const Id = params.id
  useEffect(() => {
    const handleResponse = () => {
      const bad_Request = 400;
      const success = 200;
      const server_Error = 500;
      const conflict = 409;
      if (response.status === success) {
        setLoading(false)
        toast.success(response.message)
        redirect("/login")
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
    <>
      <div className={"w-full h-[75vh] flex justify-center items-center overflow-hidden"}>
        <form className={"w-[400px] p-[20px] bg-slate-100 rounded-[10px] flex flex-col items-center shadow-xl"}
          action={async (formData) => {
            formAction(formData);
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
          <input type="text" name="id" hidden defaultValue={Id} />
          <SignUpButton name={"Reset"} />
        </form>
      </div>
    </>
  );
};

export default PasswordReset;
