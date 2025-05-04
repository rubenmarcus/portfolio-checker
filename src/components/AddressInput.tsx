import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AddressInputProps {
  address: string;
  onChange: (address: string) => void;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
}

export function AddressInput({
  address,
  onChange,
  isLoading = false,
  className = '',
  placeholder = 'Enter ETH address (0x...) or ENS domain',
}: AddressInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isValidAddress = (address: string) => {
    return address &&
           (address.startsWith('0x') && address.length === 42) ||
           address.endsWith('.eth');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Input
        value={address}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`pr-8 ${
          isValidAddress(address) ? 'border-green-400' : (isFocused ? 'border-blue-400' : '')
        }`}
        disabled={isLoading}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute right-2 cursor-help">
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>Enter an Ethereum address (0x format) or ENS domain name (name.eth) to view balances</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}