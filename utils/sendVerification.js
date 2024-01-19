import Token from "@/models/token";
import crypto from 'crypto';
import sendEmail from "./sendEmail";


export const sendVerificationEmail = async (user) => {
    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex")
    }).save();
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Email Verification", url);
};