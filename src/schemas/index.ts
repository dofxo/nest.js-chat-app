import mongoose from "mongoose";

export const userSchema = mongoose.model(
  "Users",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  }),
);
