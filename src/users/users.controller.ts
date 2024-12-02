import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import signUpDto from "./dto/signUp.dto";
import signInDto from "./dto/signIn.dto";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { setCookie } from "src/helpers/setCookie";
import SuccessException from "src/custom-exceptions/success";

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

  @Post("sign-in")
  @ApiOperation({ summary: "Login existing user" })
  @ApiBody({
    type: signInDto,
  })
  @ApiResponse({
    status: 201,
    description: "User successfully signed in",
    type: signInDto,
  })
  async signIn(@Body() signInDto: signInDto, @Res() res: Response) {
    const { password, email } = signInDto;

    const user = await this.usersService.signIn({ password, email });

    if (user.data) {
      const payload = {
        name: user.data.name,
        email: user.data.email,
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
      //TODO: redirect to home page later
    } else {
      res.send(new NotFoundException("کاربری وارد حساب کاربری خود نشده است"));
    }
  }

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

  @Get(":id")
  @ApiOperation({ summary: "Get one user" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({
    status: 201,
    description: "User fetched successfully",
  })
  async getUser(@Param("id") id: string) {
    const user = await this.usersService.getUserById(id);
    return user;
  }

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
