import type { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../app/entities/user.entity';
import { UserRole } from '@fizzup/shared';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const seeds: Array<{ email: string; password: string; role: UserRole }> = [
      {
        email: 'admin@fizzup.com',
        password: 'Admin1234!',
        role: UserRole.ADMIN,
      },
      {
        email: 'user@fizzup.com',
        password: 'User1234!',
        role: UserRole.USER,
      },
    ];

    for (const seed of seeds) {
      const exists = await em.findOne(UserEntity, { email: seed.email });
      if (exists) {
        continue;
      }

      const user = em.create(UserEntity, {
        email: seed.email,
        password: await bcrypt.hash(seed.password, 10),
        role: seed.role,
        refreshTokens: [],
      });

      em.persist(user);
    }

    await em.flush();
  }
}
