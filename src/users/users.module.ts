import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseService } from "src/database/database.service";
import { ChatroomsService } from "src/chatrooms/chatrooms.service";

@Module({
  providers: [UsersService, DatabaseService, ChatroomsService],
  controllers: [UsersController],
})
export class UsersModule {}
