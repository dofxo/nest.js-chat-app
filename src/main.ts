import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import { convertToPersianDate } from "./helpers/converToPersianDate";
import chalk from "chalk";
import { setUpSwagger } from "./swagger";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { createServer } from "http";
import { SocketService } from "./socket/socket.service";

const { PORT, NODE_ENV } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global configurations
  app.setGlobalPrefix("api/v1");
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger
  if (NODE_ENV === "development") setUpSwagger(app);

  // Create HTTP server explicitly
  const httpServer = createServer(app.getHttpAdapter().getInstance());

  // Initialize Socket.IO
  const socketService = app.get(SocketService);
  socketService.initialize(httpServer);

  // Ensure NestJS is initialized properly
  await app.init();

  // Start the server
  httpServer.listen(PORT ?? 3500, () =>
    console.log(
      chalk.green(
        `App is running on ${NODE_ENV} mode at ${chalk.redBright(
          `http://localhost:${PORT}`,
        )} | ${chalk.yellow(convertToPersianDate(new Date()))}`,
      ),
    ),
  );
}
bootstrap();
