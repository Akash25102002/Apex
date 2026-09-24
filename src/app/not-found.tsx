import Link from 'next/link';
import { PackageX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 ring-8 ring-brand-50/50">
        <PackageX className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        The dashboard view you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    </div>
  );
}
