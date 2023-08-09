import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Users {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property()
  email!: string;

  @Property()
  password!: string;
}
