import { Suspense } from 'react';

export default function ChainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blockchain-portfolio">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            Loading...
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
