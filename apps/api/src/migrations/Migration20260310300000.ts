import { Migration } from '@mikro-orm/migrations';

export class Migration20260310300000 extends Migration {
  override async up(): Promise<void> {
    // Add type and data columns to notifications
    this.addSql(`alter table "notifications" add column if not exists "type" varchar(50) not null default 'system_info';`);
    this.addSql(`alter table "notifications" add column if not exists "data" text null;`);

    // Update logs category check constraint to include 'social'
    this.addSql(`alter table "logs" drop constraint if exists "logs_category_check";`);
    this.addSql(`alter table "logs" add constraint "logs_category_check" check ("category" in ('auth', 'user', 'device', 'system', 'payment', 'security', 'social'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "notifications" drop column if exists "type";`);
    this.addSql(`alter table "notifications" drop column if exists "data";`);
    this.addSql(`alter table "logs" drop constraint if exists "logs_category_check";`);
    this.addSql(`alter table "logs" add constraint "logs_category_check" check ("category" in ('auth', 'user', 'device', 'system', 'payment', 'security'));`);
  }
}
