import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import mongoose from "mongoose";

@Injectable()
export class UsersService {
  private userModel;

  constructor(private readonly databaseService: DatabaseService) {
    const User = mongoose.model("Users", new mongoose.Schema({ name: String }));

    this.userModel = User;
  }

  async createUser(name: string) {
    const newUser = new this.userModel({ name });
    newUser.save();

    return newUser;
  }
}
