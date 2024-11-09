import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addTag('User', 'Operations related to users')
    .addTag('Artist', 'Operations related to artists')
    .addTag('Album', 'Operations related to albums')
    .addTag('Track', 'Operations related to tracks')
    .addTag('Favorites', 'Operations related to favorites')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  const yamlDocument = YAML.dump(document);
  const filePath = path.join(__dirname, '..', 'doc', 'api.yaml');
  fs.writeFileSync(filePath, yamlDocument, 'utf8');

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
