import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';
import { Notifications } from '@fizzup/shared';

@Entity({ tableName: 'notifications' })
export class NotificationsEntity
  extends BaseEntity
  implements Notifications
{
  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property({ default: false })
  isRead!: boolean;

  @ManyToOne({
    entity: () => UserEntity,
    inversedBy: 'notifications',
  })
  user!: UserEntity;
}
