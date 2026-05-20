import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@fizzup/shared';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    const logs = await this.logsService.findAll();
    return logs.map((log) => ({
      id: log.id,
      timestamp: log.createdAt.toISOString(),
      level: log.level,
      category: log.category,
      message: log.message,
      actor: log.actor,
      target: log.target,
      ip: log.ip,
      details: log.details,
    }));
  }
}
