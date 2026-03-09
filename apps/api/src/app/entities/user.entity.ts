import {
  Entity,
  Enum,
  Property,
  Unique,
  Collection,
  OneToMany,
} from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { User, UserRole } from '@fizzup/shared';
import { NotificationsEntity } from './notifications.entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity implements User {
  @Property()
  @Unique()
  email!: string;

  @Property()
  password!: string;

  @Enum({
    items: () => UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Property()
  refreshTokens: string[] = [];

  /*@OneToOne({
    entity: () => UserProfileEntity,
    mappedBy: 'user',
    nullable: true,
  })
  profile: UserProfileEntity;*/

  @OneToMany({
    entity: () => NotificationsEntity,
    mappedBy: 'user',
  })
  notifications = new Collection<NotificationsEntity>(this);
}
