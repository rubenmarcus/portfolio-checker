import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CHAIN_IDS, CHAIN_SLUGS, SUPPORTED_EVM_CHAINS } from '@/data/balance/fetchers';
import Image from 'next/image';

// Chain data with logos from public folder
const chains = SUPPORTED_EVM_CHAINS.map(chainId => {
  const ankrName = CHAIN_SLUGS[chainId as keyof typeof CHAIN_SLUGS] || '';

  // Define chain data based on chainId
  const getChainData = (id: number) => {
    switch (id) {
      case CHAIN_IDS.ETHEREUM:
        return { id: 'ethereum', name: 'Ethereum', logoId: 'ethereum' };
      case CHAIN_IDS.POLYGON:
        return { id: 'polygon', name: 'Polygon', logoId: 'polygon' };
      case CHAIN_IDS.BSC:
        return { id: 'bsc', name: 'BNB Chain', logoId: 'bsc' };
      case CHAIN_IDS.AVALANCHE:
        return { id: 'avalanche', name: 'Avalanche', logoId: 'avalanche' };
      case CHAIN_IDS.ARBITRUM:
        return { id: 'arbitrum', name: 'Arbitrum', logoId: 'arbitrum' };
      case CHAIN_IDS.OPTIMISM:
        return { id: 'optimism', name: 'Optimism', logoId: 'optimism' };
      default:
        return { id: ankrName, name: ankrName.charAt(0).toUpperCase() + ankrName.slice(1), logoId: ankrName };
    }
  };

  const chainData = getChainData(chainId);
  const logoUrl = `/cryptologos/${chainData.logoId}.svg`;

  return {
    id: chainData.id,
    name: chainData.name,
    logo: logoUrl,
    ankrName: ankrName,
  };
});

interface ChainSelectorProps {
  selectedChain: string;
  onSelectChain: (chain: string) => void;
}

export function ChainSelector({ selectedChain, onSelectChain }: ChainSelectorProps) {
  const selected = chains.find((chain) => chain.id === selectedChain) || chains[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent">
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
      <DropdownMenuContent align="end">
        {chains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onSelectChain(chain.id)}
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