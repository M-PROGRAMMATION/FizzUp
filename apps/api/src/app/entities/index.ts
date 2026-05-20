import { BadgeEntity } from './badge.entity';
import { FriendshipEntity } from './friendship.entity';
import { GroupEntity } from './group.entity';
import { GroupMemberEntity } from './group-member.entity';
import { LogEntity } from './log.entity';
import { NotificationsEntity } from './notifications.entity';
import { PartyEntity } from './party.entity';
import { PartyMemberEntity } from './party-member.entity';
import { UserBadgeEntity } from './user-badge.entity';
import { UserEntity } from './user.entity';
import { UserProfileEntity } from './user-profile.entity';

export const entities = [
  UserEntity,
  UserProfileEntity,
  NotificationsEntity,
  LogEntity,
  BadgeEntity,
  UserBadgeEntity,
  GroupEntity,
  GroupMemberEntity,
  PartyEntity,
  PartyMemberEntity,
  FriendshipEntity,
];
