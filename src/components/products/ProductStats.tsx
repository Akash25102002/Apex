import React from 'react';
import { Package, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductStatsProps {
  total: number;
  products: Product[];
}

export function ProductStats({ total, products }: ProductStatsProps) {
  const lowStockCount = products.filter((p) => p.stock <= 10).length;
  const avgRating =
    products.length > 0
      ? (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length).toFixed(1)
      : '4.8';

  const stats = [
    {
      name: 'Total Products',
      value: total.toLocaleString(),
      change: 'Active in catalog',
      icon: Package,
      iconBg: 'bg-brand-50 text-brand-600',
    },
    {
      name: 'Category Breadth',
      value: '24 Categories',
      change: 'Electronics, Beauty & more',
      icon: Layers,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      name: 'Catalog Avg Rating',
      value: `${avgRating} ★`,
      change: 'Based on customer reviews',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      name: 'Low Stock Alert',
      value: lowStockCount.toString(),
      change: 'Items with ≤ 10 units',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-dropdown transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.name}
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.change}</p>
            </div>
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
