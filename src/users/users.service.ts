import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { userSchema } from "../schemas/";
import SuccessException from "../custom-exceptions/success";

@Injectable()
export class UsersService {
  private userModel = userSchema;
  async signUp({
    name,
    password,
    email,
  }: {
    name: string;
    password: string;
    email: string;
  }) {
    const isUserExists = await this.userModel.findOne({ email });

    // check if user is new
    if (!Boolean(isUserExists)) {
      const newUser = new this.userModel({ name, password, email });
      newUser.save();
      return new SuccessException({
        message: "کاربر با موفقیت ساخته شد",
        statusCode: 201,
        data: newUser,
      });
    } else {
      return new ConflictException("کاربر از قبل وجود دارد");
    }
  }

  async signIn({ email, password }) {
    const user = await this.userModel.findOne({ email, password });

    // check if user exists
    if (Boolean(user)) {
      return new SuccessException({
        message: "کاربر با موفقیت وارد شد",
        statusCode: 200,
        data: user,
      });
    } else {
      return new NotFoundException("اطاعات وارد شده صحیح نمی باشد");
    }
  }

  async getAllUsers() {
    const users = await this.userModel.find();

    return new SuccessException({
      message: "کاربران با موفقیت دریافت شدند",
      statusCode: 200,
      data: users,
    });
  }

  async getUserById(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException("Invalid user ID format");
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException("User Not Found");
    }
    return new SuccessException({
      message: "کاربر با موفقیت دریافت شد",
      statusCode: 200,
      data: user,
    });
  }
}
