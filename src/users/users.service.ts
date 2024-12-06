import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { User } from "../schemas/users";
import SuccessException from "../custom-exceptions/success";
import { passwordMatchToHashedVersion } from "src/helpers/passwordMatchToHashedVersion";

@Injectable()
export class UsersService {
  private userModel = User;
  async signUp({
    name,
    password,
    email,
  }: {
    name: string;
    password: string;
    email: string;
  }): Promise<{
    message: any;
    data?: {
      name: string;
      email: string;
      password: string;
    };
    statusCode?: number;
  }> {
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

  async logIn({ email, password }): Promise<{
    message: any;
    data?: {
      name: string;
      email: string;
      password: string;
      avatar?: string;
    };
    statusCode?: number;
  }> {
    const user = await this.userModel.findOne({ email });

    // check if user exists
    if (Boolean(user)) {
      const { password: userPassword } = user;

      // check for password matching
      if (!passwordMatchToHashedVersion(password, userPassword)) {
        return new NotFoundException("اطاعات وارد شده صحیح نمی باشد");
      }

      return new SuccessException({
        message: "کاربر با موفقیت وارد شد",
        statusCode: 201,
        data: user,
      });
    } else {
      return new NotFoundException("کاربری با این اطلاعات وجود ندارد");
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

  async getUserByEmail(userEmail: string) {
    if (!userEmail) {
      throw new BadRequestException("ایمیل مورد نظر موجود نمی باشد");
    }

    const user = await this.userModel.findOne({ email: userEmail });

    if (!user) {
      throw new NotFoundException("User Not Found");
    }
    return new SuccessException({
      message: "کاربر با موفقیت دریافت شد",
      statusCode: 200,
      data: user,
    });
  }

  async updateUserByEmail(
    userEmail: string,
    data: { name: string; avatar?: string },
  ) {
    if (!userEmail) {
      throw new BadRequestException("ایمیل مورد نظر موجود نمی باشد");
    }
    await this.userModel.updateOne({ email: userEmail }, data);

    return new SuccessException({
      message: "اطلاعات کاربر با موفقیت آپدیت شد",
      statusCode: 200,
    });
  }

  async removeUserById(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException("Invalid user ID format");
    }
    const user = await this.userModel.deleteOne({ _id: userId });

    if (user.deletedCount === 0) {
      throw new NotFoundException("User Not Found");
    }
    return new SuccessException({
      message: "کاربر با موفقیت حذف شد",
      statusCode: 200,
    });
  }
}
