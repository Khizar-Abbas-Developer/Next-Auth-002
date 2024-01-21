// use-server/createUser.js
"use server"
import User, { validate } from "@/models/user";
import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/utils/sendVerification";
import { handleImageConversion } from "@/utils/ServerBase64";

export const createUser = async (prevState, data) => {
    const imageFile = await data.get("image");
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');
    const confirmpassword = data.get("confirmpassword");
    const image = await handleImageConversion(imageFile);
    await connectMongoDB();
    try {
        const { error } = validate({ username, email, password, image });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return { message: errorMessage, status: 400 };
        }
        if (!confirmpassword) {
            return { message: `please confirm your password`, status: 400 }
        }
        if (password !== confirmpassword) {
            return { message: `password and confirm password should match`, status: 400 }
        }
        // Hash the password after validation
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.findOne({ email });
        if (user) {
            return { message: `user with given email already exists!`, status: 409 }
        }

        user = await User.create({ username, email, password: hashedPassword, image });
        await sendVerificationEmail(user);
        return { message: `Verification link sent to ${user.email}`, status: 201 }
    } catch (error) {
        return { message: `Internal Server Error`, status: 500 }
    }
};
