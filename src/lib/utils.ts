import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function formatNumberWithCommas(num: number | string): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatCryptoBalance(balance: string | number): string {
  let num: number;

  if (typeof balance === 'string') {
    if (balance.includes('e') || balance.length > 15) {
      const parts = balance.split('.');
      if (parts.length > 1) {
        num = parseFloat(parseFloat(balance).toFixed(8));
      } else {
        num = Number(balance);
      }
    } else {
      num = parseFloat(balance);
    }
  } else {
    num = balance;
  }

  if (isNaN(num)) {
    return '0';
  }

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return formatNumberWithCommas(num.toFixed(2));
  } else if (num >= 0.01) {
    return num.toFixed(4);
  } else if (num > 0) {
    return num.toFixed(8);
  } else {
    return '0';
  }
}

// Truncate Ethereum address
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  const start = address.substring(0, chars + 2);
  const end = address.substring(address.length - chars);
  return `${start}...${end}`;
}