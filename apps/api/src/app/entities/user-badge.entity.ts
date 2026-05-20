import { Entity, ManyToOne, Opt, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { BadgeEntity } from './badge.entity';

@Entity({ tableName: 'user_badges' })
export class UserBadgeEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => BadgeEntity)
  badge!: BadgeEntity;

  @Property({ default: 'now()' })
  unlockedAt: Date & Opt = new Date();
}
