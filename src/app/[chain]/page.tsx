import { ChainClient } from '@/components/ChainClient';
import { chains } from '@/data/chains';
import { redirect } from 'next/navigation';

interface ChainPageProps {
  params: Promise<{
    chain: string;
  }>;
}

export default async function ChainPage({ params }: ChainPageProps) {
  const { chain } = await params;

  const chainId = chain;
  const isChainSupported = chains.some((chain) => chain.id === chainId);

  if (!isChainSupported) {
    redirect('/');
  }

  return <ChainClient chainId={chainId} />;
}
