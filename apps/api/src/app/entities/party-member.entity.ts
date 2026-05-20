import { Entity, ManyToOne, Opt, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { PartyEntity } from './party.entity';

@Entity({ tableName: 'party_members' })
export class PartyMemberEntity extends BaseEntity {
  @ManyToOne(() => PartyEntity)
  party!: PartyEntity;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @Property({ default: 0 })
  verres: number & Opt = 0;

  @Property({ default: 0 })
  bouteilles: number & Opt = 0;
}
