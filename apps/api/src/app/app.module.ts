import { Module, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BadgesModule } from './badges/badges.module';
import { FriendsModule } from './friends/friends.module';
import { GroupsModule } from './groups/groups.module';
import { LogsModule } from './logs/logs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';
import config from './config/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    AuthModule,
    BadgesModule,
    FriendsModule,
    GroupsModule,
    LogsModule,
    NotificationsModule,
    ProfilesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly orm: MikroORM) {}

  async onApplicationBootstrap() {
    const migrator = this.orm.getMigrator();
    const pending = await migrator.getPendingMigrations();
    if (pending.length > 0) {
      this.logger.log(`Running ${pending.length} pending migration(s)…`);
      await migrator.up();
      this.logger.log('Migrations applied successfully.');
    }
  }
}
