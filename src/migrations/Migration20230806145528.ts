import { Migration } from '@mikro-orm/migrations';

export class Migration20230806145528 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "offer" ("offer_link" varchar(255) not null, "title" varchar(255) not null, "destination" varchar(255) not null, "rating" int not null, "price_per_person" int not null, "duration" varchar(255) not null, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) not null, "provider" varchar(255) not null, "meal_type" varchar(255) not null, "image" varchar(255) not null, constraint "offer_pkey" primary key ("offer_link"));');

    this.addSql('create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null);');

    this.addSql('create table "preferences" ("user_id" int not null, "destination" varchar(255) not null, "rating" int not null, "price_per_person" int not null, "duration" varchar(255) not null, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) not null, "provider" varchar(255) not null, "meal_type" varchar(255) not null, constraint "preferences_pkey" primary key ("user_id"));');
    this.addSql('alter table "preferences" add constraint "preferences_user_id_unique" unique ("user_id");');

    this.addSql('alter table "preferences" add constraint "preferences_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "preferences" drop constraint "preferences_user_id_foreign";');

    this.addSql('drop table if exists "offer" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "preferences" cascade;');
  }

}
