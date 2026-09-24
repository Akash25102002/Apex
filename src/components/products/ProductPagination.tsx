'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VALID_PAGE_SIZES } from '@/utils/url';

interface ProductPaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

export function ProductPagination({
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: ProductPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Clamped page number
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  // Calculate slice range for "Showing X to Y of Z"
  const startItem = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, total);

  // Generate pagination numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);

      if (safePage > 3) {
        pages.push('...');
      }

      // Middle pages around current
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safePage < totalPages - 2) {
        pages.push('...');
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 px-4 py-3 sm:px-6 shadow-card mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Showing results & page size selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
        <span>
          Showing <strong className="font-semibold text-slate-800">{startItem}</strong> to{' '}
          <strong className="font-semibold text-slate-800">{endItem}</strong> of{' '}
          <strong className="font-semibold text-slate-800">{total}</strong> products
        </span>

        {/* Page size dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSizeSelect" className="text-slate-500 text-xs">
            Per page:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={isLoading}
            className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer disabled:opacity-50"
          >
            {VALID_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination navigation controls */}
      <nav
        role="navigation"
        aria-label="Pagination Navigation"
        className="flex items-center gap-1.5"
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1 || isLoading}
          className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, index) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-slate-400 text-xs select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === safePage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[32px] h-8 px-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages || isLoading}
          className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
