import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ResponseInterceptor } from './common/response';
import { HttpExceptionFilter } from './common/filter';

const globalMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  app.use(globalMiddleware);
  app.useStaticAssets(join(__dirname, 'images'));
  // 开启版本控制，例如在请求url中加上v1/v2这样的字眼
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
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
