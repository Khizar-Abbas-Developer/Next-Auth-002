"use client"
import { ImagetoBase64 } from '@/utils/ImagetoBase64';
import Image from 'next/image';
import loginSignUpImage from "@/public/empty-profile.png";
import { useFormState } from "react-dom";
import SignUpButton from "@/components/SubmitButton/SubmitButton";
import { BiSolidEditAlt } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { updateUser } from './_action';
import toast from 'react-hot-toast';
import { UpdateUserFailure, UpdateUserSucess, updateUserStart } from '@/redux/userSlice';
import { BeatLoader, FadeLoader } from 'react-spinners';
const Profile = () => {
  const [loadingImage, setLoadingImage] = useState(true);
  const tempImage = loginSignUpImage;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [myUserName, setMyUserName] = useState(currentUser?.username || "");
  const [myUserImage, setMyUserImage] = useState(currentUser?.image || null);
  const [response, formAction] = useFormState(updateUser, 0);

  useEffect(() => {
    // Set myUserImage initially when currentUser is available
    if (currentUser?.image) {
      setMyUserImage(currentUser.image);
      setLoadingImage(false); // Set loading to false after setting the image
    }
  }, [currentUser]);

  const handleUploadProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setMyUserImage(base64Image);
        setLoadingImage(false); // Set loading to false after setting the image
      };
      reader.readAsDataURL(file);
    }
  };
  //handle response
  useEffect(() => {
    dispatch(updateUserStart());
    const handleResponse = () => {
      const bad_Request = 400;
      const success = 200;
      const server_Error = 500;
      const conflict = 409;
      if (response.status === success) {
        dispatch(UpdateUserSucess(response.user))
        toast.success(response.message);
      } else if (response.status === bad_Request) {
        dispatch(UpdateUserFailure())
        toast.error(response.message);
      } else if (response.status === server_Error) {
        dispatch(UpdateUserFailure())
        toast.error(response.message);
      } else if (response.status === conflict) {
        dispatch(UpdateUserFailure())
        toast.error(response.message)
      }
    };

    if (response) {
      handleResponse();
    }
  }, [response, dispatch]);
  return (
    <>
      <div className="p-3 bg-slate-100 min-h-[calc(100vh)]">
        <div className="w-full max-w-sm bg-white m-auto flex items-center flex-col p-4 mt-24 shadow-md rounded-md">
          <form
            className="w-full py-3 flex flex-col"
            action={async (formData) => {
              // Assuming the formAction function is defined correctly
              formAction(formData);
            }}
          >
<div className="flex justify-center items-center w-32 h-32 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative z-50">
  {loadingImage ? (
    // You can add a placeholder or loading spinner here
    <FadeLoader color="#EF4444" speedMultiplier={5} />
  ) : (
    <Image
      loader={({ src }) => src}
      src={myUserImage || tempImage}
      width={200}
      height={200}
      unoptimized
      priority
      alt="avatar-animation"
    />
  )}
  <label htmlFor="profileImage" className="absolute bottom-0 h-1/3 w-full text-center cursor-pointer z-10">
    <div className="flex justify-center items-center h-full bg-slate-500 bg-opacity-50">
      <p className="text-sm p-1 text-white">
        <BiSolidEditAlt className="text-4xl text-black" />
      </p>
    </div>
  </label>
  {/* Input tag for selecting a new image */}
  <input
    type="file"
    id="profileImage"
    accept="image/*"
    className="hidden"
    name="image"
    onChange={handleUploadProfileImage}
  />
</div>

            <label htmlFor="username">Username</label>
            <input
              className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
              type={"text"}
              defaultValue={currentUser?.username}
              id="username"
              name="username"
              autoComplete="off"
            />

            <label htmlFor="email">Email</label>
            <input
              className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
              type={"email"}
              id="email"
              defaultValue={currentUser?.email}
              disabled
              name="email"
              autoComplete="on"
            />
            <input type="text" hidden defaultValue={currentUser?._id} name='id' />
            <SignUpButton name={"Update"} />
          </form>
          <p className="text-left w-full text-sm mt-2">
            Already have Account ?{" "}
            <Link href={"/login"} className="text-red-500 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Profile;