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

let Token;

try {
    Token = mongoose.model('Token');
} catch (error) {
    // If the model doesn't exist, create it
    Token = model('Token', tokenSchema);
}

export default Token;