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
