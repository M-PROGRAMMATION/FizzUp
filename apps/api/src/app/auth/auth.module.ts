import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LogsModule } from '../logs/logs.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    LogsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fizzup_fallback_secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
