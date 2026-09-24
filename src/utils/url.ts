import { SortOption } from '@/types/product';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const VALID_PAGE_SIZES = [10, 20, 50] as const;

export const VALID_SORT_OPTIONS: SortOption[] = [
  'default',
  'price-asc',
  'price-desc',
  'rating-asc',
  'rating-desc',
  'title-asc',
  'title-desc',
];

/**
 * Safely parse page parameter.
 * Handles NaN, negative numbers, floats, strings like 'abc', etc.
 */
export function parsePageParam(val: string | number | null | undefined, totalPages?: number): number {
  if (val === null || val === undefined) return DEFAULT_PAGE;
  const num = typeof val === 'number' ? val : parseInt(String(val), 10);
  if (isNaN(num) || num < 1) return DEFAULT_PAGE;
  if (totalPages && totalPages > 0 && num > totalPages) {
    return totalPages;
  }
  return Math.floor(num);
}

/**
 * Safely parse pageSize parameter.
 * Only allows valid options: 10, 20, 50. Defaults to 20.
 */
export function parsePageSizeParam(val: string | number | null | undefined): number {
  if (val === null || val === undefined) return DEFAULT_PAGE_SIZE;
  const num = typeof val === 'number' ? val : parseInt(String(val), 10);
  if (isNaN(num)) return DEFAULT_PAGE_SIZE;
  if (VALID_PAGE_SIZES.includes(num as any)) {
    return num;
  }
  return DEFAULT_PAGE_SIZE;
}

/**
 * Safely parse sort parameter. Whitelists accepted sort types.
 */
export function parseSortParam(val: string | null | undefined): SortOption {
  if (!val) return 'default';
  if (VALID_SORT_OPTIONS.includes(val as SortOption)) {
    return val as SortOption;
  }
  return 'default';
}

/**
 * Convert sort option string to DummyJSON API parameters
 */
export function getSortApiParams(sort: SortOption): { sortBy?: string; order?: 'asc' | 'desc' } {
  switch (sort) {
    case 'price-asc':
      return { sortBy: 'price', order: 'asc' };
    case 'price-desc':
      return { sortBy: 'price', order: 'desc' };
    case 'rating-asc':
      return { sortBy: 'rating', order: 'asc' };
    case 'rating-desc':
      return { sortBy: 'rating', order: 'desc' };
    case 'title-asc':
      return { sortBy: 'title', order: 'asc' };
    case 'title-desc':
      return { sortBy: 'title', order: 'desc' };
    default:
      return {};
  }
}
