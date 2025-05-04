'use client';

import { useState, useEffect } from 'react';
import { ChainSelector, chains } from '@/components/ChainSelector';
import { AddressInput } from '@/components/AddressInput';
import { PortfolioTable } from '@/components/PortfolioTable';
import { truncateAddress } from '@/lib/utils';

// Define token type
interface Token {
  token: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
    chainId: number;
    price?: {
      USD: number;
    };
  };
  balance: string;
  formattedBalance: string;
  usdValue: number;
}

export default function Home() {
  const [address, setAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [displayedTokens, setDisplayedTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [totals, setTotals] = useState({
    usdValue: 0,
    tokenCount: 0
  });

  const fetchBalances = async () => {
    if (!address) return;

    setIsLoading(true);
    setError('');

    try {
      const chain = chains.find(c => c.id === selectedChain);
      // Fetch all data at once with a large limit
      const response = await fetch(`/api/balance?address=${address}&chain=${chain?.ankrName || 'eth'}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch balances');
      }

      const responseData = await response.json();

      // Store all tokens in state
      setAllTokens(responseData.data || []);

      // Set initial displayed tokens based on current pagination
      updateDisplayedTokens(responseData.data || [], pagination.page, pagination.limit);

      if (responseData.totals) {
        setTotals(responseData.totals);
      }
    } catch (error: unknown) {
      console.error('Error fetching balances:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching balances');
      setAllTokens([]);
      setDisplayedTokens([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update displayed tokens based on pagination
  const updateDisplayedTokens = (tokens: Token[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const paginatedTokens = tokens.slice(startIndex, startIndex + limit);
    setDisplayedTokens(paginatedTokens);

    setPagination({
      total: tokens.length,
      page: page,
      limit: limit,
      pages: Math.ceil(tokens.length / limit)
    });
  };

  useEffect(() => {
    if (address && (address.startsWith('0x') && address.length === 42) || address.endsWith('.eth')) {
      const timeoutId = setTimeout(() => {
        fetchBalances(); // Fetch all tokens when address or chain changes
      }, 500); // Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [address, selectedChain]);

  const handlePageChange = (page: number) => {
    // Update pagination client-side
    updateDisplayedTokens(allTokens, page, pagination.limit);
  };

  const handleLimitChange = (limit: number) => {
    // Update pagination client-side
    updateDisplayedTokens(allTokens, 1, limit); // Reset to page 1 when limit changes
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="max-w-3xl w-full">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-8">
          <h1 className="text-3xl font-bold">OneBalance</h1>
          <div className="flex items-center space-x-2">
            <ChainSelector
              selectedChain={selectedChain}
              onSelectChain={setSelectedChain}
            />
          </div>
        </div>

        <div className="mb-8">
          <AddressInput
            address={address}
            onChange={setAddress}
            isLoading={isLoading}
            className="w-full"
          />
          {error && (
            <p className="text-red-500 mt-2 text-sm">{error}</p>
          )}
        </div>

        <PortfolioTable
          tokens={displayedTokens}
          isLoading={isLoading}
          address={address}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          totalUsdValue={totals.usdValue}
          totalTokenCount={totals.tokenCount}
        />

        {address && !isLoading && displayedTokens.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-right">
            Viewing balances for {truncateAddress(address)}
          </div>
        )}
      </div>
    </main>
  );
}
