import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Users } from './User.js';

@Entity()
export class Preferences {
  @PrimaryKey()
  userId!: number;

  @Property({ nullable: true })
  destination!: string;

  @Property({ nullable: true })
  rating!: number;

  @Property({ nullable: true })
  pricePerPerson!: number;

  @Property({ nullable: true })
  duration!: string;

  @Property({ nullable: true })
  startDate!: Date;

  @Property({ nullable: true })
  endDate!: Date;

  @Property({ nullable: true })
  provider!: string;

  @Property({ nullable: true })
  mealType!: string;
}
