'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductForm } from '@/components/products/ProductForm';
import { useToast } from '@/components/ui/Toast';
import productService from '@/services/product.service';
import { CategoryItem, ProductFormData } from '@/types/product';
import { getApiErrorMessage } from '@/lib/axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function NewProductPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const cats = await productService.getCategories();
        if (isMounted) setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const created = await productService.addProduct(formData);
      success('Product created', `"${created.title}" was added to catalog.`);
      router.push('/products');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setSubmitError(msg);
      toastError('Failed to create product', msg);
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Add New Product">
      <div className="space-y-6">
        {/* Navigation top bar */}
        <div className="flex items-center justify-between">
          <NextLink
            href="/products"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-card transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </NextLink>
        </div>

        {/* Content */}
        {isLoadingCategories ? (
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
            categories={categories}
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
            mode="add"
            submitError={submitError}
            cancelHref="/products"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
