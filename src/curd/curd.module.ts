import { Module } from '@nestjs/common';
import { CurdService } from './curd.service';
import { CurdController } from './curd.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curd } from './entities/curd.entity';
import { Tag } from './entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curd, Tag])],
  controllers: [CurdController],
  providers: [CurdService],
})
export class CurdModule {}
