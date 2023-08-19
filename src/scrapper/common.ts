export interface Scrapper {
  fetch: (maxPrice: number) => Promise<Item[]>;
}

export interface Item {
  offerLink: string;
  title: string;
  destination: string;
  rating: number;
  pricePerPerson: number;
  duration: string;
  startDate: Date;
  endDate: Date;
  provider: string;
  mealType: string;
  image: string;
  mealShort: string;
}

export function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
