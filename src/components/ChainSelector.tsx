import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { chains } from '@/data/chains';
import { useRouter } from 'next/navigation';

interface ChainSelectorProps {
  selectedChain: string;
  onSelectChain: (chain: string) => void;
}

export function ChainSelector({ selectedChain, onSelectChain }: ChainSelectorProps) {
  const selected = chains.find((chain) => chain.id === selectedChain) || chains[0];
  const router = useRouter();

  const handleChainSelect = (chainId: string) => {
    onSelectChain(chainId);
    router.push(`/${chainId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-gray-700/30 bg-gray-800/20 backdrop-blur-lg shadow-xl px-3 py-2 text-sm ring-offset-background hover:bg-accent">
        <div className="flex items-center gap-2">
          <Image
            src={selected.logo}
            alt={selected.name}
            style={{ objectFit: 'contain' }}
            width={20}
            height={20}
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/cryptologos/ethereum.svg';
            }}
          />
          <span>{selected.name}</span>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border border-gray-700/30 bg-gray-800/20 backdrop-blur-lg shadow-xl w-full min-w-[180px]"
      >
        {chains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/40 hover:scale-[1.02] text-sm py-2 px-3 w-full transition-all duration-200"
            onClick={() => handleChainSelect(chain.id)}
          >
            <img
              src={chain.logo}
              alt={chain.name}
              className="h-5 w-5"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = '/cryptologos/ethereum.svg';
              }}
            />
            <span>{chain.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export the chains data to be used elsewhere
export { chains };