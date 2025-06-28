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
