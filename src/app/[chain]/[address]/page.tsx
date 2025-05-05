'use client';

import { useParams } from 'next/navigation';
import { Portfolio } from '@/components/Portfolio';
import { useTokenData } from '@/hooks';
import { chains } from '@/data/chains';

export default function AddressPage() {
  const params = useParams();

  const chainId = (params.chain as string) || 'ethereum';
  const address = params.address as string;

  const { tokens, isLoading, error, totals } = useTokenData(chainId, address, chains);

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