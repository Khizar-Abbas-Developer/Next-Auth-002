"use client"
import React, { useEffect, useState } from "react";
import { Metadata } from 'next'
import loginSignUpImage from "@/public/empty-profile.png";
import { FaCloudUploadAlt } from "react-icons/fa";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { FadeLoader, ScaleLoader } from "react-spinners";
import { UpdateUserFailure, UpdateUserSucess, updateUserStart } from "@/redux/userSlice";


export default function UserProfileEdit() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const tempImage = loginSignUpImage;
  const [loadingImage, setLoadingImage] = useState(true);
  const currentUser2 = useSelector((state) => state.user);
  const [condition, setCondition] = useState(true);
  const [loading, setLoading] = useState(false);
  const [myUserName, setMyUserName] = useState(currentUser?.username || "");
  const [myUserImage, setMyUserImage] = useState(currentUser?.image || "");
  const [dataToUpdate, setDataToUpdate] = useState({});
  const circleStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    border: "4px solid transparent",
    backgroundImage: "linear-gradient(49deg, #f09433, #e6683c, #dc2743, #cc2366)",
  };
  const image = currentUser?.image;
  const name = currentUser?.username;
  const email = currentUser?.email;
  const metadata = {
    title: { name },
    description: { email },
    image: { image }
  }

  useEffect(() => {
    // Set myUserImage initially when currentUser is available
    if (currentUser?.image) {
      setMyUserImage(currentUser.image);
      setLoadingImage(false); // Set loading to false after setting the image
    } else {
      setMyUserImage(tempImage);
      setLoadingImage(false); // Set loading to false after setting the image
    }
  }, [currentUser, tempImage]);

  const removeTheProfilePic = () => {
    setMyUserImage("");
  };

  const handleUploadProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setMyUserImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setDataToUpdate((prevState) => ({ ...prevState, image: myUserImage, name: myUserName }));
    try {
      dispatch(updateUserStart());
      const id = currentUser?._id;
      const res = await axios.post(`/api/edit-profile/${id}`, {
        image: myUserImage,
        name: myUserName,
      });
      if (res.status === 200) {
        dispatch(UpdateUserSucess(res.data));
        toast.success("Profile updated successfully 🥳");
        setLoading(false)
      }
    } catch (error) {
      dispatch(UpdateUserFailure(error));
      console.error(error)
      toast.error(error)
      setLoading(false)
    }
  };
  // useEffect(() => {
  //   if (currentUser?.image) {
  //     setCondition(true)
  //   } else {
  //     setCondition(false)
  //   }
  // }, [setCondition, currentUser?.image])
  return (
    <div className="flex h-screen items-center justify-center bg-white z-0">
      {loadingImage ? (
        // Loader component or placeholder for loading state
        <FadeLoader color="#EF4444" speedMultiplier={5} />
      ) : (
        <div className="gap-4 w-screen max-w-md rounded-xl p-6 my-12 bg-gray-100">
          <h1 className="text-3xl md:2xl text-center font-bold mb-4">
            User Profile Edit
          </h1>

          <div className="flex flex-col items-center space-y-6">
            <div className="flex">
              <div className="w-28 h-28 overflow-hidden rounded-full flex justify-center items-center border-4 border-red-500 -mr-3">
                <Image
                  loader={({ src }) => src}
                  src={myUserImage || tempImage}
                  width={120}
                  height={120}
                  priority
                  unoptimized
                  alt="avatar-animation"
                  className='rounded-full h-auto w-[120px] z-1'
                  aria-label="profile"
                />
              </div>
              <div className="-ml-6">
                {condition && (
                  <button
                    onClick={removeTheProfilePic}
                    className="flex justify-center items-center top-0 -right-3 text-lg bg-red-500 text-white px-2 py-2 rounded-full border-2"
                    aria-label="Remove Profile Picture"
                  >
                    <SmallCloseIcon className="text-lg" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 w-full mx-auto">
              <label htmlFor="fileInput" className="cursor-pointer" aria-label="profile">
                <FaCloudUploadAlt className="text-5xl" />
                <input type="file" accept="image/*" onChange={handleUploadProfileImage} style={{ display: "none" }} id="fileInput" aria-label="upload-profile" />
              </label>
            </div>
          </div>
          {/* Username input field */}
          <div className="mt-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700" aria-label="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="mt-1 p-2 border rounded-md w-full"
              value={myUserName}
              autoComplete="off"
              onChange={(e) => setMyUserName(e.target.value)}
              arial-label="input-username"
            />
          </div>
          {/* Email input field */}
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700" aria-label="email">
              Email
            </label>
            <input type="email" name="email" id="email" className="mt-1 p-2 font-bold border rounded-md w-full" value={currentUser?.email} aria-label="input-email" autoComplete="off" disabled />
          </div>

          {/* Update button */}
          <div className="mt-6">
            <button
              className="bg-red-400 text-white w-full hover:bg-red-500 h-10 rounded-md font-bold text-xl"
              onClick={handleSubmit}
              aria-label="submit"
            >
              {!loading ? "Update" : <ScaleLoader color="#FFFF00" height={20} width={4} />
              }
            </button>
          </div>
          {/* Delete account and reset password links */}
          <div className="flex justify-between font-semibold mt-4">
            <div>
              <Link href={"/forgot-password"} aria-label="Reset Password">
                <p className="text-red-700 text-xs md:text-base">Reset Password</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
