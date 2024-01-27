import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { validate } from "@/models/user";
import { NextResponse } from "next/server";

connectMongoDB();
export const POST = async (req, res) => {
  const input = await req.json();
  const userId = await res.params.id;
  const imageFile = await input.image;
  const newUserName = await input.name;
  try {
    // if submitting the update form without selecting an image
    if (typeof imageFile === 'object') {
      const objectResponseData = { success: false, message: "Invalid image type" };
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            username: newUserName,
          }
        },
        { new: true }
      )
      const { username, email, image, _id, balance } = updatedUser;
      const responseData = { username, email, image, _id, balance };
      return NextResponse.json(responseData, { status: 200 });
    }
    //    
    let user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: newUserName,
          image: imageFile
        }
      },
      { new: true }
    )
    const { username, email, image, _id, balance } = updatedUser;
    const responseData = { username, email, image, _id, balance };
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
  }
};