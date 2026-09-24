'use client';

import React from 'react';
import NextLink from 'next/link';
import { Product, SortOption } from '@/types/product';
import { formatCurrency, formatStockStatus } from '@/utils/formatters';
import {
  Eye,
  Edit2,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Tag,
} from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onDeleteClick: (product: Product) => void;
}

export function ProductTable({
  products,
  sort,
  onSortChange,
  onDeleteClick,
}: ProductTableProps) {
  // Sort header helper
  const handleColumnSort = (field: 'price' | 'rating' | 'title') => {
    if (field === 'price') {
      onSortChange(sort === 'price-asc' ? 'price-desc' : 'price-asc');
    } else if (field === 'rating') {
      onSortChange(sort === 'rating-asc' ? 'rating-desc' : 'rating-asc');
    } else if (field === 'title') {
      onSortChange(sort === 'title-asc' ? 'title-desc' : 'title-asc');
    }
  };

  const renderSortIndicator = (field: 'price' | 'rating' | 'title') => {
    if (sort === `${field}-asc`) {
      return <ArrowUp className="h-3 w-3 text-brand-600 ml-1 inline" />;
    }
    if (sort === `${field}-desc`) {
      return <ArrowDown className="h-3 w-3 text-brand-600 ml-1 inline" />;
    }
    return <ArrowUpDown className="h-3 w-3 text-slate-300 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity" />;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3.5 pl-6 pr-3">Product</th>
              <th
                scope="col"
                className="py-3.5 px-3 cursor-pointer select-none group hover:text-slate-800"
                onClick={() => handleColumnSort('title')}
              >
                <div className="flex items-center">
                  <span>Title & Brand</span>
                  {renderSortIndicator('title')}
                </div>
              </th>
              <th scope="col" className="py-3.5 px-3">Category</th>
              <th
                scope="col"
                className="py-3.5 px-3 cursor-pointer select-none group hover:text-slate-800"
                onClick={() => handleColumnSort('price')}
              >
                <div className="flex items-center">
                  <span>Price</span>
                  {renderSortIndicator('price')}
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 px-3 cursor-pointer select-none group hover:text-slate-800"
                onClick={() => handleColumnSort('rating')}
              >
                <div className="flex items-center">
                  <span>Rating</span>
                  {renderSortIndicator('rating')}
                </div>
              </th>
              <th scope="col" className="py-3.5 px-3">Stock Status</th>
              <th scope="col" className="py-3.5 pl-3 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {products.map((product) => {
              const stockStatus = formatStockStatus(product.stock);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Image Column */}
                  <td className="py-3 pl-6 pr-3 whitespace-nowrap">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img
                        src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to placeholder if broken image
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80';
                        }}
                      />
                    </div>
                  </td>

                  {/* Title & Brand */}
                  <td className="py-3 px-3 max-w-xs">
                    <NextLink
                      href={`/products/${product.id}`}
                      className="font-semibold text-slate-800 hover:text-brand-600 transition-colors block truncate"
                      title={product.title}
                    >
                      {product.title}
                    </NextLink>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span>{product.brand || 'Generic'}</span>
                      {product.sku && (
                        <>
                          <span>&bull;</span>
                          <span className="font-mono text-[10px]">SKU: {product.sku}</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                      <Tag className="h-3 w-3 text-slate-400" />
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-bold text-slate-900">
                      {formatCurrency(product.price)}
                    </div>
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        -{Math.round(product.discountPercentage)}% OFF
                      </span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-amber-50/80 px-2 py-0.5 rounded-lg border border-amber-200/60">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span>{product.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${stockStatus.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${stockStatus.dotClass}`} />
                      {stockStatus.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pl-3 pr-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <NextLink
                        href={`/products/${product.id}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title="View details"
                        aria-label={`View ${product.title}`}
                      >
                        <Eye className="h-4 w-4" />
                      </NextLink>

                      <NextLink
                        href={`/products/${product.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit product"
                        aria-label={`Edit ${product.title}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </NextLink>

                      <button
                        type="button"
                        onClick={() => onDeleteClick(product)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
