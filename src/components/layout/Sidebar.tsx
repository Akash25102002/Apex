'use client';

import React from 'react';
import Link from 'next/navigation';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Package,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: 'Products',
      href: '/products',
      icon: Package,
      current: pathname === '/products' || pathname.startsWith('/products/'),
    },
    {
      name: 'Add Product',
      href: '/products/new',
      icon: PlusCircle,
      current: pathname === '/products/new',
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-slate-100">
      {/* Top Branding Section */}
      <div>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <NextLink href="/products" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">
                Apex Admin
              </span>
              <span className="text-[10px] uppercase font-semibold text-brand-400 tracking-wider">
                Product Hub
              </span>
            </div>
          </NextLink>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="px-3 py-6 space-y-1.5">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Inventory & Catalog
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NextLink
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  item.current
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-colors',
                      item.current ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.current && <ChevronRight className="h-4 w-4 opacity-75" />}
              </NextLink>
            );
          })}
        </div>

        {/* Quick System Badge */}
        <div className="px-4 mt-2">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>DummyJSON API</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Connected live to DummyJSON catalog endpoints with session synchronization.
            </p>
          </div>
        </div>
      </div>

      {/* User info & Logout at bottom */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3 mb-3">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.firstName}
              className="h-10 w-10 rounded-full border border-slate-700 object-cover bg-slate-800"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-400 truncate">@{user?.username}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all focus:outline-none"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-64 md:flex-col border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer container */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
