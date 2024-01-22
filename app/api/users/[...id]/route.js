import User from "@/models/user";
import Token from "@/models/token";
import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";

export const GET = async (req, res) => {
  const parameter = res.params;
  const taken = parameter.id[2];
  const id = parameter.id[0];
  connectMongoDB();
  
  try {
      const user = await User.findOne({ _id: id });
      if (!user) {
          return NextResponse.json({ message: "Invalid link" }, { status: 400 });
      }
      const token = await Token.findOne({
          userId: user._id,
          token: taken,
      });
      if (!token) {
          return NextResponse.json({ message: "Token expired" }, { status: 400 });
      }

      if (token.expiryDate < Date.now()) {
          return NextResponse.json({ message: "Token expired" }, { status: 400 });
      }

      // Update user verification status
      user.verified = true;
      await user.save();

      // Remove the token using deleteOne
      await Token.deleteOne({ _id: token._id });

      return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};