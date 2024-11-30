import { Injectable } from "@nestjs/common";
import chalk from "chalk";
import mongoose from "mongoose";

@Injectable()
export class DatabaseService {
  constructor() {
    this.startDB();
  }

  async startDB() {
    try {
      const connection = await mongoose.connect(process.env.MONGO_URL);
      console.log(
        chalk.yellow("connected to database:", connection.connection.host),
      );
    } catch (error) {
      console.error(chalk.red(error));
    }
  }
}
