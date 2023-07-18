import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Emerald api examples')
    .setDescription(
      'This is a guide on how to use the emerald shipping project api',
    )
    .setVersion('1.0')
    .addTag('shipping')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  // await app.listen(process.env.APP_PORT || 3001);
  await app.listen(80);
}
bootstrap();
