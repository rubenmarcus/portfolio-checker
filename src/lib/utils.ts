import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a number with commas for thousands separator
export function formatNumberWithCommas(num: number | string): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format crypto balances for display
export function formatCryptoBalance(balance: string | number): string {
  let num: number;

  if (typeof balance === 'string') {
    // Handle scientific notation or very large numbers
    if (balance.includes('e') || balance.length > 15) {
      // For very large numbers, convert to a more readable format
      const parts = balance.split('.');
      if (parts.length > 1) {
        // If there's a decimal part, limit to reasonable precision
        num = parseFloat(parseFloat(balance).toFixed(8));
      } else {
        // For integers, use Number parsing which handles scientific notation
        num = Number(balance);
      }
    } else {
      num = parseFloat(balance);
    }
  } else {
    num = balance;
  }

  // Check for NaN after parsing
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
    // For very small numbers, show up to 8 decimal places
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