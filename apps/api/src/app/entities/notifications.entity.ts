import { Entity, ManyToOne, Property, Opt } from '@mikro-orm/postgresql';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'notifications' })
export class NotificationsEntity extends BaseEntity {
  @Property()
  type: string & Opt = 'system_info';

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property({ nullable: true, columnType: 'text' })
  data?: string;

  @Property({ default: false })
  isRead: boolean & Opt = false;

  @ManyToOne({
    entity: () => UserEntity,
    inversedBy: 'notifications',
  })
  user!: UserEntity;
}
