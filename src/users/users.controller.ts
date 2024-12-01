import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import signUpDto from "./dto/signUp.dto";
import signInDto from "./dto/signIn.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async signUp(@Body() signUpDto: signUpDto) {
    const { name, password, email } = signUpDto;
    const user = await this.usersService.signUp({
      email,
      password,
      name,
    });
    return user;
  }

  @Post("sign-in")
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({
    type: signInDto,
  })
  @ApiResponse({
    status: 201,
    description: "User successfully signed up",
    type: signInDto,
  })
  async signIn(@Body() signInDto: signInDto) {
    //TODO: add signin logic
    const { password, email } = signInDto;
    const user = await this.usersService.signIn({ password, email });
    return user;
  }

  @Get()
  @ApiOperation({ summary: "Get All Users" })
  @ApiResponse({
    status: 201,
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
}
