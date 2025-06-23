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
