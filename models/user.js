import mongoose, { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
const secretKey = process.env.KEY;
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        balance: {
            type: Number,
            default: 0,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

let User;

try {
    User = mongoose.model('User');
} catch (error) {
    // If the model doesn't exist, create it
    User = model('User', userSchema);
}

const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("Username"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        image: Joi.string().allow("").optional().label("image"),
    });
    return schema.validate(data);
};
const loginValidate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};
export default User;
export { validate, loginValidate };
