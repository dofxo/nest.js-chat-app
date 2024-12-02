import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import { convertToPersianDate } from "./helpers/converToPersianDate";
import chalk from "chalk";
import { setUpSwagger } from "./swagger";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
const { PORT, NODE_ENV } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set prefix for routes
  app.setGlobalPrefix("api/v1");

  // allow parsing cookies
  app.use(cookieParser());

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger at development mode
  if (NODE_ENV === "development") setUpSwagger(app);

  await app.listen(PORT ?? 3500, () =>
    console.log(
      chalk.green(
        `App is running on ${NODE_ENV} mode at ${chalk.redBright(`http://localhost:${PORT}`)} | ${chalk.yellow(convertToPersianDate(new Date()))}`,
      ),
    ),
  );
}
bootstrap();
