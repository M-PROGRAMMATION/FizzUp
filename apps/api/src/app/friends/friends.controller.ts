import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthReq = Express.Request & { user: { id: string; email: string; role: string } };

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  getFriends(@Request() req: AuthReq) {
    return this.friendsService.findFriends(req.user.id);
  }

  @Get('requests')
  getRequests(@Request() req: AuthReq) {
    return this.friendsService.findRequests(req.user.id);
  }

  @Get('suggestions')
  getSuggestions(@Request() req: AuthReq) {
    return this.friendsService.findSuggestions(req.user.id);
  }

  @Post('request')
  sendRequest(@Request() req: AuthReq, @Body() body: { addresseeId: string }) {
    return this.friendsService.sendRequest(req.user.id, body.addresseeId);
  }

  @Post(':id/accept')
  @HttpCode(HttpStatus.OK)
  acceptRequest(@Param('id') id: string, @Request() req: AuthReq) {
    return this.friendsService.acceptRequest(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: AuthReq) {
    return this.friendsService.remove(id, req.user.id);
  }
}
