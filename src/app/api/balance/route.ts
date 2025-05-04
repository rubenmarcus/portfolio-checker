import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_CHAINS } from '@/data/balance/chains';
import { resolveEns } from '@/data/balance/ens';
import {
  fetchEvmBalances,
  CHAIN_IDS,
  CHAIN_SLUGS
} from '@/data/balance/fetchers';

// Helper to get chain ID from slug
const getChainIdFromSlug = (slug: string): number | null => {
  // Convert slug to lowercase for consistency
  const normalizedSlug = slug.toLowerCase();

  // Find the corresponding chain ID
  for (const [chainId, chainSlug] of Object.entries(CHAIN_SLUGS)) {
    if (chainSlug === normalizedSlug) {
      return Number(chainId);
    }
  }

  // Return null if not found
  return null;
};

// Handler for the GET request
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const chain = searchParams.get('chain') || 'eth';

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  let resolvedAddress = address;

  // If address is an ENS name, resolve it
  if (address.endsWith('.eth')) {
    const resolved = await resolveEns(address);
    if (!resolved) {
      return NextResponse.json({ error: 'Invalid ENS name or unable to resolve' }, { status: 400 });
    }
    resolvedAddress = resolved;
  }

  try {
    let balances;

    // Convert chain slug to chain ID
    const chainId = getChainIdFromSlug(chain);

    balances = await fetchEvmBalances(resolvedAddress, chainId);

    // Calculate total USD value across all tokens
    const totalUsdValue = balances.reduce((sum, token) => sum + (token.usdValue || 0), 0);

    // Return all balances without pagination
    return NextResponse.json({
      data: balances,
      totals: {
        usdValue: totalUsdValue,
        tokenCount: balances.length
      }
    });
  } catch (error) {
    console.error('Error fetching balances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balances' },
      { status: 500 }
    );
  }
}