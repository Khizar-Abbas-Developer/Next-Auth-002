"use server"
import User, { validate } from "@/models/user";
import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "@/utils/sendEmail";

//
const sendVerificationEmail = async (user) => {
    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex")
    }).save();
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Email Verification", url);
    return true;
};
//
export const createUser = async (prevState, data) => {
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');
    const confirmpassword = data.get("confirmpassword");
    try {
        await connectMongoDB();

        const { error } = validate({ username, email, password });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return { message: errorMessage, status: 400 }
        }
        if (password !== confirmpassword) {
            return { message: "password and confirm password should match!", status: 400 }
        }
        // Check if user with the given email already exists
        const hashedPassword = await bcrypt.hash(password, 10);

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return { message: "User with given email already exists!", status: 409 }
        }
        let newUser = await User.create({ username, email, password: hashedPassword });
        // Send verification email
        await sendVerificationEmail(newUser);

        return { message: `Verification link send to ${newUser.email}`, status: 201 }
    } catch (error) {
    console.error(error);
    return { message: "Internal Server Error", status: 500 };
}
};
