import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  controllers: [LogsController],
  providers: [LogsService, RolesGuard],
  exports: [LogsService],
})
export class LogsModule {}
