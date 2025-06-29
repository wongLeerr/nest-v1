import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpiderService } from './spider.service';
import { CreateSpiderDto } from './dto/create-spider.dto';
import { UpdateSpiderDto } from './dto/update-spider.dto';
import axios from 'axios';

@Controller('spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Get()
  findAll() {
    const getWebsite = async () => {
      const response = await axios.get('https://www.baidu.com');
      console.log('response.data>>', response.data);
    };
    return getWebsite();
  }
}
