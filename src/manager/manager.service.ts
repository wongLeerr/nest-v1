import { Injectable } from '@nestjs/common';
import { CreateManagerDto, TransferMoneyDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './entities/manager.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager) private readonly money: Repository<Manager>,
  ) {}

  create(createManagerDto: CreateManagerDto) {
    return 'This action adds a new manager';
  }

  findAll() {
    return `This action returns all manager`;
  }

  findOne(id: number) {
    return `This action returns a #${id} manager`;
  }

  update(id: number, updateManagerDto: UpdateManagerDto) {
    return `This action updates a #${id} manager`;
  }

  remove(id: number) {
    return `This action removes a #${id} manager`;
  }

  async transferMoney(transferMoneyDto: TransferMoneyDto) {
    try {
      return this.money.manager.transaction(async (manager) => {
        let from = await this.money.findOne({
          where: {
            id: transferMoneyDto.fromId,
          },
        });

        let to = await this.money.findOne({
          where: {
            id: transferMoneyDto.toId,
          },
        });

        if (Number(from.money) >= Number(transferMoneyDto.money)) {
          from.money = (
            Number(from.money) - Number(transferMoneyDto.money)
          ).toString();
          to.money = (
            Number(to.money) + Number(transferMoneyDto.money)
          ).toString();

          await this.money.save(from);
          await this.money.save(to);

          return {
            msg: '转账成功',
          };
        } else {
          return {
            msg: '余额不足',
          };
        }

        console.log('from>>', from, 'to>>', to);
        return true;
      });
    } catch (error) {
      throw new Error('Transaction failed');
    }
  }
}
