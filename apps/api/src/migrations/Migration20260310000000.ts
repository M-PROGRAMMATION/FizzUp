import { Migration } from '@mikro-orm/migrations';

export class Migration20260310000000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "logs" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "level" text check ("level" in ('info', 'warn', 'error', 'success')) not null, "category" text check ("category" in ('auth', 'user', 'device', 'system', 'payment', 'security')) not null, "message" varchar(255) not null, "actor" varchar(255) null, "target" varchar(255) null, "ip" varchar(255) null, "details" text null, constraint "logs_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "logs" cascade;`);
  }

}
