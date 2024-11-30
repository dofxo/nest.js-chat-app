import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import { convertToPersianDate } from "./helpers/converToPersianDate";
import chalk from "chalk";

const { PORT, NODE_ENV } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set prefix for routes
  app.setGlobalPrefix("api");

  await app.listen(PORT ?? 3500, () =>
    console.log(
      chalk.green(
        `App is running on ${NODE_ENV} mode at ${chalk.redBright(`http://localhost:${PORT}`)} | ${chalk.yellow(convertToPersianDate(new Date()))}`,
      ),
    ),
  );
}
bootstrap();
