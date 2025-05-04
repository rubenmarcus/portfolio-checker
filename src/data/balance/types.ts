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