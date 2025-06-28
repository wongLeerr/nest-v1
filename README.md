### nestJs学习笔记

### controller 层类似vue中的路由，用来管理路由。

### service 层用来实现具体业务。

### nest-cli 命令

1. nest g co demo: 生成名为demo的controller模块
2. nest g mo demo: 生成名为demo的module模块
3. nest g s demo: 生成名为demo的service模块

但是一个个生成比较麻烦，可以一行命令生成一整套：nest g resource demo: 生成一整套：controller,service,module

### 接口版本控制

有没有见过接口中带有v1或者v2这种标志的，这就是版本控制，在nestjs中开启版本控制需要这么做。

```
1. 入口文件中开启版本控制
app.enableVersioning({
    type: VersioningType.URI,
});

2.controller中通过 @Controller({path: 'user', version: '1'})开启版本，或者通过在具体的URL前使用装饰器来开启版本控制：
如：@Get()
  @Version('1')
  findAll() {
    return this.userService.findAll();
  }
```

### 装饰器

### provide & inject

在module里进行provide，provide的是service，provide出来的是一个class，在controller里注入的是实例。  
其实在module里不仅可以提供service，任意值任意逻辑都可以返回。

### modules 模块

如果想要在app.controller.ts中使用userService，应该怎么做，直接在app.controller.ts中引入可以用吗，不可以，需要在user.module.ts中将userService使用exports进行导出才可以。

#### 全局模块

将此某个模块使用@Global注册成全局模块后，在任意的模块中可以随意调度使用，注意此模块也需要使用exports进行导出。

```
第一步：在config模块中声明该模块为全局模块，并进行导出
@Global()
@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
```

```
第二步：app.module.ts中引入并声明该模块
@Module({
  imports: [DemoModule, UserModule, ListModule, ConfigModule],
  controllers: [AppController, DemoController],
  providers: [AppService],
})
```

```
第三步：使用方法：直接在需要的controller中的constructor中声明即可使用
constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
) {}
```

### 动态模块，大概意思就是比如在app.module.ts中引入某个模块时还可以给这个模块传一些参数。

```
一：定义方式
import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

export interface Options {
  num: number;
}

@Global()
@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
    };
  }
}

```

```
二：引入方式
@Module({
  imports: [
    DemoModule,
    UserModule,
    ListModule,
    ConfigModule.forRoot({ num: 1 }),
  ],
  controllers: [AppController, DemoController],
  providers: [AppService],
})
```

```
三：使用方式：
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject('CONFIG_OPTIONS') private readonly options: Options,
  ) {}
```

### 中间件

概念：中间件是在路由处理程序 之前 调用的函数。 中间件函数可以访问请求和响应对象。

```
定义方式：
import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('🐶🐶 LoggerMiddleware');
    next();
  }
}

使用方式：
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'user',
      method: RequestMethod.GET,
    });
  }
}
```

### 全局中间件

一定是声明在main.ts入口文件当中的。

```
声明方式：
const globalMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('🐶🐶 globalMiddleware');
  console.log('req:', req.originalUrl);
  next();
};
使用方式：
app.use(globalMiddleware);
一般作用：白名单鉴权、解决跨域
```

### 解决跨域

使用cors中间件，引入+use一下，解决跨域就是这么简单。

### upload 上传文件

借助两个库，一个是nest自带的，另一个是multer。
想实现从接口上传图片，服务端需要干这么几件事儿：1. 接得住图片 2. 图片放哪 3. 图片叫什么名字

```js
解决123问题：
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../images'), // 放在dist目录的images目录下面
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}${extname(file.originalname)}`; // 上传的文件给他起的名字
          return cb(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}

```

```js
  具体接口应该做处理：
  @Post('album')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    console.log('file>>', file);
    return true;
  }
```

```
图片上传到服务器了，用户怎么访问，因此需要解决静态资源的访问问题，在main.ts入口文件中做处理。
app.useStaticAssets(join(__dirname, 'images')); // 使用中间件托管静态资源，因此外部可通过服务器域名直接访问图片地址
```
