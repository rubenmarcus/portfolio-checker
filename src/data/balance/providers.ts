// API keys and endpoints
export const ANKR_API_KEY = process.env.ANKR_API_KEY;
export const ANKR_API_ENDPOINT = `https://rpc.ankr.com/multichain/${ANKR_API_KEY}`;

// Chain IDs for reference
export const CHAIN_IDS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  BASE: 8453,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  AVALANCHE: 43114,
} as const;

// Chain slugs mapping for ANKR API
export const CHAIN_SLUGS = {
  [CHAIN_IDS.ETHEREUM]: 'eth',
  [CHAIN_IDS.POLYGON]: 'polygon',
  [CHAIN_IDS.BSC]: 'bsc',
  [CHAIN_IDS.BASE]: 'base',
  [CHAIN_IDS.ARBITRUM]: 'arbitrum',
  [CHAIN_IDS.OPTIMISM]: 'optimism',
  [CHAIN_IDS.AVALANCHE]: 'avalanche',
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
];

// Chain data for UI
export const SUPPORTED_CHAINS = {
  eth: { name: 'Ethereum', id: 'ethereum' },
  polygon: { name: 'Polygon', id: 'polygon' },
  bsc: { name: 'BNB Chain', id: 'bsc' },
  avalanche: { name: 'Avalanche', id: 'avalanche' },
  arbitrum: { name: 'Arbitrum', id: 'arbitrum' },
  optimism: { name: 'Optimism', id: 'optimism' },
  base: { name: 'Base', id: 'base' },
};

export const CHAIN_SYMBOLS: Record<string, string> = {
  ethereum: 'ETH',
  polygon: 'MATIC',
  bsc: 'BNB',
  avalanche: 'AVAX',
  arbitrum: 'ETH',
  optimism: 'ETH',
};
