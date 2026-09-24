'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { ProductFormData, FormValidationErrors, CategoryItem } from '@/types/product';
import {
  Package,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Star,
  Hash,
  Loader2,
  AlertCircle,
  Check,
  ArrowLeft,
} from 'lucide-react';

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  categories: CategoryItem[];
  onSubmit: (formData: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  mode: 'add' | 'edit';
  submitError?: string | null;
  cancelHref?: string;
}

export function ProductForm({
  initialData,
  categories,
  onSubmit,
  isSubmitting,
  mode,
  submitError,
  cancelHref = '/products',
}: ProductFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '10');
  const [rating, setRating] = useState(initialData?.rating?.toString() || '4.5');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');

  const [errors, setErrors] = useState<FormValidationErrors>({});

  // Sync initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.title !== undefined) setTitle(initialData.title);
      if (initialData.description !== undefined) setDescription(initialData.description);
      if (initialData.price !== undefined) setPrice(initialData.price.toString());
      if (initialData.category !== undefined) setCategory(initialData.category);
      if (initialData.brand !== undefined) setBrand(initialData.brand);
      if (initialData.stock !== undefined) setStock(initialData.stock.toString());
      if (initialData.rating !== undefined) setRating(initialData.rating.toString());
      if (initialData.thumbnail !== undefined) setThumbnail(initialData.thumbnail);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: FormValidationErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Product title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Product description is required';
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum)) {
      newErrors.price = 'Price is required';
    } else if (priceNum <= 0) {
      newErrors.price = 'Price must be a positive number greater than 0';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    const stockNum = parseInt(stock, 10);
    if (stock === '' || isNaN(stockNum)) {
      newErrors.stock = 'Stock quantity is required';
    } else if (stockNum < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    const ratingNum = parseFloat(rating);
    if (rating && (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    if (thumbnail.trim()) {
      try {
        new URL(thumbnail.trim());
      } catch {
        newErrors.thumbnail = 'Please provide a valid URL (e.g. https://example.com/image.jpg)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      brand: brand.trim() || undefined,
      stock: parseInt(stock, 10),
      rating: rating ? parseFloat(rating) : 4.5,
      thumbnail: thumbnail.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl" noValidate>
      {/* Top error banner */}
      {submitError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-in fade-in"
        >
          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Section 1: General Product Details */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Package className="h-4 w-4 text-brand-600" />
          <span>General Information</span>
        </h2>

        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="e.g. Apple MacBook Pro 16-inch M3 Max"
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            placeholder="Detailed overview of product features, specifications, and materials..."
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
              errors.description
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="brand" className="block text-xs font-semibold text-slate-700 mb-1">
              Brand / Manufacturer
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Apple, Sony, Nike"
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.category
                  ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Pricing & Inventory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          <span>Pricing & Inventory</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-xs font-semibold text-slate-700 mb-1">
              Price ($ USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                $
              </span>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                }}
                placeholder="29.99"
                disabled={isSubmitting}
                className={`w-full pl-7 pr-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.price
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                }`}
              />
            </div>
            {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="stock" className="block text-xs font-semibold text-slate-700 mb-1">
              Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                if (errors.stock) setErrors((prev) => ({ ...prev, stock: undefined }));
              }}
              placeholder="50"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.stock
                  ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            />
            {errors.stock && <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>}
          </div>

          <div>
            <label htmlFor="rating" className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Rating (0 - 5)
            </label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
                if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
              }}
              placeholder="4.5"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.rating
                  ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            />
            {errors.rating && <p className="mt-1 text-xs text-rose-500">{errors.rating}</p>}
          </div>
        </div>
      </div>

      {/* Section 3: Media & Thumbnail */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-indigo-600" />
          <span>Product Media</span>
        </h2>

        <div>
          <label htmlFor="thumbnail" className="block text-xs font-semibold text-slate-700 mb-1">
            Thumbnail Image URL
          </label>
          <input
            id="thumbnail"
            type="url"
            value={thumbnail}
            onChange={(e) => {
              setThumbnail(e.target.value);
              if (errors.thumbnail) setErrors((prev) => ({ ...prev, thumbnail: undefined }));
            }}
            placeholder="https://images.unsplash.com/photo-..."
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
              errors.thumbnail
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
            }`}
          />
          {errors.thumbnail && <p className="mt-1 text-xs text-rose-500">{errors.thumbnail}</p>}
          <p className="mt-1 text-[11px] text-slate-400">
            Leave blank to use a modern high-resolution placeholder automatically.
          </p>
        </div>

        {/* Thumbnail Preview if provided */}
        {thumbnail && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              <img
                src={thumbnail}
                alt="Thumbnail preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/100?text=Invalid+Image';
                }}
              />
            </div>
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Image Preview</p>
              <p className="text-[11px] text-slate-400 truncate max-w-sm">{thumbnail}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <NextLink
          href={cancelHref}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
        >
          Cancel
        </NextLink>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{mode === 'add' ? 'Creating Product...' : 'Saving Changes...'}</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>{mode === 'add' ? 'Add Product' : 'Save Changes'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
