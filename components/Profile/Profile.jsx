"use client"
import React, { useEffect, useState } from "react";
import loginSignUpImage from "@/public/empty-profile.png";
import { FaCloudUploadAlt } from "react-icons/fa";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { toast } from "react-hot-toast";
import { useFormState } from "react-dom";
import axios from "axios";
import { UpdateProfile } from "@/app/(Auth)/edit-profile/_action";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { FadeLoader, ScaleLoader } from "react-spinners";
import { UpdateUserFailure, UpdateUserSucess, signInFailure, updateUserStart } from "@/redux/userSlice";
import { SubmitButton } from "../SubmitButton/SubmitButton";
import { redirect, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import Skeleton from "./Skeleton";

const Profile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const tempImage = loginSignUpImage;
    const [loadingImage, setLoadingImage] = useState(true);
    const currentUser2 = useSelector((state) => state.user);
    const [condition, setCondition] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sent, setSend] = useState(true);
    const [response, formAction] = useFormState(UpdateProfile, 0);
    const [myUserName, setMyUserName] = useState(currentUser?.username || "");
    const [myUserImage, setMyUserImage] = useState(currentUser?.image || "");
    const [dataToUpdate, setDataToUpdate] = useState({});
    useEffect(() => {
        if (!currentUser?._id) {
            redirect("/login")
            // router.push("/login");
        }
    }, [router, currentUser]);
    const circleStyle = {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        border: "4px solid transparent",
        backgroundImage: "linear-gradient(49deg, #f09433, #e6683c, #dc2743, #cc2366)",
    };

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
        setSend(false)
    };
    const handleUploadProfileImage = (e) => {
        setSend(true);
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
    useEffect(() => {
        const handleResponse = () => {
            const success = 200;
            const server_Error = 500;
            dispatch(updateUserStart());
            if (response.status === success) {
                dispatch(UpdateUserSucess(response.data));
                toast.success("update successfully");
                setLoading(false)
            }
            else {
                dispatch(signInFailure(response.message));
                toast.error(response.message);
            }
        };
        if (response) {
            handleResponse();
        }
    }, [response, dispatch]);
    return (
        <>
            <div className="flex h-screen items-center justify-center bg-white z-0">
                {loadingImage ? (
                    // Loader component or placeholder for loading state
                    // <FadeLoader color="#EF4444" speedMultiplier={5} />
                    <>
                        <Skeleton />
                    </>
                ) : (
                    <form
                        action={async (formData) => {
                            formAction(formData);
                        }}
                    >
                        <div className="gap-4 w-screen max-w-md rounded-xl p-6 my-12 bg-gray-100">
                            <h1 className="text-3xl md:2xl text-center font-bold mb-4">
                                User Profile Edit
                            </h1>

                            <div className="flex flex-col items-center space-y-6">
                                <div className="flex">
                                    <div className="w-28 h-28 overflow-hidden rounded-full flex justify-center items-center border-4 border-red-500 -mr-3">
                                        <div className="flex justify-center items-center gap-4 w-full mx-auto bg-red-600">
                                            <label htmlFor="fileInput" className="cursor-pointer" aria-label="profile">
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
                                                <input type="file" accept="image/*" name={`${sent && "imageFile"}`} onChange={handleUploadProfileImage} style={{ display: "none" }} id="fileInput" aria-label="upload-profile" />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="-ml-6">
                                        {condition && (

                                            <SmallCloseIcon className="text-3xl cursor-pointer border border-white p-1 bg-red-500 rounded-full" onClick={removeTheProfilePic} />
                                        )}
                                    </div>
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
                                    name="username"
                                    value={myUserName}
                                    autoComplete="off"
                                    onChange={(e) => setMyUserName(e.target.value)}
                                    arial-label="input-username"
                                />
                                <input type="text" id="userId" name="userId" defaultValue={currentUser && currentUser._id} hidden />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700" aria-label="email">
                                    Email
                                </label>
                                <input type="email" id="email" name="email" className="mt-1 p-2 font-bold border rounded-md w-full" value={currentUser?.email} aria-label="input-email" autoComplete="off" disabled />
                            </div>

                            {/* Update button */}
                            <div className="mt-6">
                                <SubmitButton name={"Update"} />
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
                    </form>
                )}
            </div >
        </>
    )
}

export default Profile