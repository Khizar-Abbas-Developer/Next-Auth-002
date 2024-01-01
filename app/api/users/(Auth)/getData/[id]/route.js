import connectMongoDB from "@/libs/mongodb";
import { User, validate } from "@/models/user";
import { NextResponse } from "next/server";


// export const GET = async(req, res)=>{
//   connectMongoDB();
//   const id = await res.params.id;
//   console.log(id);
//     try {
//       const userId = id;
//       // Fetch the user data from the database by ID
//       let user = await User.findById(userId);
//       if (!user) {
//         return NextResponse.json({success: false, message: "User not found"}, {status: 404});
//       }
//       // Send the user data in the response
//       return NextResponse.json({data:user}, {status: 200});
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json({success: false, message: "Internal Server Error"}, {status: 500});
//     }
//   };

//   // 
// if everything worked perfectly i am gonna delete this get api

// Updating the usersData
connectMongoDB();
export const POST = async (req, res) => {
  const input = await req.json();
  try {
    const userId = await res.params.id;

    // Fetch the user data from the database by ID
    let user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: input.name,
          image: input.image
        }
      },
      { new: true }
    )
    const { username, email, image, _id, balance } = updatedUser;
    const  responseData = {username, email, image, _id, balance};
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
  }
};