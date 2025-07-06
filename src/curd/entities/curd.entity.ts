import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tag } from './tags.entity';

@Entity()
export class Curd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  desc: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_time: Date;

  // 关联标签
  @OneToMany(() => Tag, (tag) => tag.curd)
  tags: Tag[];
}
