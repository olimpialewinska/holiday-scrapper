import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Preferences } from './Preferences.js';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property()
  password!: string;
}
