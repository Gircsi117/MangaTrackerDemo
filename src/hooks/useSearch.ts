import { useState, useCallback, useRef, useEffect } from "react";
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

  const queryRef = useRef(query);
  const pageRef = useRef(page);
  const limitRef = useRef(limit);

  useEffect(() => { queryRef.current = query; }, [query]);
  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { limitRef.current = limit; }, [limit]);

  const totalPages = Math.ceil(totalCount / limitRef.current);

  const search = useCallback(async (
    currentPage: number = pageRef.current,
    currentLimit: number = limitRef.current,
    currentQuery: string = queryRef.current,
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
  }, []);

  const handleSearch = useCallback(() => {
    setPage(1);
    setLimit(DEFAULT_LIMIT);
    search(1, DEFAULT_LIMIT);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    search(newPage);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setPage(1);
    setLimit(DEFAULT_LIMIT);
    setTotalCount(0);
    setMangas([]);
    search(1, DEFAULT_LIMIT, "");
  }, []);

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