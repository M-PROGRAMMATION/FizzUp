import { Entity, ManyToOne, Opt, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

export const FriendshipStatusEnum = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
} as const;

export type FriendshipStatus = 'pending' | 'accepted' | 'declined';

@Entity({ tableName: 'friendships' })
export class FriendshipEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  requester!: UserEntity;

  @ManyToOne(() => UserEntity)
  addressee!: UserEntity;

  @Property({ default: 'pending' })
  status: FriendshipStatus & Opt = 'pending';
}
