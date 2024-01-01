import { User } from "@/models/user";
import bcrypt from "bcrypt";
import Joi from "joi";
import Token from "@/models/token";
import crypto from "crypto";
import sendEmail from "@/utils/sendEmail";
import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";

export const POST = async (req, res) => {
  await connectMongoDB();
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid Email or Password" }, { status: 401 });
    }

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        const tokenValue = crypto.randomBytes(32).toString("hex");
        token = await new Token({ userId: user._id, token: tokenValue }).save();
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}users/${user._id}/verify/${tokenValue}`;
        await sendEmail(user.email, "Verify Email", url);
      }

      return NextResponse.json({ message: "Please verify your email account first!" }, { status: 400 });
    }

    const { username, email: userEmail, _id, image, balance } = user;
    const bUser = { username, email: userEmail, _id, image, balance };

    return NextResponse.json({ bUser, message: "Logged in successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};