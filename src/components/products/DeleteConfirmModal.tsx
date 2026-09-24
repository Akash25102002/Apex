'use client';

import React, { useEffect } from 'react';
import { AlertCircle, Trash2, Loader2, X } from 'lucide-react';
import { Product } from '@/types/product';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  product,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-modal p-6 overflow-hidden">
        {/* Close icon */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center ring-8 ring-rose-50/50">
            <Trash2 className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 id="delete-modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
              Delete Product?
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-800">&ldquo;{product.title}&rdquo;</span>?
              This will remove the item from your current catalog session.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
