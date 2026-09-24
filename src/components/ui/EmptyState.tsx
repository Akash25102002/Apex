import React from 'react';
import { SearchX, RotateCcw, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  showClearButton?: boolean;
}

export function EmptyState({
  title = 'No products found',
  description = 'Try changing your search keywords or adjusting your category/sort filters.',
  onClearFilters,
  showClearButton = true,
}: EmptyStateProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-card">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {showClearButton && onClearFilters && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
