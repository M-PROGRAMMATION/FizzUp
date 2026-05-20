import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadgeEntity } from '../entities/badge.entity';
import { UserBadgeEntity } from '../entities/user-badge.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class BadgesService {
  constructor(private readonly em: EntityManager) {}

  async findAllWithUserStatus(userId: string) {
    const badges = await this.em.find(BadgeEntity, {}, { orderBy: { createdAt: 'ASC' }, populate: ['createdAt'] });
    const userBadges = await this.em.find(
      UserBadgeEntity,
      { user: { id: userId } },
      { populate: ['badge', 'createdAt'] },
    );
    const unlockedMap = new Map(userBadges.map((ub) => [ub.badge.id, ub.unlockedAt]));

    return badges.map((b) => ({
      id: b.id,
      emoji: b.emoji,
      label: b.label,
      description: b.description,
      category: b.category,
      unlocked: unlockedMap.has(b.id),
      unlockedAt: unlockedMap.get(b.id)?.toISOString() ?? null,
    }));
  }

  async unlockBadge(userId: string, badgeId: string) {
    const existing = await this.em.findOne(UserBadgeEntity, {
      user: { id: userId },
      badge: { id: badgeId },
    });
    if (existing) return;

    const badge = await this.em.findOneOrFail(BadgeEntity, { id: badgeId });
    const ub = this.em.create(UserBadgeEntity, {
      user: this.em.getReference(UserEntity, userId),
      badge,
    });
    await this.em.persistAndFlush(ub);
  }
}
