import { Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('badges')
@UseGuards(JwtAuthGuard)
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get('me')
  getMyBadges(@Request() req: Express.Request & { user: { id: string } }) {
    return this.badgesService.findAllWithUserStatus(req.user.id);
  }

  @Post('unlock/:badgeId')
  unlockBadge(
    @Request() req: Express.Request & { user: { id: string } },
    @Param('badgeId') badgeId: string,
  ) {
    return this.badgesService.unlockBadge(req.user.id, badgeId);
  }
}
