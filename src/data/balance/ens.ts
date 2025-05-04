import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Create a public client for ENS resolution
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * Resolves an ENS (Ethereum Name Service) domain to its corresponding Ethereum address.
 * @param ensName - The ENS domain to resolve (e.g., 'vitalik.eth')
 * @returns Promise resolving to the Ethereum address or null if resolution fails
 */
export async function resolveEns(ensName: string): Promise<string | null> {
  try {
    const address = await publicClient.getEnsAddress({
      name: ensName,
    });
    return address;
  } catch (error) {
    console.error('Error resolving ENS name:', error);
    return null;
  }
}