import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCryptoBalance, truncateAddress } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

import { ChevronDown, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';

interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  type?: string; // Added for filtering
  lastUpdated?: string; // Added for the new column
  price?: {
    USD: number;
  };
}

interface Token {
  token: TokenInfo;
  balance: string;
  formattedBalance: string;
  usdValue: number;
  lastUpdated?: string; // Added for sorting/display
}

interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface PortfolioTableProps {
  tokens: Token[];
  isLoading: boolean;
  address: string;
  pagination?: PaginationMetadata; // Now optional as we can handle pagination internally
  onPageChange?: (page: number) => void; // Optional for backward compatibility
  onLimitChange?: (limit: number) => void; // Optional for backward compatibility
  totalUsdValue?: number; // Total USD value across all tokens
  totalTokenCount?: number; // Total token count across all pages
  defaultPageSize?: number; // New prop for default page size
}

type SortField = 'name' | 'balance' | 'value' | 'lastUpdated';
type SortDirection = 'asc' | 'desc';

export function PortfolioTable({
  tokens,
  isLoading,
  address,
  pagination,
  onPageChange,
  onLimitChange,
  totalUsdValue: providedTotalUsdValue,
  totalTokenCount,
  defaultPageSize = 10
}: PortfolioTableProps) {
  // State for sorting and filtering
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [tokenTypeFilter, setTokenTypeFilter] = useState<string>('all');

  // Local pagination state (used if backend pagination is not provided)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);

  // Get token types for filter dropdown
  const tokenTypes = useMemo(() => {
    const types = new Set<string>();
    tokens.forEach(token => {
      if (token.token.type) {
        types.add(token.token.type);
      }
    });
    return Array.from(types);
  }, [tokens]);

  // Calculate total balance - use provided total if available, otherwise calculate from current page
  const totalUsdValue = useMemo(() => {
    if (providedTotalUsdValue !== undefined) {
      return providedTotalUsdValue;
    }
    return tokens.reduce((sum, token) => sum + (token.usdValue || 0), 0);
  }, [tokens, providedTotalUsdValue]);

  // Get total token count - use provided count if available, otherwise use current page length
  const displayedTokenCount = useMemo(() => {
    return totalTokenCount !== undefined ? totalTokenCount : tokens.length;
  }, [tokens.length, totalTokenCount]);

  // Apply filters and sorting
  const filteredAndSortedTokens = useMemo(() => {
    let result = [...tokens];

    // Apply type filter
    if (tokenTypeFilter !== 'all') {
      result = result.filter(token => token.token.type === tokenTypeFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareA, compareB;

      switch (sortField) {
        case 'name':
          compareA = a.token.name || '';
          compareB = b.token.name || '';
          break;
        case 'balance':
          compareA = parseFloat(a.formattedBalance) || 0;
          compareB = parseFloat(b.formattedBalance) || 0;
          break;
        case 'value':
          compareA = a.usdValue || 0;
          compareB = b.usdValue || 0;
          break;
        case 'lastUpdated':
          compareA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          compareB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    return result;
  }, [tokens, tokenTypeFilter, sortField, sortDirection]);

  // Local pagination logic - used if backend pagination is not provided
  const paginatedTokens = useMemo(() => {
    // If backend pagination is being used, return all filtered/sorted tokens
    if (pagination && onPageChange) {
      return filteredAndSortedTokens;
    }

    // Otherwise, handle pagination locally
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedTokens.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedTokens, currentPage, pageSize, pagination, onPageChange]);

  // Calculate total pages for local pagination
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedTokens.length / pageSize);
  }, [filteredAndSortedTokens.length, pageSize]);

  // Local pagination metadata
  const localPagination = useMemo(() => {
    return {
      total: filteredAndSortedTokens.length,
      page: currentPage,
      limit: pageSize,
      pages: totalPages
    };
  }, [filteredAndSortedTokens.length, currentPage, pageSize, totalPages]);

  // Handle page change - either call onPageChange (backend) or update local state
  const handlePageChange = (page: number) => {
    if (pagination && onPageChange) {
      onPageChange(page);
    } else {
      setCurrentPage(page);
    }
  };

  // Handle limit change - either call onLimitChange (backend) or update local state
  const handleLimitChange = (limit: number) => {
    if (pagination && onLimitChange) {
      onLimitChange(limit);
    } else {
      setPageSize(limit);
      setCurrentPage(1); // Reset to first page when changing page size
    }
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }

    // If using local pagination, reset to first page when sorting changes
    if (!pagination || !onPageChange) {
      setCurrentPage(1);
    }
  };

  if (!address) {
    return (
      <div className="rounded-xl border w-full mt-4 backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 shadow-xl">
        <div className="p-8 text-center text-muted-foreground">
          Enter an address to view portfolio
        </div>
      </div>
    );
  }

  if (tokens.length === 0 && !isLoading) {
    return (
      <div className="rounded-xl border w-full mt-4 backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 shadow-xl">
        <div className="p-8 text-center text-muted-foreground">
          No tokens found for {truncateAddress(address)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* User Summary Section - Always visible */}
      <div className="rounded-md border border-gray-700/30 w-full p-6 backdrop-blur-lg bg-gray-800/20 shadow-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-muted-foreground font-medium">Total Balance</h3>
            <p className="text-3xl font-bold">${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm text-muted-foreground font-medium">Total Tokens</h3>
            <p className="text-3xl font-bold">{displayedTokenCount}</p>
          </div>
        </div>
      </div>

      {/* Filters & Sorting Controls - Always visible */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="relative rounded-lg border bg-white/10 dark:bg-gray-800/20 shadow-md backdrop-blur-md">
          <select
            value={tokenTypeFilter}
            onChange={(e) => {
              setTokenTypeFilter(e.target.value);
              // Reset to first page when filter changes (for local pagination)
              if (!pagination || !onPageChange) {
                setCurrentPage(1);
              }
            }}
            className="appearance-none bg-transparent py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="all">All Token Types</option>
            {tokenTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex rounded-lg overflow-hidden border bg-white/10 dark:bg-gray-800/20 shadow-md backdrop-blur-md">
            {(['name', 'balance', 'value', 'lastUpdated'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-3 py-1.5 text-sm transition-all ${sortField === field
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'hover:bg-white/10 dark:hover:bg-gray-700/30'}`}
              >
                <span className="capitalize">{field === 'lastUpdated' ? 'Date' : field}</span>
                {sortField === field && (
                  <span className="ml-1 inline-flex">
                    {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Token Table Component */}
      <div className="rounded-md border border-gray-700/30 w-full backdrop-blur-lg bg-gray-800/20 shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200/20 dark:border-gray-700/30">
              <TableHead>Token</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Value (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loading rows for table content only
              Array(10).fill(0).map((_, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50/5 dark:bg-gray-800/30" : "bg-white/5 dark:bg-gray-900/20"}>
                  <TableCell className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              // Actual token data - using paginatedTokens instead of filteredAndSortedTokens
              paginatedTokens.map((token, index) => (
                <TableRow
                  key={token.token.address || index}
                  className={`
                    ${index % 2 === 0 ? "bg-gray-50/5 dark:bg-gray-800/30" : "bg-white/5 dark:bg-gray-900/20"}
                    transition-colors hover:bg-white/10 dark:hover:bg-gray-800/40
                  `}
                >
                  <TableCell className="flex items-center gap-2">
                    {token.token.logoURI ? (
                      <img
                        src={token.token.logoURI}
                        alt={token.token.symbol}
                        className="h-6 w-6 rounded-full shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/20x20?text=🪙';
                        }}
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center text-xs shadow-sm">
                        {token.token.symbol?.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium">{token.token.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm bg-gray-100/10 dark:bg-gray-800/30 px-2 py-0.5 rounded">
                      {token.token.symbol}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatCryptoBalance(token.formattedBalance)}
                  </TableCell>
                  <TableCell className="text-right">
                    {token.usdValue ? (
                      <span className="font-medium text-emerald-500 dark:text-emerald-400">
                        ${token.usdValue.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Always visible when applicable */}
      {/* Use either the provided pagination or local pagination */}
      {(pagination && onPageChange) ? (
        <div className="flex justify-center mt-4">
          <Pagination
            total={pagination.total}
            page={pagination.page}
            limit={pagination.limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <Pagination
            total={localPagination.total}
            page={localPagination.page}
            limit={localPagination.limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      )}
    </div>
  );
}