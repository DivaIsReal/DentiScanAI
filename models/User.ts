import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
