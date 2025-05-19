import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);
  AppModule.setupSwagger(app)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
