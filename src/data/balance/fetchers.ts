import { WalletBalance, Token } from "@/types/types";
import {
  ANKR_API_ENDPOINT,
  ANKR_API_KEY,
  CHAIN_SLUGS,
  CHAIN_IDS,
  SUPPORTED_EVM_CHAINS
} from './providers';

// Types for balance responses
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

// Check if address is a valid EVM address
function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Function to fetch balances from multiple EVM chains at once
export async function fetchMultiChainBalances(address: string, chain: string = 'eth'): Promise<WalletBalance[]> {
  if (!isValidEvmAddress(address)) {
    console.warn('Invalid EVM address format, skipping Ankr API request');
    return [];
  }

  try {
    const response = await fetch(ANKR_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANKR_API_KEY,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'ankr_getAccountBalance',
        params: {
          walletAddress: address,
          blockchain: chain,
        },
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.result;

    if (!result?.assets) {
      return [];
    }

    return result.assets.map((asset: any) => {
      const chainId = getChainId(asset.blockchain);

      const token: Token = {
        address: asset.contractAddress || '0x0000000000000000000000000000000000000000',
        symbol: asset.tokenSymbol || asset.blockchain,
        name: asset.tokenName || 'Unknown',
        decimals: asset.tokenDecimals || 18,
        logoURI: asset.thumbnail,
        chainId,
        price: {
          USD: asset.tokenPrice ? parseFloat(asset.tokenPrice) : null
        }
      };

      return {
        token,
        balance: asset.balance,
        formattedBalance: asset.balance,
        usdValue: parseFloat(asset.balanceUsd || '0')
      };
    });
  } catch (error) {
    console.error('Error fetching multi-chain balances:', error);
    return [];
  }
}

// Helper function to get chain ID from blockchain name
function getChainId(blockchain: string): number {
  const chainIds: Record<string, number> = {
    eth: CHAIN_IDS.ETHEREUM,
    bsc: CHAIN_IDS.BSC,
    arbitrum: CHAIN_IDS.ARBITRUM,
    optimism: CHAIN_IDS.OPTIMISM,
    base: CHAIN_IDS.BASE,
    polygon: CHAIN_IDS.POLYGON,
    avalanche: CHAIN_IDS.AVALANCHE,
  };
  return chainIds[blockchain] || CHAIN_IDS.ETHEREUM;
}

export const formatBalance = (balance: string | number, decimals: number): string => {
  const num = typeof balance === 'string' ? Number.parseFloat(balance) : balance;
  if (Number.isNaN(num)) return '0';
  return num.toFixed(decimals);
};

export const fetchEvmBalances = async (
  evmAddress: string,
  chainId: number | null
): Promise<WalletBalance[]> => {
  if (!evmAddress) return [];

  // Only fetch balances for the specified chain if provided, otherwise fetch for all supported chains
  const supportedChainId = chainId !== null && SUPPORTED_EVM_CHAINS.some((id) => id === chainId);

  const chain =
    supportedChainId && chainId !== null
      ? CHAIN_SLUGS[chainId as keyof typeof CHAIN_SLUGS] || 'eth'
      : 'eth';

  const balances = await fetchMultiChainBalances(evmAddress, chain);

  // For each balance, ensure the chainId matches the requested chainId if specified
  const filteredBalances = chainId
    ? balances.filter((balance) => balance.token.chainId === chainId)
    : balances;

  // Format balances at the data fetching level
  return filteredBalances.map((balance) => ({
    ...balance,
    formattedBalance: formatBalance(balance.balance, balance.token.decimals),
  }));
};
