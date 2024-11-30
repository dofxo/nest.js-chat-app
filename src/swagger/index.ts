import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setUpSwagger = (app: INestApplication<any>) => {
  const options = new DocumentBuilder()
    .setTitle("Chat App API")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);
};
