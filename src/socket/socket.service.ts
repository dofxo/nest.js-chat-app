import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import * as cookie from "cookie";
import AuthGuard from "src/guards/auth.guard";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SocketService {
  private io: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly authGuard: AuthGuard,
  ) {}

  initialize(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        credentials: true,
      },
    });

    this.io.on("connection", async (socket) => {
      try {
        const rawCookie = socket.handshake.headers.cookie || "";
        const parsedCookies = cookie.parse(rawCookie);
        const token = parsedCookies.token;

        // Validate token using AuthGuard
        const isValid = await this.authGuard.isValidToken(token);

        if (!isValid) {
          socket.disconnect(true);
          return;
        }

        // Add event listeners
        this.newMessage(socket, token);
        this.isTypingStatus(socket, token);
        this.joinRoom(socket, token);
        this.leaveRoom(socket, token);
      } catch (error) {
        // Disconnect the socket if token validation fails
        socket.disconnect(true);
      }
    });
  }

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
        socket.to(room).emit("typing", { username: name });
      }
    });
  }

  newMessage(socket: any, token: string) {
    socket.on("message", (data: any) => {
      const { room, message } = data;
      const { name, avatar } = this.getUserToken(token);

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

      socket.join(room);

      socket.to(room).emit("userJoined", {
        username: name,
      });
    });
  }

  leaveRoom(socket: any, token: string) {
    socket.on("leaveRoom", (room: string) => {
      const { name } = this.getUserToken(token);

      socket.leave(room);

      socket.to(room).emit("userLeft", {
        name,
      });
    });
  }
}
