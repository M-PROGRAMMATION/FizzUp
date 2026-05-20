import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { NotificationsEntity } from '../entities/notifications.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly em: EntityManager) {}

  async findAll(userId: string) {
    const notifs = await this.em.find(
      NotificationsEntity,
      { user: { id: userId } },
      { orderBy: { createdAt: 'DESC' }, populate: ['createdAt'] },
    );
    return notifs.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description,
      data: n.data ? JSON.parse(n.data) : null,
      isRead: n.isRead,
      createdAt: n.createdAt?.toISOString() ?? null,
    }));
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.em.count(NotificationsEntity, { user: { id: userId }, isRead: false });
  }

  async create(
    userId: string,
    type: string,
    title: string,
    description: string,
    data?: object,
  ): Promise<NotificationsEntity> {
    const notif = this.em.create(NotificationsEntity, {
      user: this.em.getReference(UserEntity, userId),
      type,
      title,
      description,
      data: data ? JSON.stringify(data) : undefined,
      isRead: false,
    });
    await this.em.persistAndFlush(notif);
    return notif;
  }

  async markRead(notificationId: string, userId: string) {
    const notif = await this.em.findOne(NotificationsEntity, {
      id: notificationId,
      user: { id: userId },
    });
    if (!notif) throw new NotFoundException('Notification introuvable');
    notif.isRead = true;
    await this.em.flush();
  }

  async markAllRead(userId: string) {
    const notifs = await this.em.find(NotificationsEntity, {
      user: { id: userId },
      isRead: false,
    });
    for (const n of notifs) n.isRead = true;
    await this.em.flush();
  }

  async acceptGroupInvite(notificationId: string, userId: string): Promise<{ groupId: string }> {
    const notif = await this.em.findOne(NotificationsEntity, {
      id: notificationId,
      user: { id: userId },
    });
    if (!notif) throw new NotFoundException('Notification introuvable');
    if (notif.type !== 'group_invite') throw new BadRequestException('Mauvais type de notification');
    const data = notif.data ? JSON.parse(notif.data) : null;
    if (!data?.groupId) throw new BadRequestException('Données manquantes');
    notif.isRead = true;
    await this.em.flush();
    return { groupId: data.groupId };
  }

  async declineGroupInvite(notificationId: string, userId: string) {
    const notif = await this.em.findOne(NotificationsEntity, {
      id: notificationId,
      user: { id: userId },
    });
    if (!notif) throw new NotFoundException('Notification introuvable');
    notif.isRead = true;
    await this.em.flush();
  }
}
