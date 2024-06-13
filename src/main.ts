// Core
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Modules
import { AppModule } from './app.module';

// Tools
import { ENV } from './utils';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: true,
  });

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get(ENV[ENV.PORT]);

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for managing tasks, projects, and user authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  Logger.log(`Server running at http://localhost:${port}`, 'NestApplication');
})();
