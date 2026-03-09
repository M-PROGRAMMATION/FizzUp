import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  id: string & Opt = v4();

  @Property({ lazy: true })
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date(), lazy: true })
  updatedAt: Date & Opt = new Date();
}
