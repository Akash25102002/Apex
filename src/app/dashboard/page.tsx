'use client';

import React from 'react';
import NextLink from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Tag,
  Star,
  PlusCircle,
  ExternalLink,
  Layers,
  Activity,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export default function DashboardOverviewPage() {
  const kpis = [
    {
      title: 'Total Revenue',
      value: '$124,592.00',
      change: '+14.2%',
      isPositive: true,
      timeframe: 'vs last month',
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: 'Active Inventory',
      value: '194 Products',
      change: '+8 new',
      isPositive: true,
      timeframe: 'in 24 categories',
      icon: Package,
      color: 'bg-brand-500/10 text-brand-600',
    },
    {
      title: 'Total Orders',
      value: '3,842',
      change: '+5.6%',
      isPositive: true,
      timeframe: 'this quarter',
      icon: ShoppingCart,
      color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      title: 'Satisfaction Score',
      value: '4.89 / 5.0',
      change: '+0.12',
      isPositive: true,
      timeframe: 'from 1,240 reviews',
      icon: Star,
      color: 'bg-amber-500/10 text-amber-600',
    },
  ];

  const salesTrend = [
    { month: 'Jan', revenue: 65, height: 'h-[65%]' },
    { month: 'Feb', revenue: 50, height: 'h-[50%]' },
    { month: 'Mar', revenue: 75, height: 'h-[75%]' },
    { month: 'Apr', revenue: 85, height: 'h-[85%]' },
    { month: 'May', revenue: 70, height: 'h-[70%]' },
    { month: 'Jun', revenue: 95, height: 'h-[95%]' },
    { month: 'Jul', revenue: 90, height: 'h-[90%]' },
    { month: 'Aug', revenue: 110, height: 'h-[100%]' },
    { month: 'Sep', revenue: 80, height: 'h-[80%]' },
  ];

  const categoryBreakdown = [
    { name: 'Beauty & Fragrances', count: 48, percentage: 35, color: 'bg-brand-500' },
    { name: 'Smartphones & Laptops', count: 34, percentage: 25, color: 'bg-indigo-500' },
    { name: 'Furniture & Decor', count: 28, percentage: 20, color: 'bg-emerald-500' },
    { name: 'Groceries & Household', count: 22, percentage: 15, color: 'bg-amber-500' },
    { name: 'Automotive & Motorcycle', count: 12, percentage: 5, color: 'bg-rose-500' },
  ];

  const recentTransactions = [
    {
      id: 'ORD-9841',
      customer: 'Sophia Turner',
      product: 'Essence Mascara Lash Princess',
      category: 'Beauty',
      amount: '$9.99',
      status: 'Completed',
      statusClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'ORD-9840',
      customer: 'Liam Chen',
      product: 'Apple MacBook Pro 14',
      category: 'Laptops',
      amount: '$1,999.00',
      status: 'Processing',
      statusClass: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'ORD-9839',
      customer: 'Emma Davis',
      product: 'Calvin Klein CK One',
      category: 'Fragrances',
      amount: '$79.00',
      status: 'Completed',
      statusClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'ORD-9838',
      customer: 'Noah Wilson',
      product: 'Wooden Dinning Table',
      category: 'Furniture',
      amount: '$549.99',
      status: 'Dispatched',
      statusClass: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <DashboardLayout title="Executive Overview" subtitle="Real-time DummyJSON analytics and inventory metrics">
      <div className="space-y-6">
        {/* Banner with quick actions */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-card border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
              <Activity className="h-3.5 w-3.5" />
              <span>Live Inventory Engine Active</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back to Apex Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Your product catalog is synced with DummyJSON API. Manage, filter, add, and monitor products across all 24 categories.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <NextLink
                href="/products"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20"
              >
                <Package className="h-4 w-4" />
                <span>Manage Products</span>
              </NextLink>
              <NextLink
                href="/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Product</span>
              </NextLink>
            </div>
          </div>
        </div>

        {/* 4 KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.title}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-dropdown transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {kpi.title}
                  </p>
                  <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {kpi.value}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <span
                      className={`inline-flex items-center font-bold ${
                        kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {kpi.isPositive ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {kpi.change}
                    </span>
                    <span className="text-slate-400">{kpi.timeframe}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Trend Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Revenue & Sales Velocity
                </h3>
                <p className="text-xs text-slate-400">Monthly sales volume (USD in thousands)</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                2026 Fiscal Year
              </span>
            </div>

            {/* Custom SVG/Bar Visualizer */}
            <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100">
              {salesTrend.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full ${item.height} bg-gradient-to-t from-brand-600 to-teal-400 rounded-t-xl transition-all duration-500 group-hover:from-brand-500 group-hover:to-teal-300`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-2 block">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 text-xs text-slate-500">
              <span>Avg Monthly Revenue: <strong>$79,200</strong></span>
              <span className="text-emerald-600 font-semibold">+18.4% YoY Peak Growth</span>
            </div>
          </div>

          {/* Category Distribution (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                Category Distribution
              </h3>
              <p className="text-xs text-slate-400 mb-5">Product share by top industry groups</p>

              <div className="space-y-3.5">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                      <span className="text-slate-400 font-mono">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-4">
              <NextLink
                href="/products"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <span>View Full 24 Categories</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </NextLink>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recent Orders & Product Activity
              </h3>
              <p className="text-xs text-slate-400">Transactions processed in the last 24 hours</p>
            </div>
            <NextLink
              href="/products"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Explore Catalog</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </NextLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">{tx.id}</td>
                    <td className="py-3 px-3 text-slate-800 font-medium">{tx.customer}</td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-xs">{tx.product}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{tx.amount}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.statusClass}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
