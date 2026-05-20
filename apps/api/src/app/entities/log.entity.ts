import { Entity, Enum, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { LogCategory, LogLevel } from '@fizzup/shared';

@Entity({ tableName: 'logs' })
export class LogEntity extends BaseEntity {
  @Enum({ items: () => LogLevel })
  level!: LogLevel;

  @Enum({ items: () => LogCategory })
  category!: LogCategory;

  @Property()
  message!: string;

  @Property({ nullable: true })
  actor?: string;

  @Property({ nullable: true })
  target?: string;

  @Property({ nullable: true })
  ip?: string;

  @Property({ nullable: true, columnType: 'text' })
  details?: string;
}
