import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class LoginPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log('value>>', value);
    console.log('metadata>>', metadata);
    const DTO = plainToInstance(metadata.metatype, value); // 实例化一下 CreateLoginDto，交给plainToInstance，并把value的值传入，会给我们做一个反射操作
    // const errors = await validate(DTO);
    // if (errors.length > 0) {
    //   throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    // }
    // console.log('errors>>', errors);
    console.log('DTO>>', DTO);
    return value;
  }
}
