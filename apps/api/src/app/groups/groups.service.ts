import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { GroupEntity } from '../entities/group.entity';
import { GroupMemberEntity } from '../entities/group-member.entity';
import { PartyEntity } from '../entities/party.entity';
import { PartyMemberEntity } from '../entities/party-member.entity';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { UserEntity } from '../entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { LogsService } from '../logs/logs.service';
import { LogLevel, LogCategory } from '@fizzup/shared';

@Injectable()
export class GroupsService {
  constructor(
    private readonly em: EntityManager,
    private readonly notificationsService: NotificationsService,
    private readonly logsService: LogsService,
  ) {}

  private formatDuration(start: Date, end: Date): string {
    const ms = end.getTime() - start.getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`;
  }

  async findMyGroups(userId: string) {
    const memberships = await this.em.find(
      GroupMemberEntity,
      { user: { id: userId } },
      { populate: ['group', 'group.owner', 'group.members', 'group.parties', 'group.createdAt'] },
    );

    return memberships.map((m) => {
      const g = m.group;
      const parties = g.parties.getItems();
      return {
        id: g.id,
        name: g.name,
        emoji: g.emoji,
        description: g.description,
        memberCount: g.members.count(),
        hasActiveParty: parties.some((p) => p.status === 'active'),
        partyCount: parties.length,
        isOwner: g.owner.id === userId,
      };
    });
  }

  async findOne(groupId: string, userId: string) {
    const group = await this.em.findOne(
      GroupEntity,
      { id: groupId },
      { populate: ['owner', 'members', 'members.user', 'parties', 'parties.partyMembers', 'parties.partyMembers.user', 'createdAt', 'parties.createdAt'] },
    );
    if (!group) throw new NotFoundException('Groupe introuvable');

    const isMember = group.members.getItems().some((m) => m.user.id === userId);
    if (!isMember) throw new ForbiddenException('Accès refusé');

    const parties = await Promise.all(
      group.parties.getItems()
        .sort((a, b) => {
          if (a.status === 'active' && b.status !== 'active') return -1;
          if (b.status === 'active' && a.status !== 'active') return 1;
          return 0;
        })
        .map(async (party) => {
          const profileIds = party.partyMembers.getItems().map((pm) => pm.user.id);
          const profiles = await this.em.find(UserProfileEntity, { user: { id: { $in: profileIds } } });
          const profileMap = new Map(profiles.map((p) => [p.user.id, p]));

          const members = party.partyMembers.getItems().map((pm) => {
            const profile = profileMap.get(pm.user.id);
            const displayName = profile?.displayName ?? pm.user.email.split('@')[0];
            return {
              id: pm.id,
              userId: pm.user.id,
              name: displayName,
              avatar: displayName[0].toUpperCase(),
              isMe: pm.user.id === userId,
              verres: pm.verres,
              bouteilles: pm.bouteilles,
            };
          });

          return {
            id: party.id,
            name: party.name,
            status: party.status,
            startedAt: party.createdAt?.toISOString() ?? null,
            endedAt: party.endedAt?.toISOString() ?? null,
            duration: party.endedAt && party.createdAt
              ? this.formatDuration(party.createdAt, party.endedAt)
              : null,
            members,
          };
        }),
    );

    return {
      id: group.id,
      name: group.name,
      emoji: group.emoji,
      description: group.description,
      ownerId: group.owner.id,
      memberCount: group.members.count(),
      memberIds: group.members.getItems().map((m) => m.user.id),
      parties,
    };
  }

  async updateGroup(groupId: string, userId: string, data: { name?: string; emoji?: string; description?: string }) {
    const group = await this.em.findOne(GroupEntity, { id: groupId }, { populate: ['owner'] });
    if (!group) throw new NotFoundException('Groupe introuvable');
    if (group.owner.id !== userId) throw new ForbiddenException('Seul le créateur peut modifier le groupe');

    if (data.name !== undefined) group.name = data.name;
    if (data.emoji !== undefined) group.emoji = data.emoji;
    if (data.description !== undefined) group.description = data.description;
    await this.em.flush();

    const user = await this.em.findOneOrFail(UserEntity, { id: userId });
    await this.logsService.createLog({
      level: LogLevel.INFO,
      category: LogCategory.SOCIAL,
      message: `${user.email} a modifié le groupe "${group.name}"`,
      actor: userId,
      target: groupId,
    });

    return { id: group.id, name: group.name, emoji: group.emoji, description: group.description };
  }

  async updateParty(groupId: string, partyId: string, userId: string, name: string) {
    const group = await this.em.findOne(GroupEntity, { id: groupId }, { populate: ['owner'] });
    if (!group) throw new NotFoundException('Groupe introuvable');
    if (group.owner.id !== userId) throw new ForbiddenException('Seul le créateur peut modifier la soirée');

    const party = await this.em.findOne(PartyEntity, { id: partyId, group: { id: groupId } });
    if (!party) throw new NotFoundException('Soirée introuvable');

    party.name = name;
    await this.em.flush();

    return { id: party.id, name: party.name };
  }

  async create(userId: string, data: { name: string; emoji?: string; description?: string }) {
    const user = await this.em.findOneOrFail(UserEntity, { id: userId });

    const group = this.em.create(GroupEntity, {
      name: data.name,
      emoji: data.emoji ?? '🍺',
      description: data.description ?? '',
      owner: this.em.getReference(UserEntity, userId),
    });
    await this.em.persistAndFlush(group);

    const member = this.em.create(GroupMemberEntity, {
      group,
      user: this.em.getReference(UserEntity, userId),
    });
    await this.em.persistAndFlush(member);

    await this.logsService.createLog({
      level: LogLevel.SUCCESS,
      category: LogCategory.SOCIAL,
      message: `${user.email} a créé le groupe "${data.name}"`,
      actor: userId,
      target: group.id,
    });

    return { id: group.id, name: group.name, emoji: group.emoji, description: group.description };
  }

  async createParty(groupId: string, userId: string, name: string) {
    const group = await this.em.findOne(GroupEntity, { id: groupId }, { populate: ['members', 'members.user'] });
    if (!group) throw new NotFoundException('Groupe introuvable');

    const isMember = group.members.getItems().some((m) => m.user.id === userId);
    if (!isMember) throw new ForbiddenException('Accès refusé');

    const user = await this.em.findOneOrFail(UserEntity, { id: userId });

    const party = this.em.create(PartyEntity, { group, name, status: 'active' });
    await this.em.persistAndFlush(party);

    const pm = this.em.create(PartyMemberEntity, {
      party,
      user: this.em.getReference(UserEntity, userId),
      verres: 0,
      bouteilles: 0,
    });
    await this.em.persistAndFlush(pm);

    // Notify all other group members
    const otherMembers = group.members.getItems().filter((m) => m.user.id !== userId);
    await Promise.all(
      otherMembers.map((m) =>
        this.notificationsService.create(
          m.user.id,
          'party_started',
          `Soirée lancée dans ${group.emoji} ${group.name}`,
          `${user.email.split('@')[0]} a lancé "${name}" — rejoins la soirée !`,
          { groupId, groupName: group.name, groupEmoji: group.emoji, partyId: party.id, partyName: name },
        ),
      ),
    );

    await this.logsService.createLog({
      level: LogLevel.INFO,
      category: LogCategory.SOCIAL,
      message: `${user.email} a lancé la soirée "${name}" dans "${group.name}"`,
      actor: userId,
      target: party.id,
    });

    return { id: party.id, name: party.name, status: party.status };
  }

  async finishParty(groupId: string, partyId: string, userId: string) {
    const party = await this.em.findOne(PartyEntity, { id: partyId, group: { id: groupId } });
    if (!party) throw new NotFoundException('Soirée introuvable');

    const user = await this.em.findOneOrFail(UserEntity, { id: userId });

    party.status = 'finished';
    party.endedAt = new Date();
    await this.em.flush();

    await this.logsService.createLog({
      level: LogLevel.INFO,
      category: LogCategory.SOCIAL,
      message: `${user.email} a terminé la soirée "${party.name}"`,
      actor: userId,
      target: partyId,
    });

    return { id: party.id, status: party.status };
  }

  async inviteToGroup(groupId: string, inviterId: string, inviteeId: string) {
    const group = await this.em.findOne(GroupEntity, { id: groupId }, { populate: ['members', 'members.user'] });
    if (!group) throw new NotFoundException('Groupe introuvable');

    const isMember = group.members.getItems().some((m) => m.user.id === inviterId);
    if (!isMember) throw new ForbiddenException('Accès refusé');

    const alreadyMember = group.members.getItems().some((m) => m.user.id === inviteeId);
    if (alreadyMember) throw new BadRequestException('Cet utilisateur est déjà membre');

    const inviter = await this.em.findOneOrFail(UserEntity, { id: inviterId });
    const inviterName = inviter.email.split('@')[0];

    await this.notificationsService.create(
      inviteeId,
      'group_invite',
      `Invitation à rejoindre ${group.emoji} ${group.name}`,
      `${inviterName} vous invite à rejoindre ${group.emoji} ${group.name}`,
      { groupId, groupName: group.name, groupEmoji: group.emoji, inviterId, inviterName },
    );

    await this.logsService.createLog({
      level: LogLevel.INFO,
      category: LogCategory.SOCIAL,
      message: `${inviter.email} a invité ${inviteeId} dans "${group.name}"`,
      actor: inviterId,
      target: inviteeId,
    });
  }

  async joinGroup(groupId: string, userId: string) {
    const existing = await this.em.findOne(GroupMemberEntity, { group: { id: groupId }, user: { id: userId } });
    if (existing) return;

    const member = this.em.create(GroupMemberEntity, {
      group: this.em.getReference(GroupEntity, groupId),
      user: this.em.getReference(UserEntity, userId),
    });
    await this.em.persistAndFlush(member);
  }
}
