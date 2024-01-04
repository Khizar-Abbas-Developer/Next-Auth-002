"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { SmallCloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import Loader from "@/app/(Auth)/(Loader2)/thirdLoader/loading";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { UpdateUserFailure, UpdateUserSucess, updateUserStart } from "@/components/redux/userSlice";

export default function UserProfileEdit() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentUser2 = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [myUserName, setMyUserName] = useState(currentUser?.username || ""); // Add a check for currentUser
  const [myUserImage, setMyUserImage] = useState(currentUser?.image || ""); // Add a check for currentUser
  const [dataToUpdate, setDataToUpdate] = useState({});
  const circleStyle = {
    width: "100px",
    height: "100px", 
    borderRadius: "50%",
    border: "4px solid transparent",
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
    backgroundImage: "linear-gradient(49deg, #f09433, #e6683c, #dc2743, #cc2366)",
  };

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
// handle submit is starting from here
const handleSubmit = async (e) => {
  e.preventDefault();
  setDataToUpdate((prevState) => ({ ...prevState, image: myUserImage, name: myUserName }));

  try {
    dispatch(updateUserStart());
    const id = currentUser?._id;
    const res = await axios.post(`/api/users/getData/${id}`, {
      image: myUserImage,
      name: myUserName,
    });
    dispatch(UpdateUserSucess(res.data));
    toast.success("Profile updated successfully 🥳");
    // window.location.reload();
  } catch (error) {
    dispatch(UpdateUserFailure(error));
    console.error("Error updating profile:", error);
    toast.error("Something went wrong");
  }
};
  //handle submit is ending here
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      {currentUser2.loading ? (
        <Loader />
      ) : (
        <Stack spacing={4} w={"full"} maxW={"md"} rounded={"xl"} boxShadow={"lg"} p={6} my={12}>
          {/* Heading is starting from here */}
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          {/* Heading is ending here */}
          {/* Profile input field is starting from here */}
          <FormControl id="userIcon">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar src={myUserImage} boxShadow="2px 2px 5px rgba(0, 0, 0, 0.1)" style={circleStyle} alt={`user's avatar`}>
                  <AvatarBadge as={IconButton} size="sm" rounded="full" top="-10px" bgColor={"red"} aria-label="remove Image" icon={<SmallCloseIcon onClick={removeTheProfilePic} bg={"red"} w={"30px"} h={"30px"} borderRadius={"50%"} color={"white"} />} alt="logo3d" />
                </Avatar>
              </Center>
              <Center w="full">
                <input type="file" accept="image/*" onChange={handleUploadProfileImage} style={{ display: "none" }} id="fileInput" />
                <label htmlFor="fileInput">
                  <Button w="full" as="span" boxShadow={"2px 2px 5px rgba(0, 0, 0, 0.1)"} cursor={"pointer"}>Change Icon</Button>
                </label>
              </Center>
            </Stack>
          </FormControl>
          {/* Profile input field is ending here */}
          {/* Username input field is starting from here */}
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input placeholder="Username" _placeholder={{ color: "gray.500" }} type="text" defaultValue={myUserName} autoComplete="off" onChange={(e) => setMyUserName(e.target.value)} />
          </FormControl>
          {/* Username input field is ending here */}
          {/* Email input field is starting from here */}
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="text" color={"black"} fontWeight={"semi-bold"} defaultValue={currentUser?.email} autoComplete="off" disabled />
          </FormControl>
          {/* Email input field is ending here */}
          {/* Update button of profile edit page is starting from here */}
          <Stack spacing={6} direction={["column", "row"]}>
            <button className="bg-red-400 text-white w-full hover:bg-red-500 h-10 rounded-md font-bold text-xl" _hover={{ bg: "blue.500", }} onClick={handleSubmit}> Update </button>
          </Stack>
          {/* Update button of profile edit page is ending here */}

          {/* Div which contain Delete account and reset password starting from here */}
          <div className="flex justify-between font-semibold">
            <div>
              <p className="text-red-700 text-xs md:text-base">Delete Account</p>
            </div>
            <Link href={"/forgot-password"}>
              <p className="text-red-700 text-xs md:text-base">Reset Password</p>
            </Link>
          </div>
          {/* Div which contain Delete and reset password starting from here */}
        </Stack>
      )}
    </Flex>
  );
}
