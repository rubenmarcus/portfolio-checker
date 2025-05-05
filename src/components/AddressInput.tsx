import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWalletHistory } from '@/context/WalletHistoryContext';
import { CHAIN_SYMBOLS } from '@/data/balance/providers';
import { chains } from '@/data/chains';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

interface AddressInputProps {
  address: string;
  onChange: (address: string) => void;
  className?: string;
  placeholder?: string;
  chainId?: string;
  validate: (address: string) => boolean;
  error?: string;
}

export function AddressInput({
  address,
  onChange,
  className = '',
  placeholder,
  chainId = 'ethereum',
  validate,
  error,
}: AddressInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { addToHistory } = useWalletHistory();
  const [isFocused, setIsFocused] = useState(false);
  const [currentChainSymbol, setCurrentChainSymbol] = useState(
    CHAIN_SYMBOLS[chainId] || 'ETH'
  );
  const [isAddressValid, setIsAddressValid] = useState(false);

  const isChainPage = pathname === `/${chainId}`;

  const isRootPage = pathname === '/';

  // Get the current chain name
  const chainName =
    chains.find((chain) => chain.id === chainId)?.name || chainId;

  // Update chain symbol when chainId changes
  useEffect(() => {
    const symbol = CHAIN_SYMBOLS[chainId] || 'ETH';
    setCurrentChainSymbol(symbol);
  }, [chainId]);

  // Clear address on route change
  useEffect(() => {
    onChange('');
  }, [onChange]);

  // Validate address when it changes
  useEffect(() => {
    if (address) {
      setIsAddressValid(validate(address));
    } else {
      setIsAddressValid(false);
    }
  }, [address, validate]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleSubmit = useCallback(() => {
    if (validate(address)) {
      // Add to search history
      addToHistory(chainId, address);

      // Navigate to the address page
      router.push(`/${chainId}/${address}`);
      onChange(''); // Clear address after submission
    }
  }, [address, chainId, router, validate, onChange, addToHistory]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const defaultPlaceholder = `Enter ${currentChainSymbol} address (0x...) or ENS domain`;

  return (
    <div
      className={isRootPage ? 'w-full flex flex-col items-center pb-10' : ''}
    >
      {isChainPage && (
        <p className="mb-2 text-sx text-muted-foreground">
          Please enter an address to view their balances on {chainName}
        </p>
      )}
      <div
        className={`flex items-center gap-2 ${isRootPage ? 'justify-center' : ''} ${className}`}
      >
        <div
          className={`flex-grow ${isRootPage ? 'max-w-md' : 'max-w-xs'} relative`}
        >
          <Input
            value={address}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || defaultPlaceholder}
            className={`border border-gray-700/30 bg-gray-800/20 backdrop-blur-lg shadow-xl outline-none focus:outline-none focus:ring-0 ${
              isAddressValid
                ? 'border-green-400'
                : isFocused
                  ? 'border-blue-400'
                  : address && !isAddressValid
                    ? 'border-red-400'
                    : ''
            }`}
          />
          {error && address && !isAddressValid && (
            <p className="text-xs text-red-400 mt-1 absolute -bottom-5">
              {error}
            </p>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          className="bg-blue-800/80 backdrop-blur-sm text-white shadow-md shadow-blue-900/30 hover:bg-blue-700/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] rounded-md"
          type="button"
          disabled={!!(address && !isAddressValid) || address === ''}
        >
          <span>Submit</span>
        </Button>
      </div>
    </div>
  );
}
