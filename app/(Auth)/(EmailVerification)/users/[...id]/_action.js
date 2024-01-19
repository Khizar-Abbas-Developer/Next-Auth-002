"use server"

import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import User from "@/models/user";


export const verifyEmail = async (prevState, data) => {
    const taken = data.token;
    const id = data.id;
    await connectMongoDB();
    try {
        const user = await User.findOne({ _id: id });
  
      if (!user) {
        return { message: "Invalid link", status: 400 };
      }
  
      const token = await Token.findOne({
        userId: user._id,
        token: taken,
      });
  
      if (!token) {
        return { message: "Token expired", status: 400 };
      }
  
      if (token.expiryDate < Date.now()) {
        return { message: "Token Expired", status: 400 };
      }
  
      user.verified = true;
      await user.save();
      await Token.deleteOne({ _id: token._id });
      return { message: "Email verified successfully", status: 200 };
    } catch (error) {
      console.error(error);
      return { message: "Internal Server Error", status: 500 };
    }
  };