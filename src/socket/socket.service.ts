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

      // listens for typings
      this.isTypingStatus(socket, token);
    });
  }

  isTypingStatus(socket: any, token: string) {
    socket.on("typing", () => {
      let name: string;

      if (token) {
        name = this.jwtService.decode(token).name;
      } else {
        name = "Anonymous";
      }

      // Send user typing status
      socket.broadcast.emit("typing", {
        username: name,
      });
    });
  }

  newMessage(socket: any, token: string) {
    socket.on("message", (message: any) => {
      let name: string;

      if (token) {
        name = this.jwtService.decode(token).name;
      } else {
        name = "Anonymous";
      }

      // Send incoming message to all clients except the sender
      socket.broadcast.emit("message", {
        message,
        date: new Date(),
        username: name,
      });
    });
  }
}
