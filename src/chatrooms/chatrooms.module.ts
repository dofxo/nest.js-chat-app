import { Module } from "@nestjs/common";
import { ChatroomsService } from "./chatrooms.service";
import { ChatroomsController } from "./chatrooms.controller";

@Module({
  providers: [ChatroomsService],
  controllers: [ChatroomsController],
})
export class ChatroomsModule {}
