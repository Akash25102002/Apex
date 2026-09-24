export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatStockStatus(stock: number): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  if (stock <= 0) {
    return {
      label: 'Out of Stock',
      badgeClass: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
      dotClass: 'bg-rose-500',
    };
  }
  if (stock <= 10) {
    return {
      label: `Low Stock (${stock})`,
      badgeClass: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
      dotClass: 'bg-amber-500',
    };
  }
  return {
    label: `In Stock (${stock})`,
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    dotClass: 'bg-emerald-500',
  };
}

export function getDiscountedPrice(price: number, discountPercentage?: number): number {
  if (!discountPercentage || discountPercentage <= 0) return price;
  return price * (1 - discountPercentage / 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
