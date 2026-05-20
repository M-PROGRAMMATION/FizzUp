import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthReq = Express.Request & { user: { id: string; email: string; role: string } };

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  getMyGroups(@Request() req: AuthReq) {
    return this.groupsService.findMyGroups(req.user.id);
  }

  @Get(':id')
  getGroup(@Param('id') id: string, @Request() req: AuthReq) {
    return this.groupsService.findOne(id, req.user.id);
  }

  @Post()
  createGroup(
    @Request() req: AuthReq,
    @Body() body: { name: string; emoji?: string; description?: string },
  ) {
    return this.groupsService.create(req.user.id, body);
  }

  @Patch(':id')
  updateGroup(
    @Param('id') groupId: string,
    @Request() req: AuthReq,
    @Body() body: { name?: string; emoji?: string; description?: string },
  ) {
    return this.groupsService.updateGroup(groupId, req.user.id, body);
  }

  @Post(':id/parties')
  createParty(
    @Param('id') groupId: string,
    @Request() req: AuthReq,
    @Body() body: { name: string },
  ) {
    return this.groupsService.createParty(groupId, req.user.id, body.name);
  }

  @Patch(':id/parties/:partyId')
  updateParty(
    @Param('id') groupId: string,
    @Param('partyId') partyId: string,
    @Request() req: AuthReq,
    @Body() body: { name: string },
  ) {
    return this.groupsService.updateParty(groupId, partyId, req.user.id, body.name);
  }

  @Put(':id/parties/:partyId/finish')
  @HttpCode(HttpStatus.OK)
  finishParty(
    @Param('id') groupId: string,
    @Param('partyId') partyId: string,
    @Request() req: AuthReq,
  ) {
    return this.groupsService.finishParty(groupId, partyId, req.user.id);
  }

  @Post(':id/invite')
  @HttpCode(HttpStatus.NO_CONTENT)
  inviteToGroup(
    @Param('id') groupId: string,
    @Request() req: AuthReq,
    @Body() body: { userId: string },
  ) {
    return this.groupsService.inviteToGroup(groupId, req.user.id, body.userId);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  joinGroup(@Param('id') groupId: string, @Request() req: AuthReq) {
    return this.groupsService.joinGroup(groupId, req.user.id);
  }
}
