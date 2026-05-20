import { Entity, OneToOne, Opt, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

export type UserStatus = 'online' | 'offline' | 'en-soiree';

export const UserStatusEnum = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  EN_SOIREE: 'en-soiree',
} as const;

@Entity({ tableName: 'user_profiles' })
export class UserProfileEntity extends BaseEntity {
  @OneToOne({
    entity: () => UserEntity,
    inversedBy: 'profile',
    joinColumn: 'user_id',
  })
  user!: UserEntity;

  @Property({ nullable: true })
  username?: string;

  @Property({ nullable: true })
  displayName?: string;

  @Property({ default: 0 })
  totalVerres: number & Opt = 0;

  @Property({ default: 0 })
  totalBouteilles: number & Opt = 0;

  @Property({ default: 0 })
  totalSoirees: number & Opt = 0;

  @Property({ default: 0 })
  streak: number & Opt = 0;

  @Property({ default: 0 })
  points: number & Opt = 0;

  @Property({ default: 'offline' })
  status: string & Opt = 'offline';

  @Property({ nullable: true })
  currentActivity?: string;

  @Property({ nullable: true })
  lastSeen?: Date;
}
