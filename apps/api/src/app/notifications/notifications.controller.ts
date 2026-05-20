import { Controller, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthReq = Express.Request & { user: { id: string; email: string; role: string } };

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getAll(@Request() req: AuthReq) {
    return this.notificationsService.findAll(req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: AuthReq) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  markRead(@Param('id') id: string, @Request() req: AuthReq) {
    return this.notificationsService.markRead(id, req.user.id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAllRead(@Request() req: AuthReq) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  @Post(':id/accept-group-invite')
  acceptGroupInvite(@Param('id') id: string, @Request() req: AuthReq) {
    return this.notificationsService.acceptGroupInvite(id, req.user.id);
  }

  @Post(':id/decline-group-invite')
  @HttpCode(HttpStatus.NO_CONTENT)
  declineGroupInvite(@Param('id') id: string, @Request() req: AuthReq) {
    return this.notificationsService.declineGroupInvite(id, req.user.id);
  }
}
