import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { ChatroomsService } from "./chatrooms.service";
import { CreateChatroomDto } from "./dto/chatroom.dto";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import AuthGuard from "src/guards/auth.guard";

@ApiTags("Chatrooms")
@Controller("chatrooms")
export class ChatroomsController {
  constructor(private readonly chatroomsService: ChatroomsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: "Create a new chatroom" })
  @ApiResponse({ status: 201, description: "Chatroom created successfully." })
  @ApiResponse({
    status: 400,
    description: "Chatroom name is required or already exists.",
  })
  @ApiBody({ type: CreateChatroomDto })
  @UsePipes(new ValidationPipe())
  async createChatroom(@Body() createChatroomDto: CreateChatroomDto) {
    const { name } = createChatroomDto;
    return this.chatroomsService.createChatroom(name);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Delete one Chatroom" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({
    status: 200,
    description: "Chatroom deleted successfully",
  })
  @UsePipes(new ValidationPipe())
  async deleteChatroom(@Param("id") id: string) {
    return this.chatroomsService.removeChatroom(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: "Get All chatrooms names" })
  @ApiResponse({ status: 200, description: "Chatrooms fetched successfully." })
  @UsePipes(new ValidationPipe())
  async getChatrooms() {
    return this.chatroomsService.getChatrooms();
  }

  @UseGuards(AuthGuard)
  @Get(":name/messages")
  @ApiOperation({ summary: "Get all messages from a chatroom" })
  @ApiParam({
    name: "name",
    description: "The name of the chatroom",
    example: "general",
  })
  @ApiResponse({
    status: 200,
    description: "Returns the list of messages in the chatroom.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string", format: "date-time" },
          content: { type: "string", example: "Hello, world!" },
          authorData: {
            type: "object",
            properties: {
              name: { type: "string", example: "John Doe" },
              avatar: {
                type: "string",
                example: "https://example.com/avatar.jpg",
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Chatroom not found." })
  async getMessages(@Param("name") chatroomName: string) {
    return this.chatroomsService.getMessages(chatroomName);
  }
}
