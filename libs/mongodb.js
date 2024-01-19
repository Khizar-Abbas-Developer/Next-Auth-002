import mongoose from "mongoose";

let isConnected = false;

const connectMongoDB = async () => {
    try {
        if (!isConnected) {
            await mongoose.connect(process.env.MONGODB_URI);
            isConnected = true;
        }
    } catch (error) {
        throw new Error("Can't connect to database!", error)
    }
};

export default connectMongoDB;
