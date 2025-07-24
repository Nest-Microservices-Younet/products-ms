import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  // const app = await NestFactory.create(AppModule); // por default

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.TCP,
    options: {
      port: envs.port,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true 
    }),
  );

  // await app.listen(envs.port);

  // await app.startAllMicroservices(); // para que sea hibrido

  logger.log(`Products Microservice is running on port ${envs.port}`);
}
bootstrap();
