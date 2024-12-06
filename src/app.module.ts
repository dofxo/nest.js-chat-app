import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { DatabaseService } from "./database/database.service";
import { JwtModule } from "@nestjs/jwt";
import { SocketService } from "./socket/socket.service";
import { ChatroomsController } from "./chatrooms/chatrooms.controller";
import { ChatroomsModule } from "./chatrooms/chatrooms.module";
import "dotenv/config";
import AuthGuard from "./guards/auth.guard";
import { ChatroomsService } from "./chatrooms/chatrooms.service";

const { JWT_SECRET_KEY } = process.env;

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      global: true,
      signOptions: { expiresIn: "30d" },
    }),
    ChatroomsModule,
  ],
  controllers: [ChatroomsController],
  providers: [DatabaseService, SocketService, AuthGuard, ChatroomsService],
})
export class AppModule {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    // connects to mongo database
    await this.databaseService.startDB();
  }
}
