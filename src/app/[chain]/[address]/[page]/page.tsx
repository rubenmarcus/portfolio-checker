'use client';

import { Portfolio } from '@/components/Portfolio';
import { chains } from '@/data/chains';
import { useTokenData } from '@/hooks';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PagedPortfolioPage() {
  const params = useParams();
  const router = useRouter();

  // Extract parameters from the URL
  const chainId = (params.chain as string) || 'ethereum';
  const address = params.address as string;
  const pageParam = params.page as string;
  const currentPage = pageParam ? Number.parseInt(pageParam, 10) : 1;

  // Fetch token data
  const { tokens, isLoading, error, totals } = useTokenData(
    chainId,
    address,
    chains
  );

  const handlePageChange = (page: number) => {
    if (page === 1) {
      router.push(`/${chainId}/${address}`);
    } else {
      router.push(`/${chainId}/${address}/${page}`);
    }
  };

  // Calculate pagination values
  const pageSize = 10;

  return (
    <div className="container mx-auto px-4 py-8">
      <Portfolio
        address={address}
        chainId={chainId}
        tokens={tokens}
        isLoading={isLoading}
        error={error}
        totals={totals}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalTokenCount={tokens.length}
      />
    </div>
  );
}
