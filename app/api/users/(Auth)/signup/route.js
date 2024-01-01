import { User, validate } from "@/models/user";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "@/utils/sendEmail";
import Token from "@/models/token";

const createUser = async (requestData) => {
    const { firstName, lastName, password, email } = requestData;
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await new User({ ...requestData, password: hashPassword }).save();
    return user;
};

const sendVerificationEmail = async (user) => {
    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex")
    }).save();
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Email Verification", url);
};
export const POST = async (request) => {
    try {
        await connectMongoDB();

        const requestData = await request.json();
        const { error } = validate(requestData);

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        }

        const { email } = requestData;

        // Check if user with the given email already exists
        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ message: "User with given email already exists!" }, { status: 409 });
        }

        // Create a new user
        user = await createUser(requestData);

        // Send verification email
        await sendVerificationEmail(user);

        return NextResponse.json({ message: "An Email sent to your account, please verify" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

