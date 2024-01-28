"use server"

import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import User from "@/models/user";
import bcrypt from "bcrypt";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const resetPassword = async(prevState, data)=>{
    const passwordSchema = Joi.object({
		password: passwordComplexity().required().label("Password"),
	  });
    const id = data.get("id");
	const password = data.get("password")
    await connectMongoDB();
    try {
        const { error } = passwordSchema.validate({ password });
        if (error) {
          return {message: error.details[0].message, status: 400}
        }
        const user = await User.findOne({ _id: id });
        if (!user) {
            return {message: "Invalid link", status: 400}
        }
          const hashPassword = await bcrypt.hash(password, 10);
          user.password = hashPassword;
          await user.save();
          return {message: "Password reset successfully", status: 200}
    } catch (error) {
        console.error("Internal Server Error:", error);
        return {message: "Internal Server Error", status: 500}
    }
}