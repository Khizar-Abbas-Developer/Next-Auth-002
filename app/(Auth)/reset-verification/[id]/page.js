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
  const [state, setState] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  const [userId, setUserId] = useState(null); // State to store user email
  const [loading, setLoading] = useState(false); // State to track loading state
  const [response, formAction] = useFormState(verifyEmail, 0);
  const [responseAgain, verify] = useFormState(verifyUser, 0)


  const handleFormAction = () => {
    setLoading(true)
    formAction(usersId);
  }

  //handle
  useEffect(() => {
    const handleResponse = () => {

      if (response.status === 201) {
        const email = response.email;
        setUserId(response.id);
        setUserEmail(response.email);
        setState(true)
        setLoading(false);
        toast.success(response.message)
      } else if (response.status === 404) {
        setState(true)
        toast.error(response.message);
      } else if (response.status === 500) {
        setState(true)
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
        redirect(`/password-reset/${responseAgain.id}`)
      } else if (responseAgain.status === 201) {
        router.replace(`/reset-verification/${response.id}`)
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
  }, [responseAgain, response.id, router]);
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
          {userEmail ? <OtpForm userEmail={userEmail} userId={userId} /> : null}
          {/* <h1 className="text-center flex justify-center items-center h-96 text-3xl">Verification token is expired!</h1> */}
        </form>
        {
          !state && (
            <div className="flex justify-center items-center h-full mt-24">
              <button onClick={handleFormAction} className="px-4 py-4 bg-black text-red-500 border-none rounded-lg text-md">Click to Verify</button>
            </div>
          )
        }
      </>
    </>
  );
};

export default Page;
