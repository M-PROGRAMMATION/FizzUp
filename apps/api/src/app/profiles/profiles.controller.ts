import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  getMe(@Request() req: Express.Request & { user: { id: string } }) {
    return this.profilesService.getMe(req.user.id);
  }

  @Patch('me')
  updateMe(
    @Request() req: Express.Request & { user: { id: string } },
    @Body() body: { username?: string; displayName?: string; status?: string; currentActivity?: string },
  ) {
    return this.profilesService.updateMe(req.user.id, body);
  }
}
