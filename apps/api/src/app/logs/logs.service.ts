import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { LogEntity } from '../entities/log.entity';
import { LogLevel, LogCategory } from '@fizzup/shared';

export interface CreateLogDto {
  level: LogLevel;
  category: LogCategory;
  message: string;
  actor?: string;
  target?: string;
  ip?: string;
  details?: string;
}

@Injectable()
export class LogsService {
  constructor(private readonly em: EntityManager) {}

  async createLog(data: CreateLogDto): Promise<LogEntity> {
    const log = this.em.create(LogEntity, data);
    await this.em.persistAndFlush(log);
    return log;
  }

  async findAll(): Promise<LogEntity[]> {
    return this.em.find(LogEntity, {}, { orderBy: { createdAt: 'DESC' }, populate: ['createdAt'] });
  }
}
