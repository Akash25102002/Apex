'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryItem, Product, SortOption } from '@/types/product';
import productService from '@/services/product.service';
import { isCancel, getApiErrorMessage } from '@/lib/axios';
import {
  parsePageParam,
  parsePageSizeParam,
  parseSortParam,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/utils/url';
import { useDebounce } from './useDebounce';

export function useProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL parameters safely
  const rawPage = searchParams.get('page');
  const rawPageSize = searchParams.get('pageSize');
  const rawSearch = searchParams.get('search') || '';
  const rawCategory = searchParams.get('category') || 'all';
  const rawSort = searchParams.get('sort');

  const page = parsePageParam(rawPage);
  const pageSize = parsePageSizeParam(rawPageSize);
  const sort = parseSortParam(rawSort);
  const category = rawCategory;

  // Local search input state for smooth typing
  const [searchInput, setSearchInput] = useState(rawSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync search input if URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    if (rawSearch !== searchInput) {
      setSearchInput(rawSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawSearch]);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categories list
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // AbortController reference to cancel in-flight requests and prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load categories once
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const catList = await productService.getCategories();
        if (isMounted) {
          setCategories(catList);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update URL helper preserving existing parameters
  const updateUrl = useCallback(
    (updates: {
      page?: number;
      pageSize?: number;
      search?: string;
      category?: string;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.page !== undefined) {
        if (updates.page <= 1) {
          params.delete('page');
        } else {
          params.set('page', updates.page.toString());
        }
      }

      if (updates.pageSize !== undefined) {
        if (updates.pageSize === DEFAULT_PAGE_SIZE) {
          params.delete('pageSize');
        } else {
          params.set('pageSize', updates.pageSize.toString());
        }
      }

      if (updates.search !== undefined) {
        if (!updates.search.trim()) {
          params.delete('search');
        } else {
          params.set('search', updates.search.trim());
        }
      }

      if (updates.category !== undefined) {
        if (updates.category === 'all' || !updates.category) {
          params.delete('category');
        } else {
          params.set('category', updates.category);
        }
      }

      if (updates.sort !== undefined) {
        if (updates.sort === 'default') {
          params.delete('sort');
        } else {
          params.set('sort', updates.sort);
        }
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `/products?${queryString}` : '/products';
      router.push(targetUrl);
    },
    [router, searchParams]
  );

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== rawSearch) {
      updateUrl({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, rawSearch, updateUrl]);

  // Fetch products with cancellation handling
  const fetchProducts = useCallback(async () => {
    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    if (debouncedSearch) {
      setIsSearching(true);
    }

    try {
      const response = await productService.getProducts({
        page,
        pageSize,
        search: debouncedSearch,
        category,
        sort,
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setProducts(response.products);
        setTotal(response.total);

        // Normalize page if current page exceeds total pages
        const maxPages = Math.ceil(response.total / pageSize) || 1;
        if (page > maxPages && response.total > 0) {
          updateUrl({ page: maxPages });
        }
      }
    } catch (err: unknown) {
      // Ignore canceled requests completely
      if (isCancel(err) || (err as any)?.name === 'CanceledError' || controller.signal.aborted) {
        return;
      }
      setError(getApiErrorMessage(err));
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setIsSearching(false);
      }
    }
  }, [page, pageSize, debouncedSearch, category, sort, updateUrl]);

  // Trigger fetch when query params change
  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  // Action handlers
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateUrl({ page: newPage });
    },
    [updateUrl]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      updateUrl({ pageSize: newSize, page: 1 });
    },
    [updateUrl]
  );

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      updateUrl({ category: newCategory, page: 1 });
    },
    [updateUrl]
  );

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      updateUrl({ sort: newSort, page: 1 });
    },
    [updateUrl]
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchInput(text);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    router.push('/products');
  }, [router]);

  return {
    products,
    total,
    page,
    pageSize,
    search: searchInput,
    category,
    sort,
    categories,
    isLoading,
    isSearching,
    isLoadingCategories,
    error,
    refetch: fetchProducts,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    setCategory: handleCategoryChange,
    setSort: handleSortChange,
    setSearch: handleSearchChange,
    clearFilters: handleClearFilters,
  };
}

export default useProducts;
