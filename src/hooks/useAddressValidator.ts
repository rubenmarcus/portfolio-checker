import { useState, useEffect } from 'react';

interface AddressValidatorResult {
  isValid: boolean;
  error: string;
  validate: (address: string) => boolean;
}

export function useAddressValidator(): AddressValidatorResult {
  const [error, setError] = useState('');

  const validate = (address: string): boolean => {
    if (!address) {
      setError('');
      return false;
    }

    const isValidAddress = (address.startsWith('0x') && address.length === 42) || address.endsWith('.eth');

    if (!isValidAddress) {
      setError('Please enter a valid Ethereum address or ENS name');
      return false;
    }

    setError('');
    return true;
  };

  return {
    isValid: error === '',
    error,
    validate
  };
}