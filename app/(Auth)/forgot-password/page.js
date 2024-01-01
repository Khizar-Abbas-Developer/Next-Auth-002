"use client"

import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Loader from "../(Loader2)/thirdLoader/loading";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = `/api/users/password-reset`;
      const { data } = await axios.post(url, { email });
      toast.success(data.message)
      setMsg(data.message);
      setError("");
      setLoading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setLoading(false);
        toast.error(error.response.data.message)
        setMsg("");
      }
    }
    setEmail("");
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.container}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1 className="text-2xl mb-4 font-extrabold tracking-wide">Forgot your password?</h1>
              <h3>You'll get an email with a reset link</h3>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                autoComplete="off"
                className={styles.input}
              />
              {msg && <div className={styles.success_msg}>{msg}</div>}
              <button className="w-full max-w-[120px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4">
            Submit
          </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
