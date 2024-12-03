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
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import signUpDto from "./dto/signUp.dto";
import signInDto from "./dto/signIn.dto";
import updateDto from "./dto/updateDto.dto";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { setCookie } from "src/helpers/setCookie";
import SuccessException from "src/custom-exceptions/success";
import AuthGuard from "src/guards/auth.guard";

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
  @ApiOperation({ summary: "Update user data" })
  @ApiResponse({
    status: 200,
    description: "User data updated successfully",
  })
  async updateUser(@Req() req, @Body() updateDto: updateDto) {
    const token = req.cookies.token;
    const decoded = this.jwtService.decode(token);

    const { name } = updateDto;

    const user = await this.usersService.updateUserByEmail(decoded.email, {
      name,
    });

    return user;
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
