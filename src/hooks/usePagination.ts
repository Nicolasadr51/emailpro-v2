import { useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export interface UsePaginationReturn {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleFirstPage: () => void;
  handleLastPage: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  getPageNumbers: () => number[];
}

export const usePagination = (
  totalPages: number,
  options: UsePaginationOptions = {}
): UsePaginationReturn => {
  const { initialPage = 1, initialLimit = 10 } = options;
  
  const [page, setPageState] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);

  const setPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageState(newPage);
    }
  }, [totalPages]);

  const setLimit = useCallback((newLimit: number) => {
    if (newLimit > 0) {
      setLimitState(newLimit);
      // Reset to first page when changing limit
      setPageState(1);
    }
  }, []);

  const handlePreviousPage = useCallback(() => {
    setPage(Math.max(page - 1, 1));
  }, [page, setPage]);

  const handleNextPage = useCallback(() => {
    setPage(Math.min(page + 1, totalPages));
  }, [page, totalPages, setPage]);

  const handleFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const handleLastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages, setPage]);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const getPageNumbers = useCallback((): number[] => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, -1); // -1 represents dots
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages); // -1 represents dots
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [page, totalPages]);

  return {
    page,
    limit,
    setPage,
    setLimit,
    handlePreviousPage,
    handleNextPage,
    handleFirstPage,
    handleLastPage,
    canGoPrevious,
    canGoNext,
    getPageNumbers
  };
};
