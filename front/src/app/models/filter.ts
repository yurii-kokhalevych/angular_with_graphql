import { SortDirection } from 'app/directives/sortable.directive';

export interface IFilters {
  searchTitle: string;
  searchDescription: string;
  searchCreator: string;
  searchCreatedAt: string;
  sortColumn: string;
  sortDirection: SortDirection;
}
