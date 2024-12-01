import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { userSchema } from "../schemas/";

@Injectable()
export class UsersService {
  private userModel = userSchema;
  async signUpDto({
    name,
    password,
    email,
  }: {
    name: string;
    password: string;
    email: string;
  }) {
    //TODO: add signup logic
    const newUser = new this.userModel({ name, password, email });
    newUser.save();

    return newUser;
  }

  //TODO: add signin logic
  async signInDto({ email, password }) {
    const newUser = "";
    return newUser;
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async getUserById(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException("Invalid user ID format");
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    return user;
  }
}
