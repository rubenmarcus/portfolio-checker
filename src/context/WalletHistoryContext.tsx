'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type HistoryEntry = {
  chain: string;
  address: string;
  timestamp: number;
};

interface WalletHistoryContextType {
  searchHistory: HistoryEntry[];
  addToHistory: (chain: string, address: string) => void;
  clearHistory: () => void;
}

const WalletHistoryContext = createContext<WalletHistoryContextType | undefined>(undefined);

export function WalletHistoryProvider({ children }: { children: ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<HistoryEntry[]>([]);
  const pathname = usePathname();

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('addressSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // Track wallet page navigation
  useEffect(() => {
    // Match pattern /{chain}/{address}
    const match = pathname?.match(/^\/([^\/]+)\/([^\/]+)$/);

    if (match) {
      const [, chain, address] = match;

      // Skip if address doesn't look like a crypto address (simple validation)
      if (address.startsWith('0x') && address.length >= 40) {
        addToHistory(chain, address);
      }
    }
  }, [pathname]);

  const addToHistory = (chain: string, address: string) => {
    setSearchHistory(prevHistory => {
      // Create new history entry
      const newHistory = [
        { chain, address, timestamp: Date.now() },
        ...prevHistory.filter(item => !(item.chain === chain && item.address === address))
      ].slice(0, 10); // Keep only the 10 most recent searches

      // Save to localStorage
      localStorage.setItem('addressSearchHistory', JSON.stringify(newHistory));

      return newHistory;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('addressSearchHistory');
  };

  return (
    <WalletHistoryContext.Provider value={{ searchHistory, addToHistory, clearHistory }}>
      {children}
    </WalletHistoryContext.Provider>
  );
}

export function useWalletHistory() {
  const context = useContext(WalletHistoryContext);
  if (context === undefined) {
    throw new Error('useWalletHistory must be used within a WalletHistoryProvider');
  }
  return context;
}