import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DatabaseService } from "./database/database.service";

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    // connects to mongo database
    await this.databaseService.startDB();
  }
}
