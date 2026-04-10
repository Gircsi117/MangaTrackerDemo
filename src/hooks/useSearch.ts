import { useState, useCallback } from "react";
import { MangaPageConstructor } from "../types/manga.type";
import { Manga, ListParams } from "../types/manga.type";

type UseSearchResult = {
  query: string;
  setQuery: (q: string) => void;
  page: number;
  totalPages: number;
  mangas: Manga[];
  search: (currentPage?: number) => Promise<void>;
  handleSearch: () => void;
  handlePageChange: (newPage: number) => void;
};

const useSearch = (service: MangaPageConstructor): UseSearchResult => {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [mangas, setMangas] = useState<Manga[]>([]);

  const totalPages = Math.ceil(totalCount / limit);

  const search = useCallback(
    async (currentPage: number = page, currentLimit: number = limit) => {
      const { items, totalCount } = await service.search({
        query: query.trim(),
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

  const handleSearch = useCallback(() => {
    setPage(1);
    search(1);
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
  };
};

export default useSearch;
