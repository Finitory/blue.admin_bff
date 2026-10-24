import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module.js";

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 12000);

  await app.listen(port);
};

void bootstrap();