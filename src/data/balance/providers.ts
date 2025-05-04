// Define the Ankr API key and endpoints
export const ANKR_API_KEY = process.env.ANKR_API_KEY || '';
export const ANKR_API_ENDPOINT = 'https://rpc.ankr.com/multichain';

// Helius API key for Solana
export const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';
export const HELIUS_API_ENDPOINT = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// Define the chains supported by the API
export const SUPPORTED_CHAINS = {
  eth: { name: 'Ethereum', id: 'ethereum' },
  polygon: { name: 'Polygon', id: 'polygon' },
  bsc: { name: 'BNB Chain', id: 'bsc' },
  avalanche: { name: 'Avalanche', id: 'avalanche' },
  arbitrum: { name: 'Arbitrum', id: 'arbitrum' },
  optimism: { name: 'Optimism', id: 'optimism' },
};