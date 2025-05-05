import type { PaginationMetadata } from '@/types/types';
import { useMemo, useState } from 'react';

interface PaginationOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  totalItems: number;
}

interface PaginationResult<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  paginatedItems: T[];
  paginationMetadata: PaginationMetadata;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export function usePagination<T>(
  items: T[],
  options: PaginationOptions
): PaginationResult<T> {
  const {
    defaultPage = 1,
    defaultPageSize = 10,
    totalItems: externalTotalCount,
  } = options;

  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Calculate total items - use provided count if available, otherwise use items length
  const totalItems = externalTotalCount || items.length;

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Calculate paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  // Create pagination metadata for components
  const paginationMetadata = useMemo(() => {
    return {
      total: totalItems,
      page: currentPage,
      limit: pageSize,
      pages: totalPages,
    };
  }, [totalItems, currentPage, pageSize, totalPages]);

  // Handle page change
  const setPage = (page: number) => {
    // Ensure the page is within valid range
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    paginatedItems,
    paginationMetadata,
    setPage,
    setPageSize,
  };
}
