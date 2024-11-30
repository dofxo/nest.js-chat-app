import { Injectable, Logger } from "@nestjs/common";
import mongoose from "mongoose";

@Injectable()
export class DatabaseService {
  async startDB() {
    try {
      const mongooseConnection = await mongoose.connect(process.env.MONGO_URL);

      Logger.log(
        `Connected to MongoDB: ${mongooseConnection.connection.host}`,
        "DatabaseService",
      );
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
