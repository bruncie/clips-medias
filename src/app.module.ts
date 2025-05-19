import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common'; // Importe INestApplication
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/clips-media'),
    UsersModule,
    AuthModule,
    WhatsappModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    console.log('AppModule has been initialized.');
  }

  static setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Clips-Media API')
      .setDescription('Api referente as funções do Clips-Media')
      .setVersion('1.0')
      .addTag('users')
      .addTag('auth')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // 'api' será o caminho para acessar o Swagger UI
  }
}