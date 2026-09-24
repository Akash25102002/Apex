'use client';

import React, { useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useProducts } from '@/hooks/useProducts';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductCardList } from '@/components/products/ProductCardList';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductPagination } from '@/components/products/ProductPagination';
import { ProductStats } from '@/components/products/ProductStats';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { TableSkeleton, CardsSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/types/product';
import productService from '@/services/product.service';
import { getApiErrorMessage } from '@/lib/axios';

function ProductsContent() {
  const {
    products,
    total,
    page,
    pageSize,
    search,
    category,
    sort,
    categories,
    isLoading,
    isSearching,
    isLoadingCategories,
    error,
    refetch,
    setPage,
    setPageSize,
    setCategory,
    setSort,
    setSearch,
    clearFilters,
  } = useProducts();

  const { success, error: toastError } = useToast();

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!productToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      success(
        'Product deleted successfully',
        `"${productToDelete.title}" has been removed from catalog.`
      );
      setProductToDelete(null);
      await refetch();
    } catch (err: unknown) {
      toastError('Failed to delete product', getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Top metrics cards */}
      <ProductStats total={total} products={products} />

      {/* Filter and Search controls */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        isSearching={isSearching}
        onClearFilters={clearFilters}
      />

      {/* Main Content: Loading, Error, Empty, or Table/Cards */}
      {isLoading ? (
        <>
          <div className="hidden md:block">
            <TableSkeleton rows={pageSize > 10 ? 10 : pageSize} />
          </div>
          <div className="md:hidden">
            <CardsSkeleton count={6} />
          </div>
        </>
      ) : error ? (
        <ErrorState
          title="Unable to load products"
          message={error}
          onRetry={refetch}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products match your criteria"
          description={
            search || category !== 'all'
              ? 'Try adjusting your search terms or clearing current category filters.'
              : 'There are currently no products available in the catalog.'
          }
          onClearFilters={clearFilters}
          showClearButton={Boolean(search || category !== 'all' || sort !== 'default')}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ProductTable
              products={products}
              sort={sort}
              onSortChange={setSort}
              onDeleteClick={setProductToDelete}
            />
          </div>

          {/* Mobile Card Grid View */}
          <div className="md:hidden">
            <ProductCardList
              products={products}
              onDeleteClick={setProductToDelete}
            />
          </div>

          {/* Manual Pagination */}
          <ProductPagination
            currentPage={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <DashboardLayout title="Product Inventory">
      <Suspense
        fallback={
          <div>
            <div className="hidden md:block">
              <TableSkeleton rows={10} />
            </div>
            <div className="md:hidden">
              <CardsSkeleton count={6} />
            </div>
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </DashboardLayout>
  );
}
