'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { Portfolio } from '@/components/Portfolio';
import { chains } from '@/data/chains';
import { useTokenData, useAddressNavigation } from '@/hooks';

export function AddressPortfolioContainer() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const chainId = params.chain as string;
  const address = params.address as string;

  // Extract page from URL if present, otherwise default to 1
  const pathParts = pathname.split('/');
  const pageParam = pathParts.length > 3 ? pathParts[3] : null;
  const currentPage = pageParam && !isNaN(parseInt(pageParam)) ? parseInt(pageParam) : 1;

  // Use our token data hook
  const { tokens, isLoading, error, totals } = useTokenData(chainId, address, chains);

  // Use the navigation hook instead of custom handlers
  const { handleAddressChange, handleChainChange } = useAddressNavigation({
    initialAddress: address,
    initialChain: chainId,
    validateBeforeNavigation: true
  });

  // Handle pagination change without refetching data
  const handlePageChange = (newPage: number) => {
    if (newPage === 1) {
      router.push(`/${chainId}/${address}`);
    } else {
      router.push(`/${chainId}/${address}/${newPage}`);
    }
  };

  // Calculate page size for consistent pagination
  const pageSize = 10;

  // Create paginated tokens
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTokens = tokens.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <Portfolio
        address={address}
        chainId={chainId}
        tokens={paginatedTokens}
        isLoading={isLoading}
        error={error}
        totals={totals}
        onAddressChange={handleAddressChange}
        onChainChange={handleChainChange}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalTokenCount={tokens.length}
      />
    </div>
  );
}