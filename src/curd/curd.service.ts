import { Injectable } from '@nestjs/common';
import { CreateCurdDto } from './dto/create-curd.dto';
import { UpdateCurdDto } from './dto/update-curd.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curd } from './entities/curd.entity';
import { Tag } from './entities/tags.entity';
import { Repository, Like } from 'typeorm';

@Injectable()
export class CurdService {
  constructor(
    @InjectRepository(Curd) private readonly curd: Repository<Curd>,
    @InjectRepository(Tag) private readonly tag: Repository<Tag>,
  ) {}
  // 增
  create(createCurdDto) {
    const curd = new Curd();
    curd.name = createCurdDto.name;
    curd.desc = createCurdDto.desc;

    return this.curd.save(curd);
  }

  // 删
  remove(id: string) {
    return this.curd.delete(id);
  }

  // 改
  update(id: string, updateCurdDto) {
    return this.curd.update(id, updateCurdDto);
  }

  // 查
  async findAll(query) {
    const data = await this.curd.find({
      relations: ['tags'],
      where: {
        name: Like(`%${query.keyWord}%`),
      },
      // 分页相关
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      order: {
        create_time: 'DESC', // 默认按id降序
      },
    });

    const total = await this.curd.count({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
    });

    return {
      data,
      total,
    };
  }

  async addTags(requestData: { userId: string; tags: string[] }) {
    console.log('requestData>>', requestData);

    const tagList: Tag[] = [];
    for (let i = 0; i < requestData.tags.length; i++) {
      const tag = new Tag();
      tag.name = requestData.tags[i];
      await this.tag.save(tag);
      tagList.push(tag);
    }

    const userInfo = await this.curd.findOne({
      where: {
        id: requestData.userId,
      },
    });

    userInfo.tags = tagList;

    this.curd.save(userInfo);

    console.log('userInfo>>', userInfo);

    return true;
  }
}
