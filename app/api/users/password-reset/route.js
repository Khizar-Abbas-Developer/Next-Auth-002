import User from "@/models/user";
import Token from "@/models/token";
import crypto from "crypto";
import sendEmail from "@/utils/sendEmail";
import Joi from "joi";
import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";

// send password link
export const POST = async (req, res) => {
    connectMongoDB();
    try {
        const { email } = await req.json();
        const emailSchema = Joi.object({
            email: Joi.string().email().required().label("Email"),
        });
        const { error } = emailSchema.validate({ email });
        if (error)
            return NextResponse.json(
                { message: error.details[0].message },
                { status: 400 }
            );

        let user = await User.findOne({ email });
        if (!user)
            return res.status(409).send({
                message: "User with given email does not exist! Create an account",
            });

        let token = await Token.findOne({ userId: user._id });
        if (token) {
            // Token already exists, indicating that the reset link has already been sent
            return NextResponse.json(
                {
                    message: "Reset Link already sent try again after 1 hour",
                },
                { status: 200 }
            );
        }

        // If token doesn't exist, generate a new one and proceed to send the reset link
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/password-reset/${user._id}/${token.token}/`;
        await sendEmail(user.email, "Password Reset", url);

        return NextResponse.json(
            { message: "Password reset link sent to your email account" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
