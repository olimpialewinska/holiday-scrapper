export interface Scrapper {
  fetch: () => Promise<Item[]>;
}

export interface Item {
  [x: string]: any;
  offerLink: string;
  title: string;
  destination: string;
  rating: string;
  pricePerPerson: string;
  duration: string;
  provider: string;
}
