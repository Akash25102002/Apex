'use client';

import React, { useState, useRef, useEffect } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu,
  Plus,
  ChevronDown,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobile: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({ onOpenMobile, title = 'Products', subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine breadcrumb label
  const isDetails = pathname.startsWith('/products/') && pathname !== '/products/new' && !pathname.endsWith('/edit');
  const isEdit = pathname.endsWith('/edit');
  const isNew = pathname === '/products/new';

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Menu button + Title & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobile}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          {/* Breadcrumb nav */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0.5">
            <NextLink href="/products" className="hover:text-slate-700 flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              <span>Catalog</span>
            </NextLink>
            {isNew && (
              <>
                <span>/</span>
                <span className="text-slate-700">Add New</span>
              </>
            )}
            {isDetails && (
              <>
                <span>/</span>
                <span className="text-slate-700">Details</span>
              </>
            )}
            {isEdit && (
              <>
                <span>/</span>
                <span className="text-slate-700">Edit</span>
              </>
            )}
          </nav>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* "+ Add Product" quick action on /products */}
        {pathname === '/products' && (
          <NextLink
            href="/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
          </NextLink>
        )}

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.firstName}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover bg-slate-100"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Admin</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200/80 shadow-dropdown py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <div className="px-4 py-1.5 flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Authenticated via DummyJSON</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
