import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Request,
  Param,
  Body,
  Query,
  Headers,
  HttpCode,
  Version,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as svgCaptcha from 'svg-captcha'; // 生成验证码的工具

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('verifyCode')
  getVerifyCode(@Req() req, @Res() res, @Session() session) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
    session.code = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('createUser')
  createUser(@Request() req, @Session() session) {
    console.log('req.body>>', req.body);
    console.log('session code>>', session.code);
    if (
      session.code.toLocaleLowerCase() ===
      req.body.verifyCode.toLocaleLowerCase()
    ) {
      return {
        status: 200,
        msg: 'ok',
      };
    }
    return {
      status: 200,
      msg: 'no',
    };
  }
}

/**
 *   @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Version('1')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  

    @Get()
  getAll(@Request() req) {
    console.log('getAll req>>', req.query);
    return {
      code: 200,
      msg: req.query.name,
    };
  }

  @Post()
  create(@Request() req) {
    console.log('create req>>', req.body.name);
    return {
      code: 200,
      msg: req.body.name,
    };
  }

  @Get(':id')
  @HttpCode(520)
  getOneById(@Request() req, @Headers() headers) {
    console.log('getAll req>>', req.params);
    console.log('headers>>', headers);
    return {
      code: 200,
      msg: req.params.id,
    };
  }
 */
