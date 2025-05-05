import React, { useState, useEffect } from 'react';
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


interface AddressInputProps {
  address: string;
  onChange: (address: string) => void;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
  onSubmit?: () => void;
  chainSymbol?: string;
  chainId?: string;
}

export function AddressInput({
  address,
  onChange,
  isLoading = false,
  className = '',
  placeholder,
  onSubmit,
  chainSymbol,
  chainId = 'ethereum',
}: AddressInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [currentChainSymbol, setCurrentChainSymbol] = useState(chainSymbol || 'ETH');

  useEffect(() => {
    // If chainSymbol is provided as a prop, use it (for backward compatibility)
    if (chainSymbol) {
      setCurrentChainSymbol(chainSymbol);
      return;
    }

    // Otherwise, look up the symbol from our mapping based on chainId
    if (chainId) {
      const symbol = CHAIN_SYMBOLS[chainId] || 'ETH'; // Default to ETH if not found
      setCurrentChainSymbol(symbol);
    }
  }, [chainId, chainSymbol]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  const isValidAddress = (address: string) => {
    return address &&
           (address.startsWith('0x') && address.length === 42) ||
           address.endsWith('.eth');
  };

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
            isValidAddress(address) ? 'border-green-400' : (isFocused ? 'border-blue-400' : '')
          }`}
          disabled={isLoading}
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
      {onSubmit && (
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-blue-800/80 backdrop-blur-sm text-white shadow-md shadow-blue-900/30 hover:bg-blue-700/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] rounded-md"
          type="button"
        >
          <span>Submit</span>
        </Button>
      )}
    </div>
  );
}