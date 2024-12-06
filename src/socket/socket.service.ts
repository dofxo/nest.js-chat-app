import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import * as cookie from "cookie";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SocketService {
  private io: Server;

  constructor(private readonly jwtService: JwtService) {}

  initialize(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        credentials: true, // Ensure credentials (cookies) are accepted
      },
    });

    this.io.on("connection", (socket) => {
      const rawCookie = socket.handshake.headers.cookie || "";
      const parsedCookies = cookie.parse(rawCookie);
      const token = parsedCookies.token;

      // listens for new message
      this.newMessage(socket, token);

      // listens for typing status
      this.isTypingStatus(socket, token);

      // listens for joining a room
      this.joinRoom(socket, token);

      // listens for leaving a room
      this.leaveRoom(socket, token);
    });
  }

  // Utility function to get the username from the token
  private getUserToken(token: string): { name: string; avatar?: string } {
    if (token) {
      const decoded = this.jwtService.decode(token) as { name: string };
      return decoded;
    } else {
      return { name: "Anonymous" };
    }
  }

  isTypingStatus(socket: any, token: string) {
    socket.on("typing", (room: string) => {
      const { name } = this.getUserToken(token);

      if (room) {
        // Emit typing status to the specified room
        socket.to(room).emit("typing", { username: name });
      }
    });
  }

  newMessage(socket: any, token: string) {
    socket.on("message", (data: any) => {
      const { room, message } = data;
      const { name, avatar } = this.getUserToken(token);

      // Send incoming message to all clients in the room except the sender
      socket.to(room).emit("message", {
        message,
        date: new Date(),
        username: name,
        avatar,
      });
    });
  }

  joinRoom(socket: any, token: string) {
    socket.on("joinRoom", (room: string) => {
      const { name } = this.getUserToken(token);

      // Add the user to the specified room
      socket.join(room);

      // Notify others in the room about the new user
      socket.to(room).emit("userJoined", {
        username: name,
      });
    });
  }

  leaveRoom(socket: any, token: string) {
    socket.on("leaveRoom", (room: string) => {
      const { name } = this.getUserToken(token);

      // Remove user from the room
      socket.leave(room);

      // Notify others in the room about the user leaving
      socket.to(room).emit("userLeft", {
        name,
      });
    });
  }
}
