import { useState, useCallback, useRef } from "react";
import { MangaPageConstructor } from "../types/manga.type";
import { Manga } from "../types/manga.type";

type UseSearchResult = {
  query: string;
  setQuery: (q: string) => void;
  page: number;
  totalPages: number;
  mangas: Manga[];
  search: (
    currentPage?: number,
    currentLimit?: number,
    currentQuery?: string,
  ) => Promise<void>;
  handleSearch: () => void;
  handlePageChange: (newPage: number) => void;
  clearSearch: () => void;
};

const DEFAULT_LIMIT = 20;

const useSearch = (service: MangaPageConstructor): UseSearchResult => {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [mangas, setMangas] = useState<Manga[]>([]);

  const totalPages = Math.ceil(totalCount / limit);

  const search = useCallback(
    async (
      currentPage: number = page,
      currentLimit: number = limit,
      currentQuery: string = query,
    ) => {
      const { items, totalCount } = await service.search({
        query: currentQuery.trim(),
        limit: currentLimit,
        offset: (currentPage - 1) * currentLimit,
      });

      if (currentPage === 1 && items.length !== currentLimit) {
        setLimit(items.length);
      }

      setMangas(items);
      setTotalCount(totalCount);
    },
    [query, page, limit, service],
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setPage(1);
    setLimit(DEFAULT_LIMIT);
    setTotalCount(0);
    setMangas([]);
    search(1, DEFAULT_LIMIT, "");
  }, [search]);

  const handleSearch = useCallback(() => {
    setLimit(DEFAULT_LIMIT);
    setPage(1);
    search(1, DEFAULT_LIMIT);
  }, [search]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      search(newPage);
    },
    [search],
  );

  return {
    query,
    setQuery,
    page,
    totalPages,
    mangas,
    search,
    handleSearch,
    handlePageChange,
    clearSearch,
  };
};

export default useSearch;
