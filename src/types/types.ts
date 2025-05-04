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
}
