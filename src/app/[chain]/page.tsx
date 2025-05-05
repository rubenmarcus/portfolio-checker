// Page.tsx - Server Component
import { ChainClient } from '@/components/ChainClient';

interface ChainPageProps {
  params: {
    chain: string;
  };
}

export default async function ChainPage({ params }: ChainPageProps) {
  const chainId = params.chain;
  return <ChainClient chainId={chainId} />;
}
