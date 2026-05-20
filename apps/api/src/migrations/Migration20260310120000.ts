import { Migration } from '@mikro-orm/migrations';

export class Migration20260310120000 extends Migration {

  override async up(): Promise<void> {
    // user_profiles
    this.addSql(`create table "user_profiles" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) not null, "username" varchar(255) null, "display_name" varchar(255) null, "total_verres" int not null default 0, "total_bouteilles" int not null default 0, "total_soirees" int not null default 0, "streak" int not null default 0, "points" int not null default 0, "status" varchar(255) not null default 'offline', "current_activity" varchar(255) null, "last_seen" timestamptz null, constraint "user_profiles_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_profiles" add constraint "user_profiles_user_id_unique" unique ("user_id");`);
    this.addSql(`alter table "user_profiles" add constraint "user_profiles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);

    // badges (catalog)
    this.addSql(`create table "badges" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "emoji" varchar(255) not null, "label" varchar(255) not null, "description" varchar(255) not null, "category" varchar(255) not null default 'general', constraint "badges_pkey" primary key ("id"));`);

    // user_badges
    this.addSql(`create table "user_badges" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) not null, "badge_id" varchar(255) not null, "unlocked_at" timestamptz not null default now(), constraint "user_badges_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_badges" add constraint "user_badges_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_badges" add constraint "user_badges_badge_id_foreign" foreign key ("badge_id") references "badges" ("id") on update cascade on delete cascade;`);

    // groups
    this.addSql(`create table "groups" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "emoji" varchar(255) not null default '🍺', "description" varchar(255) not null default '', "owner_id" varchar(255) not null, constraint "groups_pkey" primary key ("id"));`);
    this.addSql(`alter table "groups" add constraint "groups_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;`);

    // group_members
    this.addSql(`create table "group_members" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "group_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "group_members_pkey" primary key ("id"));`);
    this.addSql(`alter table "group_members" add constraint "group_members_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "group_members" add constraint "group_members_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);

    // parties
    this.addSql(`create table "parties" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "group_id" varchar(255) not null, "name" varchar(255) not null, "status" varchar(255) not null default 'active', "ended_at" timestamptz null, constraint "parties_pkey" primary key ("id"));`);
    this.addSql(`alter table "parties" add constraint "parties_group_id_foreign" foreign key ("group_id") references "groups" ("id") on update cascade on delete cascade;`);

    // party_members
    this.addSql(`create table "party_members" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "party_id" varchar(255) not null, "user_id" varchar(255) not null, "verres" int not null default 0, "bouteilles" int not null default 0, constraint "party_members_pkey" primary key ("id"));`);
    this.addSql(`alter table "party_members" add constraint "party_members_party_id_foreign" foreign key ("party_id") references "parties" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "party_members" add constraint "party_members_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);

    // friendships
    this.addSql(`create table "friendships" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "requester_id" varchar(255) not null, "addressee_id" varchar(255) not null, "status" varchar(255) not null default 'pending', constraint "friendships_pkey" primary key ("id"));`);
    this.addSql(`alter table "friendships" add constraint "friendships_requester_id_foreign" foreign key ("requester_id") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "friendships" add constraint "friendships_addressee_id_foreign" foreign key ("addressee_id") references "users" ("id") on update cascade on delete cascade;`);

    // Seed badge catalog
    this.addSql(`insert into "badges" ("id", "created_at", "updated_at", "emoji", "label", "description", "category") values
      ('badge-0000-0000-0000-000000000001', now(), now(), '🍺', 'Premier verre', 'Tireuse utilisée pour la première fois', 'consumption'),
      ('badge-0000-0000-0000-000000000002', now(), now(), '🔓', 'Décapsuleur fou', '10 bouteilles en 1 soir', 'consumption'),
      ('badge-0000-0000-0000-000000000003', now(), now(), '🔥', 'En feu', '7 jours consécutifs', 'streak'),
      ('badge-0000-0000-0000-000000000004', now(), now(), '👑', 'Roi de la soirée', 'N°1 du classement lors d''une soirée', 'social'),
      ('badge-0000-0000-0000-000000000005', now(), now(), '💎', 'Légende FizzUp', '1000 verres au total', 'consumption'),
      ('badge-0000-0000-0000-000000000006', now(), now(), '🎯', 'Objectif atteint', '5 semaines d''objectif consécutives', 'streak');`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_badges" drop constraint "user_badges_badge_id_foreign";`);
    this.addSql(`alter table "group_members" drop constraint "group_members_group_id_foreign";`);
    this.addSql(`alter table "parties" drop constraint "parties_group_id_foreign";`);
    this.addSql(`alter table "party_members" drop constraint "party_members_party_id_foreign";`);

    this.addSql(`drop table if exists "user_profiles" cascade;`);
    this.addSql(`drop table if exists "user_badges" cascade;`);
    this.addSql(`drop table if exists "badges" cascade;`);
    this.addSql(`drop table if exists "party_members" cascade;`);
    this.addSql(`drop table if exists "parties" cascade;`);
    this.addSql(`drop table if exists "group_members" cascade;`);
    this.addSql(`drop table if exists "groups" cascade;`);
    this.addSql(`drop table if exists "friendships" cascade;`);
  }

}
