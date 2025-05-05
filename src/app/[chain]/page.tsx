import { ChainClient } from '@/components/ChainClient';

interface ChainPageProps {
  params: {
    chain: string;
  };
}

export default async function ChainPage({ params }: ChainPageProps) {
  const { chain } = await params;

  const chainId = chain;
  return <ChainClient chainId={chainId} />;
}
