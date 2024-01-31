"use server";
import User, { validate } from "@/models/user";
import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import bcrypt from "bcrypt";
import sendEmail from "@/utils/sendEmail";

const generateNumericOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const generateOTP = async (id) => {
    const token = await Token.create({
        userId: id,
        token: generateNumericOTP(),
    });

    return { token };
};

export const createUser = async (data) => {
    const { username, email, password, confirmpassword } = data;
    try {
        await connectMongoDB();
        const { error } = validate({ username, email, password });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return { message: errorMessage, status: 400 };
        }
        if (password !== confirmpassword) {
            return { message: "Password and confirm password should match!", status: 400 };
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { message: "User with given email already exists!", status: 409 };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        const { token } = await generateOTP(newUser._id);
        await sendEmail(newUser.email, "verification OTP Code", `${token.token}`, 'otpVerification');
        return { id: newUser._id.toString(), status: 201 };
    } catch (error) {
        console.error(error);
        return { message: "Internal Server Error", status: 500 };
    }
};