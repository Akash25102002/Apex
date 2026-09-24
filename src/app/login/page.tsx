'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/axios';
import { Eye, EyeOff, Lock, User as UserIcon, Loader2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const redirectUrl = searchParams.get('redirect') || '/products';
  const reason = searchParams.get('reason');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [authLoading, isAuthenticated, router, redirectUrl]);

  useEffect(() => {
    if (reason === 'expired') {
      setErrorMessage('Your session has expired. Please log in again.');
    }
  }, [reason]);

  const validate = () => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFillDemo = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate requests on double-clicks

    setErrorMessage(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({
        username: username.trim(),
        password: password,
      });
      // Redirect to target or products
      router.push(redirectUrl);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setErrorMessage(msg || 'Invalid username or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background glowing ambient elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center card */}
      <div className="m-auto w-full max-w-md p-6 sm:p-8 relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white shadow-lg shadow-brand-500/25 mb-4">
              <span className="font-extrabold text-2xl tracking-tighter">A</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Apex Admin Portal</h1>
            <p className="text-sm text-slate-400 mt-1">
              Sign in to manage product catalogs and inventory
            </p>
          </div>

          {/* Quick Demo Credentials pill */}
          <div className="mb-6 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <p className="font-medium text-slate-200">Demo Credentials:</p>
              <div className="flex gap-2 text-slate-400 mt-0.5 font-mono text-[11px]">
                <span>emilys</span> / <span>emilyspass</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-500/15 text-brand-300 hover:bg-brand-500/25 border border-brand-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-fill
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/70 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) {
                      setFieldErrors((prev) => ({ ...prev, username: undefined }));
                    }
                  }}
                  disabled={isSubmitting}
                  placeholder="Enter your username"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border ${
                    fieldErrors.username
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-brand-500 focus:ring-brand-500/30'
                  } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50`}
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.username}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-950/70 border ${
                    fieldErrors.password
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-brand-500 focus:ring-brand-500/30'
                  } rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.password}</p>
              )}
            </div>

            {/* Sign in Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Apex Admin Dashboard &bull; Powered by DummyJSON API
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
