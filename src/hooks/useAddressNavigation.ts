import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAddressValidator } from '@/hooks';

interface UseAddressNavigationOptions {
  initialAddress?: string;
  initialChain?: string;
  debounceMs?: number;
  validateBeforeNavigation?: boolean;
}

export function useAddressNavigation({
  initialAddress = '',
  initialChain = 'ethereum',
  debounceMs = 500,
  validateBeforeNavigation = true,
}: UseAddressNavigationOptions = {}) {
  const router = useRouter();
  const [address, setAddress] = useState(initialAddress);
  const [selectedChain, setSelectedChain] = useState(initialChain);
  const { validate } = useAddressValidator();

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    if (!newAddress) return;

    if (!validateBeforeNavigation || validate(newAddress)) {
      router.push(`/${selectedChain}/${newAddress}`);
    }
  };

  const handleChainChange = (newChain: string) => {
    setSelectedChain(newChain);

    if (address) {
      if (!validateBeforeNavigation || validate(address)) {
        router.push(`/${newChain}/${address}`);
      } else {
        router.push(`/${newChain}`);
      }
    } else {
      router.push(`/${newChain}`);
    }
  };

  // Auto-submit with debounce when a valid address is entered
  useEffect(() => {
    if (address && validate(address)) {
      const timeoutId = setTimeout(() => {
        router.push(`/${selectedChain}/${address}`);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    }
  }, [address, selectedChain, router, validate, debounceMs]);

  return {
    address,
    selectedChain,
    setAddress,
    setSelectedChain,
    handleAddressChange,
    handleChainChange,
  };
}