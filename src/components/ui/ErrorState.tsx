import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while fetching product data. Please check your network and try again.',
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-rose-100 p-12 text-center shadow-card">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4 ring-8 ring-rose-50/50">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
