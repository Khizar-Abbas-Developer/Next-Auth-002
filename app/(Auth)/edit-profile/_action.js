"use server"

import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import {handleImageConversion} from "@/libs/utils/ServerBase64"

export const UpdateProfile = async (prevStat, data) => {
    const userId = data.get("userId");
    const imageFile = data.get("imageFile");
    const username = data.get("username");
    await connectMongoDB();
    let base64Image = null;
    if (imageFile && imageFile.size !== 0) {
        base64Image = await handleImageConversion(imageFile);
    }
    try {
        if (imageFile && imageFile.size !== 0) {
            const updatedUser = await User.findByIdAndUpdate(userId, { username: username, image: base64Image }, { new: true });
            const { username: updatedUsername, email, image, _id, balance } = updatedUser;
            const id = await updatedUser._id.toString();
            const responseData = { username: updatedUsername, email, image, _id: id, balance };
            return { data: responseData, message: "update successfully", status: 200 }
        } else if (!imageFile) {
            const updatedUser = await User.findByIdAndUpdate(userId, { username: username, image: "" }, { new: true });
            const { username: updatedUsername, email, image, _id, balance } = updatedUser;
            const id = await updatedUser._id.toString();
            const responseData = { username: updatedUsername, email, image, _id: id, balance };
            return { data: responseData, message: "update successfully", status: 200 }
        } else {
            const updatedUser = await User.findByIdAndUpdate(userId, { username: username }, { new: true });
            const { username: updatedUsername, email, image, _id, balance } = updatedUser;
            const id = await updatedUser._id.toString();
            const responseData = { username: updatedUsername, email, image, _id: id, balance };
            return { data: responseData, message: "update successfully", status: 200 }
        }
    } catch (error) {
        console.log(error);
        return { message: "Internal Server Error!", status: 500 }
    }
};