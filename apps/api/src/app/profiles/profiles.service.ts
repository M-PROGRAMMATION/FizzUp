import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(private readonly em: EntityManager) {}

  async findOrCreate(userId: string): Promise<UserProfileEntity> {
    let profile = await this.em.findOne(UserProfileEntity, { user: { id: userId } });
    if (!profile) {
      profile = this.em.create(UserProfileEntity, { user: this.em.getReference(UserEntity, userId) });
      await this.em.persistAndFlush(profile);
    }
    return profile;
  }

  async getMe(userId: string) {
    const profile = await this.findOrCreate(userId);
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      totalVerres: profile.totalVerres,
      totalBouteilles: profile.totalBouteilles,
      totalSoirees: profile.totalSoirees,
      streak: profile.streak,
      points: profile.points,
      status: profile.status,
      currentActivity: profile.currentActivity,
    };
  }

  async updateMe(userId: string, data: Partial<{ username: string; displayName: string; status: string; currentActivity: string }>) {
    const profile = await this.findOrCreate(userId);
    this.em.assign(profile, data);
    await this.em.flush();
    return this.getMe(userId);
  }
}
