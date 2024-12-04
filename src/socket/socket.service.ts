import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class SocketService {
  private io: Server;

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

      // listens for new message
      this.newMessage(socket);
    });
  }

  newMessage(socket: any) {
    socket.on("message", (message: any) => {
      // send incoming message to all clients
      this.io.emit("message", message);
    });
  }
}
