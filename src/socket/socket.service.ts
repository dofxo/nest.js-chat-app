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
      },
    });

    this.io.on("connection", (socket) => {
      console.log("A client connected:", socket.id);

      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected: ${socket.id} (Reason: ${reason})`);
      });

      const rawCookie = socket.handshake.headers.cookie || "";
      const parsedCookies = cookie.parse(rawCookie);

      const token = parsedCookies.token;

      // listens for new message
      this.newMessage(socket, token);
    });
  }

  newMessage(socket: any, token: string) {
    socket.on("message", (message: any) => {
      let name;
      if (token) {
        name = this.jwtService.decode(token).name;
      } else {
        name = "Anonymous";
      }

      // send incoming message to all clients
      this.io.emit("message", {
        message,
        date: new Date(),
        username: name,
      });
    });
  }
}
