import { useState, useCallback, useRef, useEffect } from "react";
import { MangaPageConstructor } from "../types/manga.type";
import { Manga } from "../types/manga.type";

type UseSearchResult = {
  page: number;
  totalPages: number;
  isLoading: boolean;
  mangas: Manga[];
  search: (
    currentPage?: number,
    currentLimit?: number,
    currentQuery?: string,
  ) => Promise<void>;
  handleSearch: (searchQuery: string) => void;
  handlePageChange: (newPage: number) => void;
  clearSearch: () => void;
};

const DEFAULT_LIMIT = 20;

const useSearch = (service: MangaPageConstructor): UseSearchResult => {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const requestIdRef = useRef(0);
  const currentQueryRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const search = useCallback(
    async (
      currentPage: number = 1,
      currentLimit: number = DEFAULT_LIMIT,
      currentQuery: string = "",
    ) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const requestId = ++requestIdRef.current;
      setMangas([]);
      setIsLoading(true);
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      if (requestId !== requestIdRef.current) return;
      try {
        const { items, totalCount } = await service.search({
          query: currentQuery.trim(),
          limit: currentLimit,
          offset: (currentPage - 1) * currentLimit,
          signal,
        });

        if (requestId !== requestIdRef.current) return;

        if (currentPage === 1 && items.length !== currentLimit) {
          setLimit(items.length);
        }

        setMangas(items);
        setTotalCount(totalCount);
      } catch (error: any) {
        if (error?.name === "AbortError" || error?.code === "ERR_CANCELED")
          return;
        if (requestId !== requestIdRef.current) return;
        setMangas([]);
        setTotalCount(0);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [service],
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      currentQueryRef.current = searchQuery;
      setPage(1);
      setLimit(DEFAULT_LIMIT);
      search(1, DEFAULT_LIMIT, searchQuery);
    },
    [search],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      search(newPage, limit, currentQueryRef.current);
    },
    [limit, search],
  );

  const clearSearch = useCallback(() => {
    currentQueryRef.current = "";
    setPage(1);
    setLimit(DEFAULT_LIMIT);
    setTotalCount(0);
    setMangas([]);
    search(1, DEFAULT_LIMIT, "");
  }, [search]);

  return {
    page,
    totalPages,
    isLoading,
    mangas,
    search,
    handleSearch,
    handlePageChange,
    clearSearch,
  };
};

export default useSearch;
