import { Collection, Entity, ManyToOne, OneToMany, Opt, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { GroupMemberEntity } from './group-member.entity';
import { PartyEntity } from './party.entity';

@Entity({ tableName: 'groups' })
export class GroupEntity extends BaseEntity {
  @Property()
  name!: string;

  @Property({ default: '🍺' })
  emoji: string & Opt = '🍺';

  @Property({ default: '' })
  description: string & Opt = '';

  @ManyToOne(() => UserEntity)
  owner!: UserEntity;

  @OneToMany(() => GroupMemberEntity, (gm) => gm.group)
  members = new Collection<GroupMemberEntity>(this);

  @OneToMany(() => PartyEntity, (p) => p.group)
  parties = new Collection<PartyEntity>(this);
}
