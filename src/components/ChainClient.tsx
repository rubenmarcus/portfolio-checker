'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { chains } from '@/data/chains';
import { topAccounts } from '@/data/topAccounts';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';

interface ChainClientProps {
  chainId: string;
}

export const ChainClient: React.FC<ChainClientProps> = ({ chainId }) => {
  const [selectedChain, setSelectedChain] = useState(chainId);

  // Update selectedChain when chainId prop changes
  useEffect(() => {
    setSelectedChain(chainId);
  }, [chainId]);

  // Check if the chain is supported
  const isChainSupported = chains.some((chain) => chain.id === chainId);

  if (!isChainSupported) {
    return (
      <div className="relative z-10 flex flex-col items-center p-4 sm:p-8 w-full h-full">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="w-full rounded-md border border-gray-700/30 backdrop-blur-lg bg-gray-800/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-red-500">Unsupported Chain</CardTitle>
              <CardDescription>
                The chain &quot;{chainId}&quot; is not supported. Please select
                one from the list above.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mt-4">
                {chains.map((chain) => (
                  <Link href={`/${chain.id}`} key={chain.id}>
                    <Button variant="blue" className="flex items-center gap-2">
                      <Image
                        src={chain.logo}
                        alt={chain.name}
                        className="w-5 h-5"
                        width="5"
                        height="5"
                      />
                      {chain.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col items-center  w-full h-full">
      <div className="w-full container mx-auto">
        <Card className="w-full mt-8 rounded-md border border-gray-700/30 backdrop-blur-lg bg-gray-800/20 shadow-xl">
          <CardHeader>
            <CardTitle>Popular Accounts</CardTitle>
            <CardDescription>
              Click on any of these accounts to view their balances on{' '}
              {chains.find((chain) => chain.id === selectedChain)?.name ||
                selectedChain}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topAccounts[selectedChain]?.map((account, index) => (
                <Link
                  href={`/${selectedChain}/${account.address}`}
                  key={account.address}
                >
                  <Button variant="blue" className="flex items-center gap-2">
                    {account.label}
                  </Button>
                </Link>
              )) || <p>No suggested accounts for this chain.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
