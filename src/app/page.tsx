'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio } from '@/components/Portfolio';
import { useAddressValidator } from '@/hooks';
import { WalletBalance, PortfolioTotals } from '@/types/types';

// The home page needs different behavior since it doesn't have an address/chain in the URL yet
export default function Home() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [allTokens, setAllTokens] = useState<WalletBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState<PortfolioTotals>({
    usdValue: 0,
    tokenCount: 0
  });

  const { validate } = useAddressValidator();

  // Handle address submission
  const handleAddressChange = (newAddress: string) => {
    if (!newAddress) return;

    if (validate(newAddress)) {
      // Navigate to the chain/address route
      router.push(`/${selectedChain}/${newAddress}`);
    }
  };

  // Handle chain change
  const handleChainChange = (newChain: string) => {
    setSelectedChain(newChain);
    if (address && validate(address)) {
      router.push(`/${newChain}/${address}`);
    }
  };

  // Auto-submit with debounce when a valid address is entered
  useEffect(() => {
    if (address && validate(address)) {
      const timeoutId = setTimeout(() => {
        handleAddressChange(address);
      }, 500); // Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [address, selectedChain]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Portfolio
        address={address}
        chainId={selectedChain}
        tokens={allTokens}
        isLoading={isLoading}
        error={error}
        totals={totals}
        onAddressChange={handleAddressChange}
        onChainChange={handleChainChange}
      />
    </div>
  );
}
