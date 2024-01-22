import connectMongoDB from "@/libs/mongodb";
import Token from "@/models/token";
import User from "@/models/user";

export const verifyEmail = async (prevState, data) => {
    const taken = data.token;
    const id = data.id;

    try {
        await connectMongoDB();

        // Find the user
        const user = await User.findOne({ _id: id });

        if (!user) {
            return { message: "Invalid link", status: 400 };
        }

        // Find the token
        const token = await Token.findOne({
            userId: user._id,
            token: taken,
        });

        if (!token) {
            return { message: "Token expired", status: 400 };
        }

        // Check token expiration
        if (token.expiryDate < Date.now()) {
            // Delete the expired token
            await Token.deleteOne({ _id: token._id });
            return { message: "Token Expired", status: 400 };
        }

        // Verify email and delete token
        user.verified = true;
        await Promise.all([
            user.save(),
            Token.deleteOne({ _id: token._id }),
        ]);

        return { message: "Email verified successfully", status: 200 };
    } catch (error) {
        console.error(error);
        return { message: "Internal Server Error", status: 500 };
    }
};
