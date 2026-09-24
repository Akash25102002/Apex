import { Product } from '@/types/product';

const ADDED_KEY = 'admin_local_added_products';
const EDITED_KEY = 'admin_local_edited_products';
const DELETED_KEY = 'admin_local_deleted_products';

export interface LocalProductStore {
  getAddedProducts(): Product[];
  addLocalProduct(product: Product): void;
  getEditedProducts(): Record<number, Partial<Product>>;
  editLocalProduct(id: number, updates: Partial<Product>): void;
  getDeletedIds(): number[];
  deleteLocalProduct(id: number): void;
  isDeleted(id: number): boolean;
  getLocalProduct(id: number): Product | null;
  applyOverrides(product: Product): Product | null;
  clearSession(): void;
}

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write ${key} to sessionStorage`, e);
  }
}

export const productStore: LocalProductStore = {
  getAddedProducts(): Product[] {
    return safeGet<Product[]>(ADDED_KEY, []);
  },

  addLocalProduct(product: Product): void {
    const list = this.getAddedProducts();
    // Prepend so newest appears first
    const updated = [product, ...list.filter((p) => p.id !== product.id)];
    safeSet(ADDED_KEY, updated);
  },

  getEditedProducts(): Record<number, Partial<Product>> {
    return safeGet<Record<number, Partial<Product>>>(EDITED_KEY, {});
  },

  editLocalProduct(id: number, updates: Partial<Product>): void {
    // If it's an added product, update it in addedProducts
    const added = this.getAddedProducts();
    const addedIndex = added.findIndex((p) => p.id === id);
    if (addedIndex !== -1) {
      added[addedIndex] = { ...added[addedIndex], ...updates };
      safeSet(ADDED_KEY, added);
      return;
    }

    // Otherwise record in editedProducts dictionary
    const edited = this.getEditedProducts();
    edited[id] = { ...(edited[id] || {}), ...updates };
    safeSet(EDITED_KEY, edited);
  },

  getDeletedIds(): number[] {
    return safeGet<number[]>(DELETED_KEY, []);
  },

  deleteLocalProduct(id: number): void {
    // Remove from addedProducts if present
    const added = this.getAddedProducts();
    safeSet(ADDED_KEY, added.filter((p) => p.id !== id));

    // Remove from editedProducts if present
    const edited = this.getEditedProducts();
    delete edited[id];
    safeSet(EDITED_KEY, edited);

    // Add to deletedIds
    const deleted = this.getDeletedIds();
    if (!deleted.includes(id)) {
      safeSet(DELETED_KEY, [...deleted, id]);
    }
  },

  isDeleted(id: number): boolean {
    return this.getDeletedIds().includes(id);
  },

  getLocalProduct(id: number): Product | null {
    if (this.isDeleted(id)) return null;

    // Check added products
    const added = this.getAddedProducts();
    const foundAdded = added.find((p) => p.id === id);
    if (foundAdded) return foundAdded;

    return null;
  },

  applyOverrides(product: Product): Product | null {
    if (this.isDeleted(product.id)) return null;
    const edited = this.getEditedProducts();
    if (edited[product.id]) {
      return { ...product, ...edited[product.id] };
    }
    return product;
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(ADDED_KEY);
      sessionStorage.removeItem(EDITED_KEY);
      sessionStorage.removeItem(DELETED_KEY);
    } catch {}
  },
};
