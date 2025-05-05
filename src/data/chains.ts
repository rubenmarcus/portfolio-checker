import {
  CHAIN_IDS,
  CHAIN_SLUGS,
  SUPPORTED_CHAINS,
  SUPPORTED_EVM_CHAINS,
} from '@/data/balance/providers';
import type { ChainData } from '@/types/types';

// Chain data with logos from public folder
export const chains: ChainData[] = SUPPORTED_EVM_CHAINS.map((chainId) => {
  const ankrName = CHAIN_SLUGS[chainId as keyof typeof CHAIN_SLUGS] || '';

  const chainInfo = SUPPORTED_CHAINS[
    ankrName as keyof typeof SUPPORTED_CHAINS
  ] || {
    name: ankrName.charAt(0).toUpperCase() + ankrName.slice(1),
    id: ankrName,
  };

  return {
    id: chainInfo.id,
    name: chainInfo.name,
    logo: `/cryptologos/${ankrName}.svg`,
    ankrName: ankrName,
  };
});
