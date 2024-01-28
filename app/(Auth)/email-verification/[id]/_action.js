"use server"

import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import User from "@/models/user";
import sendEmail from "@/utils/sendEmail";

export const verifyEmail = async (prevState, data) => {
    const id = await data
    await connectMongoDB();
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return NextResponse.error('User not found', 404);
        }
        const UserId = await user._id.toString();
        const UserEmail = await user.email;
        return { email: UserEmail, id: UserId, message: "OTP sent for email verification", status: 201 };
    } catch (error) {
        return { message: "Internal Server Error!", status: 500 }
    }
};

//another server action to verify the user
const generateNumericOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Function to create a new user and generate OTP
const generateOTP = async (id) => {
    const token = await new Token({
        userId: id,
        token: generateNumericOTP(),
    }).save();

    return { token };
};
export const verifyUser = async (prevState, data) => {
    const userId = await data.get("id");
    const otpValue = parseInt(`${data.get("digit1")}${data.get("digit2")}${data.get("digit3")}${data.get("digit4")}`, 10);
    connectMongoDB();
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { message: "user not found", status: 404 }
        }
        const existingToken = await Token.findOne({ userId: userId });
        if (!existingToken) {
            const { token } = await generateOTP(user._id)
            await sendEmail(user.email, "verification OTP Code", `${token.token}`, 'otpVerification');
            return { id: user._id.toString(), message: "OTP sent for email verification", status: 201 };
        }
        if (otpValue !== parseInt(existingToken.token, 10)) {
            return { message: "Invalid OTP code", status: 404 };
        }               
        user.verified = true;
        await Token.findByIdAndDelete(existingToken._id);
        await user.save();
        return { message: "Email verified successfully!", status: 200 }
    } catch (error) {
        console.error(error);
        return { message: "Internal Server Error!", status: 500 }
    }
}