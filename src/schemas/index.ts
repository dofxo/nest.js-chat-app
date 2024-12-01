import mongoose from "mongoose";

export const userSchema = mongoose.model(
  "Users",
  new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  }),
);
