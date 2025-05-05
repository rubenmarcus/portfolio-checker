import type { PublicClient, WalletClient } from 'viem';

// Token and Chain Types
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  price?: {
    USD: number | null;
  };
  type?: string;
  lastUpdated?: string;
}

export interface Chain {
  id: number;
  name: string;
  logoURI?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
  };
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
  testnet: boolean;
}

// Wallet Types
export interface WalletBalance {
  token: Token;
  balance: string;
  formattedBalance: string;
  usdValue: number;
  lastUpdated?: string;
}

// Portfolio Types
export interface PortfolioTotals {
  usdValue: number;
  tokenCount: number;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TokenData {
  tokens: WalletBalance[];
  totals: PortfolioTotals;
  isLoading: boolean;
  error: string;
}

export interface ChainData {
  id: string;
  name: string;
  logo: string;
  ankrName: string;
}
