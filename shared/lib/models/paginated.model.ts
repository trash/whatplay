export interface PaginatedResponse<T> {
    results: T[];
    totalCount: number;
    maxPage: number;
}
