import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoIdTransformPipe } from './util/transform/mongo-id-transform.pipe';
import { ValidationPipe } from '@nestjs/common';
import { AuthenticableService } from './authenticable/authenticable.service';
import mongoose, { Model } from 'mongoose';
import { Authenticable, AuthorizationLevel } from './authenticable/schema/authenticable.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
 
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
    new MongoIdTransformPipe(),
  );
  app.enableCors();
  await app.listen(3100);
}
bootstrap();
