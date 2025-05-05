import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatNumberWithCommas(num: number | string): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatCryptoBalance(balance: string | number): string {
  let num: number;

  if (typeof balance === 'string') {
    if (balance.includes('e') || balance.length > 15) {
      const parts = balance.split('.');
      if (parts.length > 1) {
        num = Number.parseFloat(Number.parseFloat(balance).toFixed(8));
      } else {
        num = Number(balance);
      }
    } else {
      num = Number.parseFloat(balance);
    }
  } else {
    num = balance;
  }

  if (Number.isNaN(num)) {
    return '0';
  }

  if (num >= 1_000_000_000) {
    const formatted = (num / 1_000_000_000).toFixed(2);
    return formatted.endsWith('.00')
      ? `${Math.floor(num / 1_000_000_000)}B`
      : `${formatted}B`;
  }
  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toFixed(2);
    return formatted.endsWith('.00')
      ? `${Math.floor(num / 1_000_000)}M`
      : `${formatted}M`;
  }
  if (num >= 1000) {
    return formatNumberWithCommas(num.toFixed(2));
  }
  if (num >= 0.01) {
    return num.toFixed(4);
  }
  if (num > 0) {
    return num.toFixed(8);
  }
  return '0';
}

// Truncate Ethereum address
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  const start = address.substring(0, chars + 2);
  const end = address.substring(address.length - chars);
  return `${start}...${end}`;
}
