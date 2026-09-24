'use client';

import React from 'react';
import NextLink from 'next/link';
import { Product } from '@/types/product';
import { formatCurrency, formatStockStatus } from '@/utils/formatters';
import { Eye, Edit2, Trash2, Star, Tag } from 'lucide-react';

interface ProductCardListProps {
  products: Product[];
  onDeleteClick: (product: Product) => void;
}

export function ProductCardList({ products, onDeleteClick }: ProductCardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => {
        const stockStatus = formatStockStatus(product.stock);

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card hover:shadow-dropdown transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative aspect-video w-full rounded-xl bg-slate-100 overflow-hidden mb-3 border border-slate-100">
                <img
                  src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300'}
                  alt={product.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
                  }}
                />
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-semibold shadow-xs">
                    <Tag className="h-2.5 w-2.5 text-slate-500" />
                    {product.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 backdrop-blur-sm shadow-xs ${stockStatus.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${stockStatus.dotClass}`} />
                    {stockStatus.label}
                  </span>
                </div>
              </div>

              {/* Title & Brand */}
              <div className="mb-2">
                <NextLink
                  href={`/products/${product.id}`}
                  className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1 block"
                >
                  {product.title}
                </NextLink>
                <p className="text-xs text-slate-400 mt-0.5">
                  {product.brand || 'Generic'} {product.sku ? `• SKU: ${product.sku}` : ''}
                </p>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <span className="ml-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{product.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <NextLink
                href={`/products/${product.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View</span>
              </NextLink>

              <NextLink
                href={`/products/${product.id}/edit`}
                className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border border-slate-200 hover:border-amber-200 transition-colors"
                title="Edit"
                aria-label="Edit product"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </NextLink>

              <button
                type="button"
                onClick={() => onDeleteClick(product)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-colors"
                title="Delete"
                aria-label="Delete product"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
