import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ResponseInterceptor } from './common/response';
import { HttpExceptionFilter } from './common/filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const globalMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .setTitle('乐哥接口文档')
    .setDescription('描述...')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);
  app.use(cors());
  app.use(globalMiddleware);
  app.useStaticAssets(join(__dirname, 'images'));
  // 开启版本控制，例如在请求url中加上v1/v2这样的字眼
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: 'lele', // 加盐
      rolling: true, // 是否在每次请求后重置cookie的有效期，默认为false
      name: 'lele.sid', // 种到前端cookie的名字
      cookie: {
        maxAge: 9999999999,
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
