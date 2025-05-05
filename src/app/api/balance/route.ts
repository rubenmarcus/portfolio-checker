import { NextRequest, NextResponse } from 'next/server';
import { CHAIN_SLUGS } from '@/data/balance/providers';
import { resolveEns } from '@/data/balance/ens';
import { fetchEvmBalances } from '@/data/balance/fetchEvmBalance';
import { WalletBalance } from '@/types/types';

// In-memory cache for balance data with 60-second TTL
interface CacheEntry {
  data: WalletBalance[];
  totals: {
    usdValue: number;
    tokenCount: number;
  };
  timestamp: number;
}

const balanceCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000; // 60 seconds in milliseconds

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
    // Create a cache key from address and chain
    const cacheKey = `${resolvedAddress.toLowerCase()}:${chain.toLowerCase()}`;

    // Check if we have a valid cache entry
    const cachedEntry = balanceCache.get(cacheKey);
    const currentTime = Date.now();

    if (cachedEntry && (currentTime - cachedEntry.timestamp) < CACHE_TTL) {
      console.log(`Cache hit for ${cacheKey}, returning cached data`);
      // Return cached data if it's less than 60 seconds old
      return NextResponse.json({
        data: cachedEntry.data,
        totals: cachedEntry.totals,
        cached: true
      });
    }

    // Cache miss or expired, fetch fresh data
    console.log(`Cache miss for ${cacheKey}, fetching fresh data`);

    // Convert chain slug to chain ID
    const chainId = getChainIdFromSlug(chain);
    const balances = await fetchEvmBalances(resolvedAddress, chainId);

    // Calculate total USD value across all tokens
    const totalUsdValue = balances.reduce((sum, token) => sum + (token.usdValue || 0), 0);

    // Create totals object
    const totals = {
      usdValue: totalUsdValue,
      tokenCount: balances.length
    };

    // Store in cache
    balanceCache.set(cacheKey, {
      data: balances,
      totals,
      timestamp: currentTime
    });

    // Return all balances without pagination
    return NextResponse.json({
      data: balances,
      totals,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching balances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balances' },
      { status: 500 }
    );
  }
}