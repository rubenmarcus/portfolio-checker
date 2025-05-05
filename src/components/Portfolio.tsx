import { PortfolioTable } from '@/components/PortfolioTable';
import { truncateAddress } from '@/lib/utils';
import type { PortfolioTotals, WalletBalance } from '@/types/types';
import { useState } from 'react';

interface PortfolioProps {
  address: string;
  chainId?: string;
  tokens?: WalletBalance[];
  isLoading?: boolean;
  error?: string;
  totals?: PortfolioTotals;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  pageSize?: number;
  totalTokenCount?: number;
}

export function Portfolio({
  address,
  tokens = [],
  isLoading = false,
  error: externalError = '',
  totals = { usdValue: 0, tokenCount: 0 },
  onPageChange,
  currentPage = 1,
  pageSize = 10,
  totalTokenCount,
}: PortfolioProps) {
  const [copied, setCopied] = useState(false);

  // Create pagination metadata manually
  const paginationMetadata = {
    total: totalTokenCount || tokens.length,
    page: currentPage,
    limit: pageSize,
    pages: Math.ceil((totalTokenCount || tokens.length) / pageSize),
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {externalError && (
        <p className="text-red-500 mt-2 text-sm">{externalError}</p>
      )}
      {address && !isLoading && tokens.length > 0 && (
        <h1 className="mt-4 text-sm md:text-3xl pb-8 text-muted-foreground text-left flex items-center gap-2">
          {address.endsWith('.eth') ? address : truncateAddress(address, 10)}
          <button
            type="button"
            onClick={handleCopyAddress}
            className="inline-flex items-center justify-center cursor-pointer"
            aria-label="Copy address"
          >
            <img
              src={copied ? '/copied.svg' : '/copy.svg'}
              alt={copied ? 'Copied address' : 'Copy address'}
              width={18}
              height={18}
            />
          </button>
        </h1>
      )}

      <PortfolioTable
        tokens={tokens}
        isLoading={isLoading}
        address={address}
        totalUsdValue={totals.usdValue}
        totalTokenCount={totalTokenCount}
        pagination={paginationMetadata}
        onPageChange={onPageChange}
      />
    </div>
  );
}
