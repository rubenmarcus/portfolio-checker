'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chains } from '@/data/chains';
import { Portfolio } from '@/components/Portfolio';
import { useAddressValidator } from '@/hooks';
import { WalletBalance, PortfolioTotals } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Top accounts per chain for suggestions
const topAccounts: Record<string, { address: string; label: string }[]> = {
  ethereum: [
    { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', label: 'Vitalik Buterin' },
    { address: '0x9e0905349e23F4eBaf18a01057AB4F15457764A9', label: 'Justin Sun' },
    { address: '0xF977814e90dA44bFA03b6295A0616a897441aceC', label: 'Binance' }
  ],
  polygon: [
    { address: '0x05f20a52BC462f4FBfe33B74a9b1664A83fF5249', label: 'Polygon Foundation' },
    { address: '0xd3079089D14ebC168BeAb814A024B42ffEd35aA9', label: 'Polygon Ecosystem Vault' },
    { address: '0x06959153B974D0D5fDfd87D561db6d8d4FA0bb1B', label: 'Polygon Grants' }
  ],
  bsc: [
    { address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3', label: 'Binance Hot Wallet' },
    { address: '0x3C783c21a0383057D128bae431894a5C0f7697A7', label: 'PancakeSwap' },
    { address: '0x9f8cCdaFCc39F3c7D6EBf637c9151673CBc36b88', label: 'BNB Chain Ecosystem' }
  ],
  arbitrum: [
    { address: '0xF977814e90dA44bFA03b6295A0616a897441aceC', label: 'Arbitrum Foundation' },
    { address: '0x0dF5dfd95966753f01BE0d09Ae3F29e5bA33fFE3', label: 'GMX Whale' },
    { address: '0x489ee077994B6658eAfA855C308275EAd8097C4A', label: 'Arbitrum Treasury' }
  ],
  avalanche: [
    { address: '0x8EB8a3b98659Cce290402893d0123abb75E3ab28', label: 'Avalanche Foundation' },
    { address: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf', label: 'Avalabs' },
    { address: '0x9fA5de19f1E1C4840d3dC6ec37fEbFfB5e859c5B', label: 'Trader Joe' }
  ],
  optimism: [
    { address: '0xf1088c2F1469525011682c9fEeF05aF39733a2a9', label: 'Optimism Foundation' },
    { address: '0x2431CBdc0F4Dc2de9E3BC9131ddA98E96D35C880', label: 'OP Grants' },
    { address: '0xbf5C5E3Ee435429b850C4AEE7af1F1654C10AC87', label: 'Optimism Ecosystem Fund' }
  ]
};

interface ChainClientProps {
  chainId: string;
}

export const ChainClient: React.FC<ChainClientProps> = ({ chainId }) => {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState(chainId);
  const [allTokens, setAllTokens] = useState<WalletBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState<PortfolioTotals>({
    usdValue: 0,
    tokenCount: 0
  });

  const { validate } = useAddressValidator();

  // Check if the chain is supported
  const isChainSupported = chains.some(chain => chain.id === chainId);

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
    router.push(`/${newChain}`);
  };

  // Handle selecting a suggested account
  const handleSelectAccount = (address: string) => {
    router.push(`/${selectedChain}/${address}`);
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

  // Update selected chain if route changes
  useEffect(() => {
    setSelectedChain(chainId);
  }, [chainId]);

  if (!isChainSupported) {
    return (
      <div className="relative z-10 flex flex-col items-center p-4 sm:p-8 w-full h-full">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="w-full rounded-md border border-gray-700/30 backdrop-blur-lg bg-gray-800/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-red-500">Unsupported Chain</CardTitle>
              <CardDescription>
                The chain &quot;{chainId}&quot; is not supported. Please select one from the list above.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mt-4">
                {chains.map(chain => (
                  <Button
                    key={chain.id}
                    variant="blue"
                    onClick={() => router.push(`/${chain.id}`)}
                    className="flex items-center gap-2"
                  >
                    <img src={chain.logo} alt={chain.name} className="w-5 h-5" />
                    {chain.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col items-center p-4 sm:p-8 w-full h-full">
      <div className="w-full container mx-auto">
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

        <Card className="w-full mt-8 rounded-md border border-gray-700/30 backdrop-blur-lg bg-gray-800/20 shadow-xl">
          <CardHeader>
            <CardTitle>Popular Accounts</CardTitle>
            <CardDescription>
              Click on any of these accounts to view their balances on {chains.find(chain => chain.id === selectedChain)?.name || selectedChain}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topAccounts[selectedChain]?.map((account, index) => (
                <Button
                  key={index}
                  variant="blue"
                  onClick={() => handleSelectAccount(account.address)}
                  className="flex items-center gap-2"
                >
                  {account.label}
                </Button>
              )) || <p>No suggested accounts for this chain.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};