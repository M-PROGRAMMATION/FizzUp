import { Migration } from '@mikro-orm/migrations';

export class Migration20260308220736 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" text check ("role" in ('user', 'mod', 'admin')) not null default 'user', "refresh_tokens" text[] not null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`create table "notifications" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "description" varchar(255) not null, "is_read" boolean not null default false, "user_id" varchar(255) not null, constraint "notifications_pkey" primary key ("id"));`);

    this.addSql(`alter table "notifications" add constraint "notifications_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "notifications" drop constraint "notifications_user_id_foreign";`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "notifications" cascade;`);
  }

}
