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
import { WalletBalance, PaginationMetadata } from '@/types/types';
import Image from 'next/image';

interface PortfolioTableProps {
  tokens: WalletBalance[];
  isLoading: boolean;
  address: string;
  pagination?: PaginationMetadata;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  totalUsdValue?: number;
  totalTokenCount?: number;
  defaultPageSize?: number;
}

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);

  const totalUsdValue = useMemo(() => {
    if (providedTotalUsdValue !== undefined) {
      return providedTotalUsdValue;
    }
    return tokens.reduce((sum, token) => sum + (token.usdValue || 0), 0);
  }, [tokens, providedTotalUsdValue]);

  const displayedTokenCount = useMemo(() => {
    return totalTokenCount !== undefined ? totalTokenCount : tokens.length;
  }, [tokens.length, totalTokenCount]);

  const paginatedTokens = useMemo(() => {
    if (pagination && onPageChange) {
      return tokens;
    }

    const startIndex = (currentPage - 1) * pageSize;
    return tokens.slice(startIndex, startIndex + pageSize);
  }, [tokens, currentPage, pageSize, pagination, onPageChange]);

  const totalPages = useMemo(() => {
    return Math.ceil(tokens.length / pageSize);
  }, [tokens.length, pageSize]);

  const localPagination = useMemo(() => {
    return {
      total: tokens.length,
      page: currentPage,
      limit: pageSize,
      pages: totalPages
    };
  }, [tokens.length, currentPage, pageSize, totalPages]);

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

  if (!address) {
    return (
      <div className="rounded-xl border  border-gray-700/30 w-full mt-4 backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 shadow-xl">
        <div className="p-8 text-center text-muted-foreground">
          Enter an address to view portfolio
        </div>
      </div>
    );
  }

  if (tokens.length === 0 && !isLoading) {
    return (
      <div className="rounded-xl border  border-gray-700/30 w-full mt-4 backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 shadow-xl">
        <div className="p-8 text-center text-muted-foreground">
          No tokens found for {truncateAddress(address)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-gray-700/30 w-full p-6 backdrop-blur-lg bg-gray-800/20 shadow-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-muted-foreground font-medium">Total Balance</h3>
            {isLoading || totalUsdValue === 0 ? (
              <Skeleton className="h-9 w-32 mt-1" />
            ) : (
              <p className="text-3xl font-bold">${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-sm text-muted-foreground font-medium">Total Tokens</h3>
            {isLoading || displayedTokenCount === 0 ? (
              <Skeleton className="h-9 w-16 mt-1 ml-auto" />
            ) : (
              <p className="text-3xl font-bold">{displayedTokenCount}</p>
            )}
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
              // Dynamic skeleton loading based on token count or a reasonable default
              Array(tokens.length || 5).fill(0).map((_, index) => (
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
                      <Image
                        src={token.token.logoURI}
                        alt={token.token.symbol}
                        className="h-6 w-6 rounded-full shadow-sm"
                        width="20"
                        height="20"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/20x20?text=🪙';
                        }}
                        unoptimized
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
                        ${token.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

      {/* Pagination */}
      {isLoading ? (
        <div className="flex justify-center mt-4 space-x-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      ) : (pagination && onPageChange) ? (
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