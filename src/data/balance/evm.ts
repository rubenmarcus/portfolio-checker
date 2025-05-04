import { ANKR_API_KEY, ANKR_API_ENDPOINT } from './providers';
import type { BalanceResponse } from './types';

/**
 * Fetches token balances for an EVM address using Ankr's API
 * @param address The wallet address to check
 * @param chain The blockchain network to query (eth, polygon, etc.)
 * @returns Formatted balance response
 */
export async function fetchEvmBalances(address: string, chain: string = 'eth'): Promise<BalanceResponse> {
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
          blockchain: chain,
          walletAddress: address,
        },
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.result;

    return {
      tokens: result?.assets?.map((asset: any) => ({
        symbol: asset.tokenSymbol || asset.blockchain,
        balance: asset.balance,
        balanceUsd: asset.balanceUsd,
        balanceRaw: asset.balanceRawInteger,
        decimals: asset.tokenDecimals,
        name: asset.tokenName,
        thumbnail: asset.thumbnail,
        tokenAddress: asset.contractAddress,
      })) || [],
      totalBalanceUsd: result?.totalBalanceUsd || '0',
    };
  } catch (error) {
    console.error(`Error fetching ${chain} balances:`, error);
    throw new Error(`Failed to fetch ${chain} balances`);
  }
}