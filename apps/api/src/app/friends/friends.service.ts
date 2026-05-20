import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { FriendshipEntity } from '../entities/friendship.entity';
import { UserEntity } from '../entities/user.entity';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { UserBadgeEntity } from '../entities/user-badge.entity';
import { GroupMemberEntity } from '../entities/group-member.entity';

@Injectable()
export class FriendsService {
  constructor(private readonly em: EntityManager) {}

  private async getUserInfo(userId: string) {
    const profile = await this.em.findOne(UserProfileEntity, { user: { id: userId } });
    const user = await this.em.findOneOrFail(UserEntity, { id: userId });
    const userBadges = await this.em.find(UserBadgeEntity, { user: { id: userId } }, { populate: ['badge'] });
    const displayName = profile?.displayName ?? user.email.split('@')[0];
    return {
      id: user.id,
      email: user.email,
      username: profile?.username ?? `@${user.email.split('@')[0]}`,
      displayName,
      avatar: displayName[0].toUpperCase(),
      avatarColor: null,
      status: profile?.status ?? 'offline',
      currentActivity: profile?.currentActivity ?? null,
      lastSeen: null,
      totalVerres: profile?.totalVerres ?? 0,
      totalBouteilles: profile?.totalBouteilles ?? 0,
      totalSoirees: profile?.totalSoirees ?? 0,
      streak: profile?.streak ?? 0,
      points: profile?.points ?? 0,
      badges: userBadges.map((ub) => ub.badge.emoji),
    };
  }

  private async getMutualGroups(userIdA: string, userIdB: string): Promise<string[]> {
    const membershipsA = await this.em.find(GroupMemberEntity, { user: { id: userIdA } }, { populate: ['group'] });
    const membershipsB = await this.em.find(GroupMemberEntity, { user: { id: userIdB } }, { populate: ['group'] });
    const groupIdsA = new Set(membershipsA.map((m) => m.group.id));
    return membershipsB
      .filter((m) => groupIdsA.has(m.group.id))
      .map((m) => m.group.name);
  }

  private async getMutualFriendsCount(userIdA: string, userIdB: string): Promise<number> {
    const friendsA = await this.getFriendIds(userIdA);
    const friendsB = await this.getFriendIds(userIdB);
    const setB = new Set(friendsB);
    return friendsA.filter((id) => setB.has(id)).length;
  }

  private async getFriendIds(userId: string): Promise<string[]> {
    const friendships = await this.em.find(FriendshipEntity, {
      $or: [
        { requester: { id: userId }, status: 'accepted' },
        { addressee: { id: userId }, status: 'accepted' },
      ],
    });
    return friendships.map((f) =>
      f.requester.id === userId ? f.addressee.id : f.requester.id,
    );
  }

  async findFriends(userId: string) {
    const friendships = await this.em.find(
      FriendshipEntity,
      {
        $or: [
          { requester: { id: userId }, status: 'accepted' },
          { addressee: { id: userId }, status: 'accepted' },
        ],
      },
      { populate: ['requester', 'addressee', 'createdAt'] },
    );

    return Promise.all(
      friendships.map(async (f) => {
        const friendId = f.requester.id === userId ? f.addressee.id : f.requester.id;
        const userInfo = await this.getUserInfo(friendId);
        const mutualGroups = await this.getMutualGroups(userId, friendId);
        const mutualFriends = await this.getMutualFriendsCount(userId, friendId);
        return {
          friendshipId: f.id,
          since: f.createdAt?.toISOString() ?? null,
          mutualGroups,
          mutualFriends,
          user: userInfo,
        };
      }),
    );
  }

  async findRequests(userId: string) {
    const requests = await this.em.find(
      FriendshipEntity,
      { addressee: { id: userId }, status: 'pending' },
      { populate: ['requester', 'createdAt'] },
    );

    return Promise.all(
      requests.map(async (f) => {
        const userInfo = await this.getUserInfo(f.requester.id);
        const mutualGroups = await this.getMutualGroups(userId, f.requester.id);
        return {
          id: f.id,
          sentAt: f.createdAt?.toISOString() ?? null,
          mutualFriends: 0,
          mutualGroups,
          user: userInfo,
        };
      }),
    );
  }

  async findSuggestions(userId: string) {
    const friendIds = new Set(await this.getFriendIds(userId));
    const pendingIds = await this.getPendingIds(userId);
    const excludeIds = new Set([userId, ...friendIds, ...pendingIds]);

    const users = await this.em.find(
      UserEntity,
      { id: { $nin: [...excludeIds] } },
      { orderBy: { createdAt: 'DESC' }, limit: 5, populate: ['createdAt'] },
    );

    return Promise.all(
      users.map(async (u) => {
        const userInfo = await this.getUserInfo(u.id);
        const mutualGroups = await this.getMutualGroups(userId, u.id);
        const mutualFriends = await this.getMutualFriendsCount(userId, u.id);
        return { id: u.id, mutualGroups, mutualFriends, user: userInfo };
      }),
    );
  }

  private async getPendingIds(userId: string): Promise<string[]> {
    const pendings = await this.em.find(FriendshipEntity, {
      $or: [
        { requester: { id: userId }, status: 'pending' },
        { addressee: { id: userId }, status: 'pending' },
      ],
    });
    return pendings.map((f) =>
      f.requester.id === userId ? f.addressee.id : f.requester.id,
    );
  }

  async sendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) throw new BadRequestException('Impossible de s\'ajouter soi-même');

    const existing = await this.em.findOne(FriendshipEntity, {
      $or: [
        { requester: { id: requesterId }, addressee: { id: addresseeId } },
        { requester: { id: addresseeId }, addressee: { id: requesterId } },
      ],
    });
    if (existing) throw new BadRequestException('Relation déjà existante');

    const f = this.em.create(FriendshipEntity, {
      requester: this.em.getReference(UserEntity, requesterId),
      addressee: this.em.getReference(UserEntity, addresseeId),
    });
    await this.em.persistAndFlush(f);
    return { id: f.id };
  }

  async acceptRequest(friendshipId: string, userId: string) {
    const f = await this.em.findOne(FriendshipEntity, { id: friendshipId, addressee: { id: userId } });
    if (!f) throw new NotFoundException('Demande introuvable');
    f.status = 'accepted';
    await this.em.flush();
    return { id: f.id, status: f.status };
  }

  async remove(friendshipId: string, userId: string) {
    const f = await this.em.findOne(FriendshipEntity, {
      id: friendshipId,
      $or: [{ requester: { id: userId } }, { addressee: { id: userId } }],
    });
    if (!f) throw new NotFoundException('Relation introuvable');
    await this.em.removeAndFlush(f);
  }
}
