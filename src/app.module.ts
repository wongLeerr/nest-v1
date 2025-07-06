import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoController } from './demo/demo.controller';
import { DemoModule } from './demo/demo.module';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { ConfigModule } from './config/config.module';
import { UploadModule } from './upload/upload.module';
import { LoginModule } from './login/login.module';
import { SpiderModule } from './spider/spider.module';
import { GuardModule } from './guard/guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurdModule } from './curd/curd.module';
import { ManagerModule } from './manager/manager.module';

@Module({
  imports: [
    DemoModule,
    UserModule,
    ListModule,
    ConfigModule.forRoot({ num: 1 }),
    UploadModule,
    LoginModule,
    SpiderModule,
    GuardModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootroot',
      database: 'nest_db',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 是否要将实体类同步到数据库 生产环境需要关闭
      retryAttempts: 10, // 重试次数
      retryDelay: 500, // 重试间隔
      autoLoadEntities: true, // 自动加载实体类
    }),
    CurdModule,
    ManagerModule,
  ],
  controllers: [AppController, DemoController],
  providers: [AppService],
})
export class AppModule {}
