'use client';

import { useState, useCallback, useEffect } from 'react';
import { AddressInput } from "./AddressInput"
import { ChainSelector } from "./ChainSelector"
import { useAddressValidator } from '@/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const { validate } = useAddressValidator();
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('ethereum');
  const pathname = usePathname();

  useEffect(() => {
    // Extract chain ID from pathname if present
    if (pathname) {
      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const pathChain = pathSegments[0];
        if (pathChain && pathChain !== chainId) {
          setChainId(pathChain);
        }
      }
    }
  }, [pathname, chainId]);

  const handleAddressChange = useCallback((newAddress: string) => {
    setAddress(newAddress);
  }, []);

  const handleChainChange = useCallback((newChain: string) => {
    setChainId(newChain);
  }, []);

  return (
    <header className="w-full">
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-8">
      <h1 className="text-3xl font-bold"><Link href="/">Portfolio Checker</Link></h1>
      <div className="flex items-center space-x-2">
        <ChainSelector
          selectedChain={chainId}
          onSelectChain={handleChainChange}
        />
      </div>

    </div>
    <div className="w-full">
    <AddressInput
        address={address}
        onChange={handleAddressChange}
        className="w-full"
        chainId={chainId}
        validate={validate}
      />
    </div>
    </header>
  )
}