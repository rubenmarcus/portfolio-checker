import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { chains } from '@/data/chains';

interface ChainSelectorProps {
  selectedChain: string;
  onSelectChain: (chain: string) => void;
}

export function ChainSelector({ selectedChain, onSelectChain }: ChainSelectorProps) {
  const selected = chains.find((chain) => chain.id === selectedChain) || chains[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-gray-700/30 bg-gray-800/20 backdrop-blur-lg shadow-xl px-3 py-2 text-sm ring-offset-background hover:bg-accent">
        <div className="flex items-center gap-2">
          <Image
            src={selected.logo}
            alt={selected.name}
            style={{ objectFit: 'contain' }}
            width="10"
            height="10"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/cryptologos/eth.svg';
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
          <Link href={`/${chain.id}`} key={chain.id} className="block">
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/40 hover:scale-[1.02] text-sm py-2 px-3 w-full transition-all duration-200"
              onClick={() => onSelectChain(chain.id)}
            >
              <Image
                src={chain.logo}
                alt={chain.name}
                style={{ objectFit: 'contain' }}
                width="10"
                height="10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/cryptologos/eth.svg';
                }}
              />
              <span>{chain.name}</span>
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
