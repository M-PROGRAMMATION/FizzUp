import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '@fizzup/shared';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { email });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { id });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.em.find(UserEntity, {}, { orderBy: { createdAt: 'DESC' } });
  }

  async create(email: string, password: string): Promise<UserEntity> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.em.create(UserEntity, {
      email,
      password: hashed,
      role: UserRole.USER,
      refreshTokens: [],
    });
    await this.em.persistAndFlush(user);
    return user;
  }
}
