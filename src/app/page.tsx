'use client';

import { useAddressNavigation } from '@/hooks';
import { Portfolio } from '@/components/Portfolio';

export default function Home() {
  const {
    address,
    selectedChain,
    handleAddressChange,
    handleChainChange
  } = useAddressNavigation();

  return (
    <div className="container mx-auto px-4 py-8">
      <Portfolio
        address={address}
        chainId={selectedChain}
        tokens={[]}
        isLoading={false}
        error={''}
        totals={{ usdValue: 0, tokenCount: 0 }}
        onAddressChange={handleAddressChange}
        onChainChange={handleChainChange}
      />
    </div>
  );
}
