import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class CreateLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 20, {
    message: '名称必须在5-20个字符之间',
  })
  @IsNumber()
  name: string;
}
