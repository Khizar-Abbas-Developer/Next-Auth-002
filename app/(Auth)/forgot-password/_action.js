"use server"

import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import User from "@/models/user";
import sendEmail from "@/utils/sendEmail";
import crypto from "crypto";
import Joi from "joi";

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

        let token = await Token.findOne({ userId: user._id });
        if (token) {
            // Token already exists, indicating that the reset link has already been sent
            return { message: "Reset Link already sent try again after 1 hour", status: 200 }
        }

        // If token doesn't exist, generate a new one and proceed to send the reset link
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/password-reset/${user._id}/${token.token}/`;
        await sendEmail(user.email, "Password Reset", url);

        return { message: `Password reset link sent to ${user.email}`, status: 200 }
    } catch (error) {
        return {message: "Internal Server Error!", status: 500}
    }
}