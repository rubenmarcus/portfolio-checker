import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChainSelector } from '@/components/ChainSelector';
import { AddressInput } from '@/components/AddressInput';
import { PortfolioTable } from '@/components/PortfolioTable';
import { truncateAddress } from '@/lib/utils';
import { PortfolioTotals, WalletBalance } from '@/types/types';
import { useAddressValidator, usePagination } from '@/hooks';

interface PortfolioProps {
  address: string;
  chainId: string;
  tokens: WalletBalance[];
  isLoading: boolean;
  error: string;
  totals: PortfolioTotals;
  onAddressChange: (address: string) => void;
  onChainChange: (chainId: string) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  pageSize?: number;
  totalTokenCount?: number;
}

export function Portfolio({
  address,
  chainId,
  tokens,
  isLoading,
  error,
  totals,
  onAddressChange,
  onChainChange,
  onPageChange,
  currentPage = 1,
  pageSize = 10,
  totalTokenCount
}: PortfolioProps) {
  const router = useRouter();
  const [inputAddress, setInputAddress] = useState(address);
  const [selectedChain, setSelectedChain] = useState(chainId);
  const { validate, error: validationError } = useAddressValidator();

  // Create pagination metadata manually instead of using usePagination hook
  // since we're now getting pre-paginated tokens from parent component
  const paginationMetadata = {
    total: totalTokenCount || tokens.length,
    page: currentPage,
    limit: pageSize,
    pages: Math.ceil((totalTokenCount || tokens.length) / pageSize)
  };

  // Handle address submission
  const handleAddressSubmit = () => {
    if (validate(inputAddress)) {
      onAddressChange(inputAddress);
    }
  };

  // Handle chain change
  const handleChainChange = (newChain: string) => {
    setSelectedChain(newChain);
    onChainChange(newChain);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Handle local pagination via URL if needed
      if (page === 1) {
        router.push(`/${chainId}/${address}`);
      } else {
        router.push(`/${chainId}/${address}/${page}`);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Checker</h1>
        <div className="flex items-center space-x-2">
          <ChainSelector
            selectedChain={selectedChain}
            onSelectChain={handleChainChange}
          />
        </div>
      </div>

      <div className="mb-8">
        <AddressInput
          address={inputAddress}
          onChange={setInputAddress}
          isLoading={isLoading}
          className="w-full"
          onSubmit={handleAddressSubmit}
          chainId={selectedChain}
        />
        {(error || validationError) && (
          <p className="text-red-500 mt-2 text-sm">{error || validationError}</p>
        )}
      </div>

      <PortfolioTable
        tokens={tokens}
        isLoading={isLoading}
        address={address}
        totalUsdValue={totals.usdValue}
        totalTokenCount={totalTokenCount}
        pagination={paginationMetadata}
        onPageChange={handlePageChange}
      />

      {address && !isLoading && tokens.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-right">
          Viewing balances for {truncateAddress(address)}
        </div>
      )}
    </div>
  );
}