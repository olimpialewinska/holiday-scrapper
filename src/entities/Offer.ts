import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Offer {
  @PrimaryKey()
  offerLink!: string;

  @Property()
  title!: string;

  @Property()
  destination!: string;

  @Property()
  rating: number;

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

  @Property()
  image!: string;
}
