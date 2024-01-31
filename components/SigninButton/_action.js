"use server"

import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { validate2 } from "@/models/user";

export const signInGoogle = async (data) => {
    const { username, email, image } = await data;
    const password = "";
    await connectMongoDB();
    try {
        const user = await User.findOne({ email });
        if (user) {
            const { username, email: userEmail, image, balance } = user;
            const userId = user._id.toString();
            // Create a new object with the desired properties
            const userData = { username, email: userEmail, _id: userId, image, balance };
            return { data: userData, message: "Logged in successfully", status: 200 };
        } else {
            const { error } = validate2({ email, username, image });
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return NextResponse.json({ message: errorMessage }, { status: 400 });
            }
            const newUser = await User.create({ username, email, image, password, verified: true })
            await newUser.save();
            const { username: savedUsername, email: savedUserEmail, image: savedImage, balance } = newUser;
            const userId = newUser._id.toString();
            const userData = { username: savedUsername, email: savedUserEmail, image: savedImage, _id: userId, balance }
            return { data: userData, id: userId, message: "Create New password", status: 201 };
        }
    } catch (error) {
        console.error(error);
        return { message: "Internal Server Error!", status: 500 }
    }
}