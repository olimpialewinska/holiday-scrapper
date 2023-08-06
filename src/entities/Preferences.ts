import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './User.js';

@Entity()
export class Preferences {
  @PrimaryKey()
  userId!: number;

  @Property()
  destination!: string;

  @Property()
  rating!: number;

  @Property()
  pricePerPerson!: number;

  @Property()
  duration!: string;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;

  @Property()
  provider!: string;

  @Property()
  mealType!: string;

  @OneToOne(() => User)
  user: User;
}
