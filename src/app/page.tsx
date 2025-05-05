'use client';
import { Button } from '@/components/ui/button';
import { useWalletHistory } from '@/context/WalletHistoryContext';
import { chains } from '@/data/chains';
import { topAccounts } from '@/data/topAccounts';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const { searchHistory, addToHistory, clearHistory } = useWalletHistory();

  const handleAddressSelect = (chain: string, address: string) => {
    // Add to history
    addToHistory(chain, address);

    // Navigate to the address page
    router.push(`/${chain}/${address}`);
  };

  const handleChainChange = (chain: string) => {
    setSelectedChain(chain);
  };

  return (
    <div className="space-y-8">
      {/* Chain selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {chains.map((chain) => (
          <Button
            key={chain.id}
            variant={selectedChain === chain.id ? 'default' : 'outline'}
            className="flex items-center gap-2"
            onClick={() => handleChainChange(chain.id)}
          >
            <img
              src={chain.logo}
              alt={chain.name}
              className="h-4 w-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/cryptologos/eth.svg';
              }}
            />
            {chain.name}
          </Button>
        ))}
      </div>

      {/* Popular addresses for selected chain */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Popular Addresses on{' '}
          {chains.find((c) => c.id === selectedChain)?.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topAccounts[selectedChain as keyof typeof topAccounts]?.map(
            (account, index) => (
              <Button
                key={account.address}
                variant="outline"
                className="flex flex-col items-start p-4 h-auto text-left"
                onClick={() =>
                  handleAddressSelect(selectedChain, account.address)
                }
              >
                <span className="font-semibold">{account.label}</span>
                <span className="text-sm text-gray-400 truncate w-full">
                  {account.address}
                </span>
              </Button>
            )
          ) || <p>No popular accounts available for this chain</p>}
        </div>
      </div>

      {/* Search history */}
      {searchHistory.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Searches</h2>
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              Clear History
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchHistory.map((item, index) => (
              <Button
                key={item.address}
                variant="outline"
                className="flex flex-col items-start p-4 h-auto text-left"
                onClick={() => handleAddressSelect(item.chain, item.address)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={
                      chains.find((c) => c.id === item.chain)?.logo ||
                      '/cryptologos/eth.svg'
                    }
                    alt={item.chain}
                    className="h-4 w-4"
                  />
                  <span className="font-semibold">
                    {chains.find((c) => c.id === item.chain)?.name ||
                      item.chain}
                  </span>
                </div>
                <span className="text-sm text-gray-400 truncate w-full">
                  {item.address}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
