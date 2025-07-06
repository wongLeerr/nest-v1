import { PartialType } from '@nestjs/swagger';
import { CreateCurdDto } from './create-curd.dto';

export class UpdateCurdDto extends PartialType(CreateCurdDto) {}
