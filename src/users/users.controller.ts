import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body("name") name: string) {
    const user = await this.usersService.createUser(name);
    return user;
  }
}
