import { EntitySchema } from '@mikro-orm/core';
import { Item } from '../scrapper/common.js';

export const Offer = new EntitySchema<Item>({
  name: 'Offer',
  properties: {
    offerLink: { type: 'string', nullable: false, unique: true, primary: true },
    title: { type: 'string', nullable: false },
    destination: { type: 'string', nullable: false },
    rating: { type: 'number', nullable: false },
    pricePerPerson: { type: 'number', nullable: false },
    duration: { type: 'string', nullable: false },
    startDate: { type: 'Date', nullable: false },
    endDate: { type: 'Date', nullable: false },
    provider: { type: 'string', nullable: false },
    mealType: { type: 'string', nullable: false },
    image: { type: 'string', nullable: false },
  },
});
