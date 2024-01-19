import mongoose from "mongoose";

let isConnected = false;

const connectMongoDB = async () => {
    try {
        if (!isConnected) {
            await mongoose.connect(process.env.MONGODB_URI);
            isConnected = true;
            // console.log("Connected to MongoDB");
        }
    } catch (error) {
        console.error(`Can't connect to Database ${error}`);
    }
};

export default connectMongoDB;
