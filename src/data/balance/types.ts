import { WalletBalance, Token } from '@/types/types';

// These types are used internally by the balance fetching modules
// and may differ from the application-wide types

export interface TokenBalance {
  symbol: string;
  balance: string;
  balanceUsd?: string;
  balanceRaw?: string;
  decimals?: number;
  name: string;
  thumbnail?: string;
  tokenAddress?: string;
}

export interface BalanceResponse {
  tokens: TokenBalance[];
  totalBalanceUsd: string;
}

// Helper to convert internal TokenBalance to application WalletBalance
export function convertToWalletBalance(tokenBalance: TokenBalance, chainId: number): WalletBalance {
  const token: Token = {
    address: tokenBalance.tokenAddress || '0x0000000000000000000000000000000000000000',
    symbol: tokenBalance.symbol,
    name: tokenBalance.name,
    decimals: tokenBalance.decimals || 18,
    logoURI: tokenBalance.thumbnail,
    chainId,
    price: {
      USD: tokenBalance.balanceUsd ? parseFloat(tokenBalance.balanceUsd) / parseFloat(tokenBalance.balance) : null
    }
  };

  return {
    token,
    balance: tokenBalance.balance,
    formattedBalance: tokenBalance.balance,
    usdValue: tokenBalance.balanceUsd ? parseFloat(tokenBalance.balanceUsd) : 0
  };
}