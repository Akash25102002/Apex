import { useState, useEffect } from 'react';

/**
 * Reusable debounce hook that delays updating the state until after the specified delay
 * has elapsed since the last time the value changed.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 400ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
