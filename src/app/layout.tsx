import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { WalletHistoryProvider } from '@/context/WalletHistoryContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio Checker',
  description: 'Check portfolios across multiple chains',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WalletHistoryProvider>
          <div className="content">
            <div className="container mx-auto px-4 py-8">
              <Header />
              {children}
            </div>
          </div>
        </WalletHistoryProvider>
      </body>
    </html>
  );
}
