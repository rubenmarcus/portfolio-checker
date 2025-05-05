import { useState, useEffect } from 'react';
import { WalletBalance, PortfolioTotals, TokenData } from '@/types/types';
import { ChainData } from '@/types/types';

// Use this to cache tokens across navigation
const tokensCache = new Map<string, {
  tokens: WalletBalance[],
  totals: PortfolioTotals
}>();

export function useTokenData(
  chainId: string,
  address: string,
  chainData: ChainData[]
): TokenData {
  const [tokens, setTokens] = useState<WalletBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState<PortfolioTotals>({
    usdValue: 0,
    tokenCount: 0
  });

  useEffect(() => {
    async function fetchTokens() {
      if (!chainId || !address) {
        setIsLoading(false);
        return;
      }

      // Generate a cache key based on chain and address
      const cacheKey = `${chainId}:${address}`;

      // Check if we already have cached data
      if (tokensCache.has(cacheKey)) {
        const cachedData = tokensCache.get(cacheKey);
        if (cachedData) {
          setTokens(cachedData.tokens);
          setTotals(cachedData.totals);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      setError('');

      try {
        const chain = chainData.find(c => c.id === chainId);

        const response = await fetch(
          `/api/balance?address=${address}&chain=${chain?.ankrName || 'eth'}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch balances');
        }

        const responseData = await response.json();
        const tokensData = responseData.data || [];
        const totalsData = responseData.totals || { usdValue: 0, tokenCount: 0 };

        // Cache the results
        tokensCache.set(cacheKey, {
          tokens: tokensData,
          totals: totalsData
        });

        setTokens(tokensData);
        setTotals(totalsData);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching balances');
        setTokens([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokens();
  }, [chainId, address, chainData]);

  return {
    tokens,
    totals,
    isLoading,
    error
  };
}