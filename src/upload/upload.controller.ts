import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { zip } from 'compressing';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('album')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    console.log('file>>', file);
    return true;
  }

  @Get('export')
  export(@Res() res: Response) {
    const url = join(__dirname, '../images/1751099171132.jpeg');
    res.download(url);
  }

  @Get('download')
  async download(@Res() res: Response) {
    const tarStream = new zip.Stream();
    const url = join(__dirname, '../images/1751099171132.jpeg');
    await tarStream.addEntry(url);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=lele');

    tarStream.pipe(res);
  }
}
