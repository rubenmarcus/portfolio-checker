'use client';

import { Portfolio } from '@/components/Portfolio';
import { chains } from '@/data/chains';
import { useTokenData } from '@/hooks';
import { useParams } from 'next/navigation';

export default function AddressPage() {
  const params = useParams();

  const chainId = (params.chain as string) || 'ethereum';
  const address = params.address as string;

  const { tokens, isLoading, error, totals } = useTokenData(
    chainId,
    address,
    chains
  );

  return (
    <div className="container mx-auto  py-8">
      <Portfolio
        address={address}
        chainId={chainId}
        tokens={tokens}
        isLoading={isLoading}
        error={error}
        totals={totals}
        totalTokenCount={tokens.length}
      />
    </div>
  );
}
