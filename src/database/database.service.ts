import { Injectable, Logger } from "@nestjs/common";
import mongoose from "mongoose";
import { ChatroomsService } from "src/chatrooms/chatrooms.service";

@Injectable()
export class DatabaseService {
  constructor(private readonly chatroomsService: ChatroomsService) {}

  async startDB() {
    try {
      const mongooseConnection = await mongoose.connect(process.env.MONGO_URL);

      Logger.log(
        `Connected to MongoDB: ${mongooseConnection.connection.host}`,
        "DatabaseService",
      );

      // Initialize the default chatroom
      await this.chatroomsService.createChatroom("General");
    } catch (error) {
      Logger.error(
        `Error connecting to MongoDB: ${error.message}`,
        error.stack,
        "DatabaseService",
      );
      throw new Error("Database connection failed");
    }
  }
}
