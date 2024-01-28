import mongoose, { Schema, model } from "mongoose";


const tokenSchema = new Schema({
    userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
		unique: true,
	},
    token: { 
        type: String,
        required: true
    },
    createdAt: { 
    type: Date,
    default: Date.now,
    expires: 3600 },
});

const Token = mongoose.models.Token || model('Token', tokenSchema);
export default Token;