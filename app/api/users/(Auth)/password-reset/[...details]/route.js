import { User } from "@/models/user";
import Token from "@/models/token";
import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import bcrypt from "bcrypt";


export const GET = async (req, res) => {
  try {
    connectMongoDB();
	const param = await res.params;
	const id = param.details[0];
	const Ttoken = param.details[1];

    const user = await User.findOne({ _id: id });

    if (!user) {
      return NextResponse.json({ message: "Invalid link" }, { status: 400 });
    }

    const userToken = await Token.findOne({
      userId: user._id,
      token: Ttoken,
    });

    if (!userToken) {
      return NextResponse.json({ message: "Invalid link" }, { status: 400 });
    }
    return NextResponse.json({ message: "Valid Url" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};




export const POST = async (req, res) => {
	const param = await res.params;
	const urlId = param.details[0];
	const urlToken = param.details[1];
	const {password} = await req.json();
  
	try {
	  const passwordSchema = Joi.object({
		password: passwordComplexity().required().label("Password"),
	  });
  
	  const { error } = passwordSchema.validate({ password });
  
	  if (error) {
		return NextResponse.json({ message: error.details[0].message }, { status: 400 });
	  }
  	  const user = await User.findOne({ _id: urlId });
  
	  if (!user) {
		return NextResponse.json({ message: "Invalid link" }, { status: 400 });
	  }
  
	  const token = await Token.findOne({
		userId: user._id,
		token: urlToken,
	  });
  
	  if (!token) {
		console.log("Token not found");
		return res.status(400).send({ message: "Invalid link" });
	  }
  
	  if (!user.verified) {
		user.verified = true;
	  }
  
	  const salt = await bcrypt.genSalt(Number(process.env.SALT));
	  const hashPassword = await bcrypt.hash(password, salt);
  
	  user.password = hashPassword;
	  await user.save();
	  await Token.deleteOne({ _id: token._id });
	  return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
	} catch (error) {
	  console.error("Internal Server Error:", error);
	  return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
  };
	