// Page.tsx - Server Component
import { ChainClient } from '@/components/ChainClient';

export default function ChainPage({ params }: { params: { chain: string } }) {
  const chainId = params.chain;
  return <ChainClient chainId={chainId} />;
}
