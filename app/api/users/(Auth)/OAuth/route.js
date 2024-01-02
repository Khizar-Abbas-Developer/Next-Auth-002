import connectMongoDB from "@/libs/mongodb";
import { User, validate2 } from "@/models/user"
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { customAlphabet } from 'nanoid';


export const POST = async (req, res) => {
    await connectMongoDB();

    const { email, username, image } = await req.json();
    const generatedPassword = () => Math.random().toString(36).slice(-8).toString();
    const password = Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
    try {
        const user = await User.findOne({ email });
        if (user) {
            const { username, email: userEmail, _id, image, balance } = user;
            // Create a new object with the desired properties
            const userData = { username, email: userEmail, _id, image, balance };
            return NextResponse.json({ data: userData}, { status: 201 });
        } else {
            const { error } = validate2({ email, username, image, password });
            if (error) {
                const errorMessage = error.details.map((detail) => detail.message).join(', ');
                return NextResponse.json({ message: errorMessage }, { status: 400 });
            }
    
            const hashedPassword = await bcrypt.hashSync(password, 10);
            const newUser = new User({ username, email, image, password: hashedPassword, verified: true });
            // const { username, email: userEmail, _id, image, balance } = aUser;
            // const bUser = { username, email: userEmail, _id, image, balance };

            await newUser.save();
            const { username: savedUsername, email: savedUserEmail, _id, balance } = newUser;
            const repository = { username: savedUsername, email: savedUserEmail, image, _id, balance };
    
            return NextResponse.json({ data: repository, message: "User created successfully!" }, { status: 201 });
        }
    } catch (error) {
        console.error("Error in POST API:", error); // Log the error to the console for debugging
        return NextResponse.json({ data: null, message: "Internal Server Error" }, { status: 500 });
    }
};

