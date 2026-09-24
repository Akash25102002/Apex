'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/types/product';
import productService from '@/services/product.service';
import { formatCurrency, formatStockStatus, getDiscountedPrice } from '@/utils/formatters';
import { getApiErrorMessage } from '@/lib/axios';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Star,
  ShieldAlert,
  Truck,
  RotateCcw,
  CheckCircle2,
  Tag,
  Package,
  Boxes,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await productService.getProductById(id);
      setProduct(data);
      const initialImg = data.images?.[0] || data.thumbnail || '';
      setActiveImage(initialImg);
    } catch (err: any) {
      if (err?.response?.status === 404 || err.message?.includes('not found')) {
        setNotFound(true);
      } else {
        setError(getApiErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!product || isDeleting) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(product.id);
      success('Product deleted', `"${product.title}" has been deleted.`);
      setIsDeleteModalOpen(false);
      router.push('/products');
    } catch (err: unknown) {
      toastError('Failed to delete', getApiErrorMessage(err));
      setIsDeleting(false);
    }
  };

  // 404 Not Found State
  if (notFound) {
    return (
      <DashboardLayout title="Product Not Found">
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-card max-w-xl mx-auto my-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4 ring-8 ring-amber-50/50">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Product Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            The product with ID <span className="font-mono text-slate-700 font-semibold">{id}</span> does
            not exist or has been removed from inventory.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <NextLink
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Products</span>
            </NextLink>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <DashboardLayout title="Error Loading Product">
        <div className="w-full bg-white rounded-2xl border border-rose-100 p-12 text-center shadow-card max-w-xl mx-auto my-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4 ring-8 ring-rose-50/50">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Unable to Load Product</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={fetchProduct}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
            >
              <Loader2 className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
            <NextLink
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Back to Catalog
            </NextLink>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Loading Skeleton State
  if (isLoading || !product) {
    return (
      <DashboardLayout title="Loading Product...">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 shadow-card">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stockStatus = formatStockStatus(product.stock);
  const discounted = getDiscountedPrice(product.price, product.discountPercentage);

  return (
    <DashboardLayout title={product.title}>
      <div className="space-y-6">
        {/* Navigation & Actions Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <NextLink
            href="/products"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-card transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </NextLink>

          <div className="flex items-center gap-2">
            <NextLink
              href={`/products/${product.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-all focus:outline-none"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Product</span>
            </NextLink>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors focus:outline-none"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Product Details Overview Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden relative group">
              <img
                src={activeImage || product.thumbnail || 'https://via.placeholder.com/400'}
                alt={product.title}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
                }}
              />
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-16 flex-shrink-0 rounded-xl border-2 overflow-hidden bg-slate-50 transition-all ${
                      activeImage === img
                        ? 'border-brand-600 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Metadata (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category, Brand & Stock Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  <Tag className="h-3 w-3 text-slate-400" />
                  {product.category}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  <Package className="h-3 w-3 text-indigo-400" />
                  {product.brand || 'Generic'}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${stockStatus.dotClass}`} />
                  {stockStatus.label}
                </span>
              </div>

              {/* Title & SKU */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {product.title}
              </h1>
              {product.sku && (
                <p className="text-xs text-slate-400 font-mono mt-1">SKU: {product.sku}</p>
              )}

              {/* Rating & Reviews pill */}
              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>{product.rating?.toFixed(2) || '0.00'}</span>
                  <span className="text-amber-600 font-normal">/ 5.0</span>
                </div>
                {product.reviews && product.reviews.length > 0 && (
                  <span className="text-xs text-slate-500">
                    ({product.reviews.length} customer reviews)
                  </span>
                )}
              </div>

              {/* Price section */}
              <div className="my-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Retail Price</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {formatCurrency(discounted)}
                    </span>
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {Math.round(product.discountPercentage)}% Discount Applied
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Key Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Available Units</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{product.stock} in stock</p>
                </div>

                {product.weight && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Weight</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{product.weight} kg</p>
                  </div>
                )}

                {product.dimensions && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Dimensions</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                      {product.dimensions.width} &times; {product.dimensions.height} &times;{' '}
                      {product.dimensions.depth} cm
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Badges / Policies footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
              {product.warrantyInformation && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{product.warrantyInformation}</span>
                </div>
              )}
              {product.shippingInformation && (
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-brand-500" />
                  <span>{product.shippingInformation}</span>
                </div>
              )}
              {product.returnPolicy && (
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4 text-amber-500" />
                  <span>{product.returnPolicy}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
              Customer Reviews ({product.reviews.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-slate-800">{review.reviewerName}</p>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className={`h-3 w-3 ${
                              starIdx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">&ldquo;{review.comment}&rdquo;</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          product={product}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
