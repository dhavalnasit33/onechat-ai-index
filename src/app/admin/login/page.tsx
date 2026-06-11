'use client';

import { useState, FormEvent } from 'react';
import { useAdminAuth } from '@/src/contexts/AdminAuthContext';
import { Eye, EyeOff, Lock } from 'lucide-react';
import toast from '@/src/hooks/use-toast';

import { Input } from '@/src/components/admin/ui/Input';

export default function AdminLoginPage() {
  const { login, loading, isAuthenticated } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // If already authenticated, redirect (handled by layout, but just in case)
  if (isAuthenticated) {
    if (typeof window !== 'undefined') window.location.href = '/ai-behavior-index/admin';
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      const msg: string = err?.message || 'Login failed';
      const isAccessDenied =
        msg.toLowerCase().includes('access denied') ||
        msg.toLowerCase().includes('permission');

      toast({
        title: isAccessDenied ? 'Access Denied' : 'Login Failed',
        description: msg,
        variant: isAccessDenied ? 'warning' : 'destructive',
        duration: 5000,
      });
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Lock size={24} color="#fff" />
          </div>
          <h1>OneChat AI Admin</h1>
          <p>Sign in to manage your dashboard</p>
        </div>

        {localError && (
          <div className="admin-login-error">{localError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-email">
              Email Address
            </label>
            <Input
              id="admin-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--admin-text-dim)',
            marginTop: 24,
            marginBottom: 0,
          }}
        >
          Powered by OneChat AI
        </p>
      </div>
    </div>
  );
}
