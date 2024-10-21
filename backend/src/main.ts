import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { useContainer } from 'class-validator';

class AppBootstrap {
  private app: INestApplication;
  private configService: ConfigService;
  private port: number;

  constructor() {
    this.bootstrap();
  }

  private async bootstrap() {
    await this.createNestApp();
    this.setAppConfigurations();
    await this.listenToPort();
  }

  private async createNestApp() {
    this.app = await NestFactory.create(AppModule);
    this.configService = this.app.get(ConfigService);
    this.port = this.configService.get<number>('BACKEND_PORT');
    useContainer(this.app.select(AppModule), { fallbackOnErrors: true });
  }

  private setAppConfigurations() {
    this.enableCors();
    this.setGlobalPipes();
    this.enableVersioning();
    this.useHelmet();
    this.useCompression();
    this.setupSwagger();
  }

  private enableCors() {
    this.app.enableCors({ origin: '*' });
  }

  private setGlobalPipes() {
    this.app.useGlobalPipes(new ValidationPipe({}));
  }

  private enableVersioning() {
    this.app.enableVersioning({ type: VersioningType.URI });
  }

  private useHelmet() {
    this.app.use(helmet());
  }

  private useCompression() {
    this.app.use(compression());
  }

  private setupSwagger() {
    const config = new DocumentBuilder()
      .setTitle('Workout Tracker API')
      .setDescription(
        'Here is the API documentation for the Workout Tracker Project.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('api', this.app, document);
  }

  private async listenToPort() {
    await this.app.listen(this.port);
  }
}

new AppBootstrap();
