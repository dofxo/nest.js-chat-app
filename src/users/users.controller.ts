import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import signUpDto from "./dto/signUp.dto";
import updateDto from "./dto/updateDto.dto";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { setCookie } from "src/helpers/setCookie";
import SuccessException from "src/custom-exceptions/success";
import AuthGuard from "src/guards/auth.guard";
import logInDto from "./dto/logIn.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import * as path from "path";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("sign-up")
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({
    type: signUpDto,
  })
  @ApiResponse({
    status: 201,
    description: "User successfully signed up",
    type: signUpDto,
  })
  async signUp(
    @Body() signUpDto: signUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { name, password, email } = signUpDto;

    const user = await this.usersService.signUp({
      email,
      password,
      name,
    });

    // return data and token as response
    if (user.data) {
      const payload = {
        name: user.data.name,
        email: user.data.email,
      };

      // set cookie
      const token = await setCookie(res, this.jwtService, payload);

      return res.json({ user, token });
    }

    return res.json({ user });
  }

  @Post("log-in")
  @ApiOperation({ summary: "Login existing user" })
  @ApiBody({
    type: logInDto,
  })
  @ApiResponse({
    status: 201,
    description: "User successfully logged in",
    type: logInDto,
  })
  async logIn(@Body() logInDto: logInDto, @Res() res: Response) {
    const { password, email } = logInDto;

    const user = await this.usersService.logIn({ password, email });

    if (user.data) {
      const payload = {
        name: user.data.name,
        email: user.data.email,
        avatar: user.data.avatar,
      };
      const token = await setCookie(res, this.jwtService, payload);
      return res.json({ user, token });
    }

    return res.json(user);
  }

  @Get("logout")
  @ApiOperation({ summary: "logout user" })
  @ApiResponse({
    status: 200,
    description: "User logged out successfully",
  })
  logout(@Res() res: Response, @Req() req) {
    if (req.cookies.token) {
      res.clearCookie("token");
      res.send(new SuccessException({ message: "کاربر با موفقیت خارج شد" }));
    } else {
      res.send(new NotFoundException("کاربری وارد حساب کاربری خود نشده است"));
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: "Get All Users" })
  @ApiResponse({
    status: 200,
    description: "Users fetched successfully",
  })
  async getUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  @UseGuards(AuthGuard)
  @Get("/user")
  @ApiOperation({ summary: "Get one user" })
  @ApiResponse({
    status: 200,
    description: "User fetched successfully",
  })
  async getUser(@Req() req) {
    const token = req.cookies.token;
    const decoded = this.jwtService.decode(token);

    const user = await this.usersService.getUserByEmail(decoded.email);
    return user;
  }

  @UseGuards(AuthGuard)
  @Put("/user")
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: diskStorage({
        destination: "./uploads/avatars",
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: "Update user data" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: updateDto,
  })
  @ApiResponse({
    status: 200,
    description: "User data updated successfully",
  })
  async updateUser(
    @Req() req,
    @Body() updateDto: updateDto,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const token = req.cookies.token;
    const decoded = this.jwtService.decode(token);

    if (!decoded || typeof decoded !== "object" || !decoded.email) {
      throw new NotFoundException("User not authenticated");
    }

    const { name } = updateDto;
    const avatarUrl = avatar
      ? `/uploads/avatars/${avatar.filename}`
      : undefined;

    // Update user data
    const user = await this.usersService.updateUserByEmail(decoded.email, {
      name,
      avatar: avatarUrl,
    });

    // Generate a new token
    const newPayload = {
      name: user.name,
      email: decoded.email,
      avatar: avatarUrl,
    };

    const newToken = this.jwtService.sign(newPayload);

    // Clear the old token and set the new one
    res.clearCookie("token");
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return new SuccessException({
      message: "User data and token updated successfully",
      data: user,
    });
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Delete one user" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({
    status: 200,
    description: "User Deleted successfully",
  })
  async removeUser(@Param("id") id: string) {
    const user = await this.usersService.removeUserById(id);
    return user;
  }
}
