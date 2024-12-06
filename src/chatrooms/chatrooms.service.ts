import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Chatroom, IChatroom, IMessage } from "../schemas/chatRooms";
import { AddMessageDto } from "./dto/chatroom.dto";
import { isValidObjectId } from "mongoose";
import SuccessException from "src/custom-exceptions/success";

@Injectable()
export class ChatroomsService {
  // Create a new chatroom
  async createChatroom(name: string): Promise<IChatroom> {
    const existingChatroom = await Chatroom.findOne({ name });
    if (existingChatroom) {
      throw new BadRequestException(`Chatroom ${name} already exists.`);
    }

    return Chatroom.create({ name });
  }

  async getChatrooms() {
    const roomNames = await Chatroom.aggregate([
      {
        $project: {
          name: 1,
        },
      },
    ]);

    // Return only the room names as an array
    return roomNames;
  }

  async removeChatroom(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid chatId ID format");
    }
    const deletedChatroom = await Chatroom.deleteOne({ _id: id });

    if (deletedChatroom.deletedCount === 0) {
      throw new NotFoundException("Chatroom Not Found");
    }
    return new SuccessException({
      message: "chatroom deleted successfully",
      statusCode: 200,
    });
  }

  // Add message to chatroom
  async addMessage(
    chatroomName: string,
    addMessageDto: AddMessageDto,
  ): Promise<IMessage> {
    // Find the chatroom by name

    const chatroom = await Chatroom.findOne({ name: chatroomName }).exec();
    if (!chatroom) {
      throw new NotFoundException(`Chatroom ${chatroomName} not found.`);
    }

    // Create the message object directly
    const messageData: IMessage = {
      content: addMessageDto.content,
      authorData: addMessageDto.authorData,
      date: new Date(),
    };

    // Push the message to the chatroom's messages array
    chatroom.messages.push(messageData);

    // Save the chatroom with the new message
    await chatroom.save();

    // Return the message document
    return messageData;
  }

  // Get messages from a specific chatroom
  async getMessages(chatroomName: string): Promise<IMessage[]> {
    const chatroom = await Chatroom.findOne({ name: chatroomName }).select(
      "messages",
    );
    if (!chatroom) {
      throw new NotFoundException(`Chatroom "${chatroomName}" not found.`);
    }
    return chatroom.messages;
  }
}
