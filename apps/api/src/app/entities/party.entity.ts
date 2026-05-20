import { Collection, Entity, ManyToOne, OneToMany, Opt, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { GroupEntity } from './group.entity';
import { PartyMemberEntity } from './party-member.entity';

export const PartyStatusEnum = {
  ACTIVE: 'active',
  FINISHED: 'finished',
} as const;

export type PartyStatus = 'active' | 'finished';

@Entity({ tableName: 'parties' })
export class PartyEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity)
  group!: GroupEntity;

  @Property()
  name!: string;

  @Property({ default: 'active' })
  status: PartyStatus & Opt = 'active';

  @Property({ nullable: true })
  endedAt?: Date;

  @OneToMany(() => PartyMemberEntity, (pm) => pm.party)
  partyMembers = new Collection<PartyMemberEntity>(this);
}
