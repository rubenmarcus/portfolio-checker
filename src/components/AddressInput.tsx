import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CHAIN_SYMBOLS } from '@/data/balance/providers';
import { useWalletHistory } from '@/context/WalletHistoryContext';

interface AddressInputProps {
  address: string;
  onChange: (address: string) => void;
  className?: string;
  placeholder?: string;
  chainId?: string;
  validate: (address: string) => boolean;
}

export function AddressInput({
  address,
  onChange,
  className = '',
  placeholder,
  chainId = 'ethereum',
  validate,
}: AddressInputProps) {
  const router = useRouter();
  const { addToHistory } = useWalletHistory();
  const [isFocused, setIsFocused] = useState(false);
  const [currentChainSymbol, setCurrentChainSymbol] = useState(CHAIN_SYMBOLS[chainId] || 'ETH');
  const [isAddressValid, setIsAddressValid] = useState(false);

  // Update chain symbol when chainId changes
  useEffect(() => {
    const symbol = CHAIN_SYMBOLS[chainId] || 'ETH';
    setCurrentChainSymbol(symbol);
  }, [chainId]);

  // Validate address when it changes
  useEffect(() => {
    if (address) {
      setIsAddressValid(validate(address));
    } else {
      setIsAddressValid(false);
    }
  }, [address, validate]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleSubmit = useCallback(() => {
    if (validate(address)) {
      // Add to search history
      addToHistory(chainId, address);

      // Navigate to the address page
      router.push(`/${chainId}/${address}`);
      onChange(''); // Clear address after submission
    }
  }, [address, chainId, router, validate, onChange, addToHistory]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  const defaultPlaceholder = `Enter ${currentChainSymbol} address (0x...) or ENS domain`;

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="relative flex-grow max-w-xs">
        <Input
          value={address}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          className={`pr-8 border border-gray-700/30 bg-gray-800/20 backdrop-blur-lg shadow-xl ${
            isAddressValid ? 'border-green-400' : (isFocused ? 'border-blue-400' : '')
          }`}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-help">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>Enter an Ethereum address (0x format) or ENS domain name (name.eth) to view balances</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button
        onClick={handleSubmit}
        className="bg-blue-800/80 backdrop-blur-sm text-white shadow-md shadow-blue-900/30 hover:bg-blue-700/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] rounded-md"
        type="button"
      >
        <span>Submit</span>
      </Button>
    </div>
  );
}