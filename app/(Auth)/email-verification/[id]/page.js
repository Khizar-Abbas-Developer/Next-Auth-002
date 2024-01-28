"use client"
import { useEffect, useRef, useState } from 'react';
import OtpForm from '@/components/OtpForm/page';
import { verifyEmail, verifyUser } from './_action';
import { useFormState } from "react-dom";
import toast from 'react-hot-toast';
import Loader from '@/components/Loader/Loader';
import { redirect, useRouter } from 'next/navigation';

const Page = ({ params }) => {
  const usersId = params.id;
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  const [userId, setUserId] = useState(null); // State to store user email
  const [loading, setLoading] = useState(true); // State to track loading state
  const [response, formAction] = useFormState(verifyEmail, 0);
  const [responseAgain, verify] = useFormState(verifyUser, 0)
  useEffect(() => {
    return () => {
      formAction(usersId);
    }
  }, [usersId, formAction]);

  //handle
  useEffect(() => {
    const handleResponse = () => {

      if (response.status === 201) {
        const email = response.email;
        setUserId(response.id);
        setUserEmail(response.email);
        setLoading(false);
        toast.success(response.message)
      } else if (response.status === 404) {
        toast.error(response.message);
      } else if (response.status === 500) {
        toast.error(response.message);
      }
    };

    if (response) {
      handleResponse();
    }
  }, [response]);
  //handle second response which is verifyResponse
  useEffect(() => {
    const verifyResponse = () => {

      if (responseAgain.status === 200) {
        setLoading(false);
        toast.success(responseAgain.message)
        redirect("/login")
        toast.success(responseAgain.message)
      } else if(responseAgain.status === 201){
        redirect(`/email-verification/${response.id}`)
        toast.success(responseAgain.message)
      } else if (responseAgain.status === 404) {
        toast.error(responseAgain.message);
      } else if (responseAgain.status === 500) {
        toast.error(responseAgain.message);
      }
    };
    if (responseAgain) {
      verifyResponse();
    }
  }, [responseAgain, response.id]);
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <>
        <form
          action={async (formData, userId) => {
            verify(formData, userId);
          }}
        >
          {userEmail ? <OtpForm userEmail={userEmail} userId={userId} /> : <h1 className="text-center flex justify-center items-center h-96 text-3xl">Verification token is expired!</h1>}
        </form>
      </>
    </>
  );
};

export default Page;
