'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AddressPortfolioContainer } from '@/components/AddressPortfolioContainer';

// This component effectively reuses the main address page component
// The pagination parameter will be read from the URL in the parent component
export default function AddressPageWithPagination() {
  const params = useParams();
  const chain = params.chain as string;
  const address = params.address as string;
  const page = params.page as string;
  const router = useRouter();

  // On initial load, validate page is a number
  useEffect(() => {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      // Redirect to page 1 if invalid
      router.replace(`/${chain}/${address}`);
    }
  }, [chain, address, page, router]);

  // The container component handles all the portfolio logic
  return <AddressPortfolioContainer />;
}