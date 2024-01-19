"use server"

import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import User from "@/models/user";
import bcrypt from "bcrypt";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";




export const confirmResetLink = async (prevState, data) => {
    await connectMongoDB();
    const id = data.id;
    const Ttoken = data.token;
    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return { message: "Invalid link", status: 400 }
        }
        const userToken = await Token.findOne({
            userId: user._id,
            token: Ttoken,
        });

        if (!userToken) {
            return { message: "Invalid token. Link verification failed.", status: 400 };
        }
        return {message: "Enter New Password", status: 200}
    } catch (error) {
        console.error("Error confirming reset link:", error);
        return {message: "Internal Server Error", status: 500}
    }
}

export const resetPassword = async(prevState, data)=>{
    const passwordSchema = Joi.object({
		password: passwordComplexity().required().label("Password"),
	  });

    const urlId = data.get("id");
	const urlToken = data.get("token");
	const password = data.get("password")
    await connectMongoDB();
    try {
        const { error } = passwordSchema.validate({ password });
        if (error) {
          return {message: error.details[0].message, status: 400}
        }

        const user = await User.findOne({ _id: urlId });
        if (!user) {
            return {message: "Invalid link", status: 400}
        }

        const token = await Token.findOne({userId: user._id, token: urlToken,});
      
          if (!token) {

            return {message: "Invalid link", status: 400}
          }

          if (!user.verified) {
            user.verified = true;
          }
      
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashPassword = await bcrypt.hash(password, salt);

          user.password = hashPassword;
          await user.save();
          await Token.deleteOne({ _id: token._id });
          return {message: "Password reset successfully", status: 200}
    } catch (error) {
        console.error("Internal Server Error:", error);
        return {message: "Internal Server Error", status: 500}
    }
}