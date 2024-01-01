import mongoose from "mongoose";

const connectMongoDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.log(`Can't connect to Database ${error}`)
    }
};
export default connectMongoDB;