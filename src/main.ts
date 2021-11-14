import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const port = 3001;

  const app = await NestFactory.create(AppModule);

  // TODO: Http Only cookies https://www.learmoreseekmore.com/2021/04/part-1-vuejs-jwt-auth-cookie-access-token-usage.html
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);
  logger.log(`App listening on port ${port}`);
}
bootstrap();
