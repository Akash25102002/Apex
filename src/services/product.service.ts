import apiClient from '@/lib/axios';
import { productStore } from '@/lib/productStore';
import {
  CategoryItem,
  Product,
  ProductFormData,
  ProductListResponse,
  ProductQueryParams,
} from '@/types/product';
import { getSortApiParams } from '@/utils/url';

export const productService = {
  /**
   * Fetch products with pagination, search, category filter, sorting, and cancellation signal
   */
  async getProducts(params: ProductQueryParams = {}): Promise<ProductListResponse> {
    const page = params.page || 1;
    const limit = params.pageSize || 20;
    const skip = (page - 1) * limit;

    const apiParams: Record<string, string | number> = {
      limit,
      skip,
    };

    // Add server sorting params if selected
    if (params.sort && params.sort !== 'default') {
      const { sortBy, order } = getSortApiParams(params.sort);
      if (sortBy) apiParams.sortBy = sortBy;
      if (order) apiParams.order = order;
    }

    let url = '/products';

    // Route based on search vs category (DummyJSON limitation: search and category cannot be combined on backend)
    if (params.search && params.search.trim()) {
      url = '/products/search';
      apiParams.q = params.search.trim();
    } else if (params.category && params.category !== 'all') {
      url = `/products/category/${encodeURIComponent(params.category)}`;
    }

    const response = await apiClient.get<ProductListResponse>(url, {
      params: apiParams,
      signal: params.signal,
    });

    const data = response.data;
    let products = data.products || [];
    let total = data.total;

    // Filter out locally deleted products from this page
    products = products
      .map((p) => productStore.applyOverrides(p))
      .filter((p): p is Product => p !== null);

    // If search AND category are both selected, refine client-side
    if (params.search && params.category && params.category !== 'all') {
      products = products.filter(
        (p) => p.category.toLowerCase() === params.category!.toLowerCase()
      );
      total = products.length;
    }

    // Include locally added products if they match criteria and we're on the first page
    const localAdded = productStore.getAddedProducts();
    if (localAdded.length > 0) {
      let matchingAdded = localAdded.filter((p) => !productStore.isDeleted(p.id));

      if (params.category && params.category !== 'all') {
        matchingAdded = matchingAdded.filter(
          (p) => p.category.toLowerCase() === params.category!.toLowerCase()
        );
      }

      if (params.search && params.search.trim()) {
        const query = params.search.toLowerCase().trim();
        matchingAdded = matchingAdded.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query)
        );
      }

      total += matchingAdded.length;

      // If on page 1, prepend local added items to display immediately
      if (page === 1) {
        products = [...matchingAdded, ...products].slice(0, limit);
      }
    }

    // Deduct count of deleted items from total
    const deletedCount = productStore.getDeletedIds().length;
    total = Math.max(0, total - deletedCount);

    return {
      products,
      total,
      skip,
      limit,
    };
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id: number | string): Promise<Product> {
    const numId = Number(id);

    // Check if deleted locally
    if (productStore.isDeleted(numId)) {
      const error: any = new Error('Product not found (deleted)');
      error.response = { status: 404, data: { message: 'Product not found' } };
      throw error;
    }

    // Check if added locally
    const localProduct = productStore.getLocalProduct(numId);
    if (localProduct) {
      return localProduct;
    }

    // Fetch from API
    const response = await apiClient.get<Product>(`/products/${numId}`);
    const product = response.data;

    // Apply any local edits
    const overridden = productStore.applyOverrides(product);
    if (!overridden) {
      const error: any = new Error('Product not found');
      error.response = { status: 404, data: { message: 'Product not found' } };
      throw error;
    }

    return overridden;
  },

  /**
   * Fetch list of product categories
   */
  async getCategories(): Promise<CategoryItem[]> {
    const response = await apiClient.get<Array<CategoryItem | string>>('/products/categories');
    const rawCategories = response.data;

    // DummyJSON returns either string[] or CategoryItem[] ({ slug, name, url })
    return rawCategories.map((item) => {
      if (typeof item === 'string') {
        return {
          slug: item,
          name: item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' '),
        };
      }
      return item;
    });
  },

  /**
   * Create new product
   */
  async addProduct(formData: ProductFormData): Promise<Product> {
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      brand: formData.brand?.trim() || 'Generic',
      stock: Number(formData.stock),
      rating: Number(formData.rating || 4.5),
      thumbnail:
        formData.thumbnail?.trim() ||
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      images: formData.images || [
        formData.thumbnail?.trim() ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      ],
    };

    const response = await apiClient.post<Product>('/products/add', payload);
    const createdProduct = response.data;

    // Assign a unique local ID if necessary to prevent collision
    const finalProduct: Product = {
      ...payload,
      id: createdProduct.id || Date.now(),
      rating: payload.rating,
      stock: payload.stock,
      price: payload.price,
    };

    // Store in session store so it reflects in the UI during this session
    productStore.addLocalProduct(finalProduct);

    return finalProduct;
  },

  /**
   * Update existing product
   */
  async updateProduct(id: number, formData: Partial<ProductFormData>): Promise<Product> {
    const numId = Number(id);

    const payload: Record<string, any> = {};
    if (formData.title !== undefined) payload.title = formData.title.trim();
    if (formData.description !== undefined) payload.description = formData.description.trim();
    if (formData.price !== undefined) payload.price = Number(formData.price);
    if (formData.category !== undefined) payload.category = formData.category;
    if (formData.brand !== undefined) payload.brand = formData.brand.trim();
    if (formData.stock !== undefined) payload.stock = Number(formData.stock);
    if (formData.rating !== undefined) payload.rating = Number(formData.rating);
    if (formData.thumbnail !== undefined) payload.thumbnail = formData.thumbnail.trim();

    let updatedProduct: Product;

    // If ID is a locally added item (>= 195), server won't have it, so mock update locally
    if (numId > 194) {
      const existing = productStore.getLocalProduct(numId);
      updatedProduct = {
        ...(existing || ({} as Product)),
        ...payload,
        id: numId,
      };
    } else {
      const response = await apiClient.put<Product>(`/products/${numId}`, payload);
      updatedProduct = response.data;
    }

    // Persist to local session store
    productStore.editLocalProduct(numId, payload);

    return updatedProduct;
  },

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<boolean> {
    const numId = Number(id);

    if (numId <= 194) {
      await apiClient.delete(`/products/${numId}`);
    }

    // Persist deletion to local session store
    productStore.deleteLocalProduct(numId);
    return true;
  },
};

export default productService;
