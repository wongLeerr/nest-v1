import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CurdService } from './curd.service';
import { CreateCurdDto } from './dto/create-curd.dto';
import { UpdateCurdDto } from './dto/update-curd.dto';

@Controller('curd')
export class CurdController {
  constructor(private readonly curdService: CurdService) {}

  // 增
  @Post()
  create(@Body() createCurdDto: CreateCurdDto) {
    return this.curdService.create(createCurdDto);
  }

  // 删
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.curdService.remove(id);
  }

  // 改
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCurdDto: UpdateCurdDto) {
    return this.curdService.update(id, updateCurdDto);
  }

  // 查
  @Get()
  findAll(@Query() query: { keyWord: string; page: number; pageSize: number }) {
    return this.curdService.findAll(query);
  }

  @Post('/add/tags')
  addTags(@Body() requestData: { userId: string; tags: string[] }) {
    return this.curdService.addTags(requestData);
  }
}
