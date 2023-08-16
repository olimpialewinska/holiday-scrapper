import { Entity, PrimaryKey, Property, t } from '@mikro-orm/core';

@Entity()
export class Offer {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ nullable: false, length: 10000 })
  offerLink!: string;

  @Property({ length: 5000 })
  title!: string;

  @Property({ length: 5000 })
  destination!: string;

  @Property({ nullable: true })
  rating!: number;

  @Property()
  pricePerPerson!: number;

  @Property()
  duration!: string;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;

  @Property({ length: 5000 })
  provider!: string;

  @Property({ length: 5000 })
  mealType!: string | '';

  @Property()
  image!: string | '';
}
