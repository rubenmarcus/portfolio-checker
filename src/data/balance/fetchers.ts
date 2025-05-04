import { WalletBalance, Token } from "@/types/types";

// Define the Ankr API key and endpoints
const ANKR_API_KEY = '373b465fafdea58fc9750ecbca2ae69c95d79ab90d35c4d36782f15c77186628';
 const ANKR_API_ENDPOINT = `https://rpc.ankr.com/multichain/${ANKR_API_KEY}`;

// Chain IDs for reference
export const CHAIN_IDS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  BASE: 8453,
  SOLANA: 1151111081099710,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  ZKSYNC_ERA: 324,
  LINEA: 59144,
  GNOSIS: 100,
  AVALANCHE: 43114,
  FANTOM: 250,
  POLYGON_ZKEVM: 1101,
  FUSE: 122,
  BOBA: 288,
  MOONBEAM: 1284,
  MOONRIVER: 1285,
  AURORA: 1313161554,
  METIS: 1088,
  SCROLL: 534352,
  MODE: 34443,
  MANTLE: 5000,
  ROOTSTOCK: 30,
  BLAST: 81457,
  CELO: 42220,
  FRAXTAL: 252,
  TAIKO: 167000,
  GRAVITY: 1625,
  SEI: 1329,
  IMMUTABLE: 13371,
  WORLD_CHAIN: 480,
  CRONOS: 25,
  LISK: 1135,
  ABSTRACT: 2741,
  SONIC: 146,
  UNICHAIN: 130,
  KAIA: 8217,
  APECHAIN: 33139,
  INK: 57073,
  BITCOIN: 20000000000001,
} as const;

// Chain slugs mapping for ANKR API
export const CHAIN_SLUGS = {
  [CHAIN_IDS.ETHEREUM]: 'eth',
  [CHAIN_IDS.POLYGON]: 'polygon',
  [CHAIN_IDS.BSC]: 'bsc',
  [CHAIN_IDS.BASE]: 'base',
  [CHAIN_IDS.ARBITRUM]: 'arbitrum',
  [CHAIN_IDS.OPTIMISM]: 'optimism',
  [CHAIN_IDS.ZKSYNC_ERA]: 'zksync_era',
  [CHAIN_IDS.LINEA]: 'linea',
  [CHAIN_IDS.GNOSIS]: 'gnosis',
  [CHAIN_IDS.AVALANCHE]: 'avalanche',
  [CHAIN_IDS.FANTOM]: 'fantom',
  [CHAIN_IDS.POLYGON_ZKEVM]: 'polygon_zkevm',
  [CHAIN_IDS.FUSE]: 'fuse',
  [CHAIN_IDS.MOONBEAM]: 'moonbeam',
  [CHAIN_IDS.MOONRIVER]: 'moonriver',
  [CHAIN_IDS.AURORA]: 'aurora',
  [CHAIN_IDS.METIS]: 'metis',
  [CHAIN_IDS.SCROLL]: 'scroll',
  [CHAIN_IDS.MODE]: 'mode',
  [CHAIN_IDS.MANTLE]: 'mantle',
  [CHAIN_IDS.ROOTSTOCK]: 'rootstock',
  [CHAIN_IDS.BLAST]: 'blast',
  [CHAIN_IDS.CELO]: 'celo',
  [CHAIN_IDS.FRAXTAL]: 'fraxtal',
  [CHAIN_IDS.TAIKO]: 'taiko',
  [CHAIN_IDS.GRAVITY]: 'gravity',
  [CHAIN_IDS.IMMUTABLE]: 'immutable',
  [CHAIN_IDS.WORLD_CHAIN]: 'world',
  [CHAIN_IDS.CRONOS]: 'cronos',
  [CHAIN_IDS.LISK]: 'lisk',
  [CHAIN_IDS.ABSTRACT]: 'abstract',
  [CHAIN_IDS.SONIC]: 'sonic',
  [CHAIN_IDS.UNICHAIN]: 'unichain',
  [CHAIN_IDS.KAIA]: 'kaia',
  [CHAIN_IDS.APECHAIN]: 'apechain',
  [CHAIN_IDS.INK]: 'ink',
} as const;

// Supported chains
export const SUPPORTED_EVM_CHAINS = [
  CHAIN_IDS.ETHEREUM,
  CHAIN_IDS.POLYGON,
  CHAIN_IDS.BSC,
  CHAIN_IDS.BASE,
  CHAIN_IDS.ARBITRUM,
  CHAIN_IDS.OPTIMISM,
  CHAIN_IDS.AVALANCHE,
  CHAIN_IDS.FANTOM,
  CHAIN_IDS.ZKSYNC_ERA,
  CHAIN_IDS.LINEA,
  CHAIN_IDS.GNOSIS,
  CHAIN_IDS.POLYGON_ZKEVM,
  CHAIN_IDS.SCROLL,
  CHAIN_IDS.MODE,
  CHAIN_IDS.MANTLE,
  CHAIN_IDS.BLAST,
  CHAIN_IDS.CELO,
];


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


  console.log(chain, 'chain')
  try {
    const response = await fetch(`${ANKR_API_ENDPOINT}`, {
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
    eth: 1,
    bsc: 56,
    arbitrum: 42161,
    optimism: 10,
    base: 8453,
    polygon: 137,
    avalanche: 43114,
    fantom: 250,
  };
  return chainIds[blockchain] || 1;
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
