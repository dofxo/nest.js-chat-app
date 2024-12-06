import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the message document
export interface IMessage {
  date: Date;
  authorData: {
    name: string;
    avatar?: string;
  };
  content: string;
}

// Define an interface for the chatroom document
export interface IChatroom extends Document {
  name: string;
  messages: IMessage[];
}

// Message schema
const messageSchema = new Schema<IMessage>({
  date: { type: Date, default: Date.now },
  authorData: {
    name: { type: String, required: true },
    avatar: { type: String },
  },
  content: { type: String, required: true },
});

// Chatroom schema
const chatroomSchema = new Schema<IChatroom>({
  name: { type: String, required: true, unique: true },
  messages: [messageSchema],
});

// Create and export the chatroom model
export const Chatroom = mongoose.model<IChatroom, Model<IChatroom>>(
  "Chatrooms",
  chatroomSchema,
);
