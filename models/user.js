import mongoose, { Schema } from "mongoose";
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

const User = mongoose.models.User || mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    image: Joi.string().allow("").optional().label("image"),
  });
  return schema.validate(data);
};

export { User, validate };
