export interface ISearchQuery {
  destination: string | null;
  maxPrice: number | null;
  stars: number | null;
  startDate: Date | null;
  endDate: Date | null;
  nutrition: string | null;
  sort: 'asc' | 'desc' | 'stars';
}
