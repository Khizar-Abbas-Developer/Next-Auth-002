"use server"

import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import User from "@/models/user";
import sendEmail from "@/utils/sendEmail";
import Joi from "joi";

const generateNumericOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Function to create a new user and generate OTP
const generateOTP = async (id) => {
    const token = await new Token({
        userId: id,
        token: generateNumericOTP(),
    }).save();

    return { token };
};
export const ForgotAPI = async (prevState, data) => {
    connectMongoDB();
    const email = data.get("email");
    const emailSchema = Joi.object({
        email: Joi.string().email().required().label("Email"),
    });
    try {
        const { error } = emailSchema.validate({ email });
        if (error) {
            return { message: error.details[0].message, status: 400 }
        }
        let user = await User.findOne({ email });
        if (!user) {
            return { message: "User with given email does not exist! Create an account", status: 400 }
        }
        let existingToken = await Token.findOne({ userId: user._id });
        if (existingToken) {
            // Token already exists, indicating that the reset link has already been sent
            return { message: "Reset Link already sent try again after 1 hour", status: 404 }
        }
        const { token } = await generateOTP(user._id)
        await sendEmail(user.email, "Reset Password OTP Code", `${token.token}`, 'Reset Password');
        return { id: user._id.toString(), message: "OTP sent for email verification", status: 201 };
    } catch (error) {
        console.error(error)
        return { message: "Internal Server Error!", status: 500 }
    }
}