import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User document that extends mongoose's Document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const userSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
