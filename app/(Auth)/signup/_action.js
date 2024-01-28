"use server"
import User, { validate } from "@/models/user";
import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import sendEmail from "@/utils/sendEmail";

//
const generateNumericOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Function to create a new user and generate OTP
const createUsers = async (id) => {
    const token = await new Token({
        userId: id,
        token: generateNumericOTP(),
    }).save();

    return { token };
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
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return { message: "User with given email already exists!", status: 409 }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        const { token } = await createUsers(newUser._id);
        await sendEmail(newUser.email, "verification OTP Code", `${token.token}`, 'otpVerification');
        return { id: newUser._id.toString(), status: 201 }
    } catch (error) {
        console.error(error);
        return { message: "Internal Server Error", status: 500 };
    }
};
