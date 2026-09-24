'use client';

import React from 'react';
import { Search, X, Loader2, Filter, ArrowUpDown, RotateCcw, Info } from 'lucide-react';
import { CategoryItem, SortOption } from '@/types/product';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  categories: CategoryItem[];
  isLoadingCategories: boolean;
  isSearching: boolean;
  onClearFilters: () => void;
}

export function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categories,
  isLoadingCategories,
  isSearching,
  onClearFilters,
}: ProductFiltersProps) {
  const isFiltered = search.trim() !== '' || (category !== 'all' && category !== '') || sort !== 'default';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card mb-6 space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar with Debounce and Status */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by title, brand, description..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls: Category & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={isLoadingCategories}
              aria-label="Filter by category"
              className="w-full sm:w-44 pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="h-3 w-3" />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </div>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort products"
              className="w-full sm:w-44 pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer"
            >
              <option value="default">Default Sort</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating-asc">Rating: Low → High</option>
              <option value="rating-desc">Rating: High → Low</option>
              <option value="title-asc">Title: A → Z</option>
              <option value="title-desc">Title: Z → A</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="h-3 w-3" />
            </div>
          </div>

          {/* Clear Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors focus:outline-none"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Helpful filter badge if both search and category are applied */}
      {search && category !== 'all' && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-700 animate-in fade-in">
          <Info className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Searching for <strong>&ldquo;{search}&rdquo;</strong> filtered within the{' '}
            <strong>{category}</strong> category.
          </span>
        </div>
      )}
    </div>
  );
}
