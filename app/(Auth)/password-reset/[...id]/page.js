"use client";

import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import {
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Loader from "../../(Loader2)/thirdLoader/loading";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PasswordReset = ({ params }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validUrl, setValidUrl] = useState(null);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const id = params.id[0];
  const token = params.id[1];
  const router = useRouter();
  const url = `/api/users/password-reset/${id}/${token}`;

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
        setError("Your Password Reset Link is expired!");
      } finally {
        setLoading(false);
      }
    };
    verifyUrl();
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data } = await axios.post(url, { password });
      setMsg(data.message);
      toast.success("Password Reset Successfully");
      setError("");
      setLoading(false)
      router.replace("/login")
      // Redirect or handle success
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setLoading(false)
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };

  return (
    <Fragment>
      {loading && <Loader />}
      {validUrl === null && !loading && (
        <div className="flex justify-center items-center text-2xl h-96 ml-2 text-center md:ml-0 md:mr-0">
          Checking the password reset link...
        </div>
      )}
      {validUrl === false && !loading && (
        <div className="flex justify-center items-center text-2xl h-96 ml-2 text-center md:ml-0 md:mr-0">
          {error}
        </div>
      )}
      {validUrl && !loading && (
        <div className={styles.container}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1 className="text-2xl mb-4 font-bold text-center md:text-left">
              Add New Password
            </h1>
            <FormControl id="password" isRequired>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`${styles.input} md:w-64`}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1rem"
                    fontSize={"20px"}
                    size="sm"
                    variant="ghost"
                    border={"none"}
                    marginTop={"10px"}
                    onClick={() => setShowPassword((show) => !show)}
                  >
                    {showPassword ? (
                      <ViewIcon cursor={"pointer"} />
                    ) : (
                      <ViewOffIcon cursor={"pointer"} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {error && <div className={styles.error_msg}>{error}</div>}
            {msg && <div className={styles.success_msg}>{msg}</div>}
            <button className="w-full max-w-[120px] m-auto bg-red-500 hover:bg-red-600 cursor-pointer text-white text-xl font-medium text-center py-1 rounded-full mt-4">
              Reset
            </button>
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default PasswordReset;
