export type List<T = any> = {
  items: T[];
  totalCount: number;
};

export type ListParams = {
  limit?: number;
  offset?: number;
  order?: "asc" | "desc";
  query?: string;
  signal?: AbortSignal;
};
