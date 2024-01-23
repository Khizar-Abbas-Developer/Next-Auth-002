"use server"

import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { handleImageConversion } from "@/utils/ServerBase64";

export const updateUser = async (prevState, data) => {
    const imageFile = await data.get("image");
    const inputUsername = data.get("username"); // Rename to inputUsername for clarity
    const id = data.get("id");
    try {
        await connectMongoDB();
        const user = await User.findByIdAndUpdate(id, { username: inputUsername }, { new: true });

        if (!user) {
            return { message: "User not found!", status: 400 };
        }

        if (imageFile) {
            const image = await handleImageConversion(imageFile);
            user.image = image;
            await user.save();
        }
        const userId = user._id.toString();
        const { username, email, _id, image } = user;
        const newUser = { username, email, _id: userId, image };
        return { user: newUser, message: "Profile updated successfully!", status: 200 };
    } catch (error) {
        console.error(error);
        return { message: "Internal Server Error", status: 500 };
    }
}