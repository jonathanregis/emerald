import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { generateTransactionReference } from './utils/generators';

async function bootstrap() {
  console.log('env variables: ', process.env);
  const app = await NestFactory.create(AppModule);
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
  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
