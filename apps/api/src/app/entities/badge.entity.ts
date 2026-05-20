import { Collection, Entity, OneToMany, Opt, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { UserBadgeEntity } from './user-badge.entity';

@Entity({ tableName: 'badges' })
export class BadgeEntity extends BaseEntity {
  @Property()
  emoji!: string;

  @Property()
  label!: string;

  @Property()
  description!: string;

  @Property({ default: 'general' })
  category: string & Opt = 'general';

  @OneToMany(() => UserBadgeEntity, (ub) => ub.badge)
  userBadges = new Collection<UserBadgeEntity>(this);
}
