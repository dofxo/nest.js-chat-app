import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DatabaseService } from "./database/database.service";
import { JwtModule } from "@nestjs/jwt";
import { SocketService } from "./socket/socket.service";
import "dotenv/config";
import AuthGuard from "./guards/auth.guard";

const { JWT_SECRET_KEY } = process.env;

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      global: true,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, SocketService, AuthGuard],
})
export class AppModule {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    // connects to mongo database
    await this.databaseService.startDB();
  }
}
