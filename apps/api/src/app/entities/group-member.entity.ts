import { Entity, ManyToOne } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { GroupEntity } from './group.entity';

@Entity({ tableName: 'group_members' })
export class GroupMemberEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity)
  group!: GroupEntity;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;
}
