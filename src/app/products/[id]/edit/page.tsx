'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductForm } from '@/components/products/ProductForm';
import { useToast } from '@/components/ui/Toast';
import productService from '@/services/product.service';
import { CategoryItem, Product, ProductFormData } from '@/types/product';
import { getApiErrorMessage } from '@/lib/axios';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      setNotFound(false);
      setLoadError(null);

      try {
        const [prod, cats] = await Promise.all([
          productService.getProductById(id),
          productService.getCategories(),
        ]);
        if (isMounted) {
          setProduct(prod);
          setCategories(cats);
        }
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.message?.includes('not found')) {
          if (isMounted) setNotFound(true);
        } else {
          if (isMounted) setLoadError(getApiErrorMessage(err));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUpdate = async (formData: ProductFormData) => {
    if (!product || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await productService.updateProduct(product.id, formData);
      success('Product updated', `"${formData.title}" has been saved successfully.`);
      router.push(`/products/${product.id}`);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setSubmitError(msg);
      toastError('Failed to save product', msg);
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <DashboardLayout title="Product Not Found">
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-card max-w-xl mx-auto my-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4 ring-8 ring-amber-50/50">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Product Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            The product you are trying to edit does not exist or has been removed.
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

  if (loadError) {
    return (
      <DashboardLayout title="Error Loading Product">
        <div className="w-full bg-white rounded-2xl border border-rose-100 p-12 text-center shadow-card max-w-xl mx-auto my-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4 ring-8 ring-rose-50/50">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Error Loading Product</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{loadError}</p>
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

  return (
    <DashboardLayout title={product ? `Edit: ${product.title}` : 'Edit Product'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <NextLink
            href={`/products/${id}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-card transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Details</span>
          </NextLink>
        </div>

        {isLoading || !product ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-4 max-w-4xl">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <ProductForm
            initialData={{
              title: product.title,
              description: product.description,
              price: product.price,
              category: product.category,
              brand: product.brand,
              stock: product.stock,
              rating: product.rating,
              thumbnail: product.thumbnail,
            }}
            categories={categories}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            mode="edit"
            submitError={submitError}
            cancelHref={`/products/${product.id}`}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
