import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [NotificationsModule, LogsModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
