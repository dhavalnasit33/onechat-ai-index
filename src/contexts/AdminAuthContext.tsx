'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User, AuthResponse } from '@/src/types';
import apiService from '@/src/lib/apiService';
import {
  getToken,
  setToken,
  removeToken,
  getUser as getStoredUser,
  setUser as setStoredUser,
  removeUser as removeStoredUser,
} from '@/src/lib/authUtils';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Fetch current user from the external API
  const fetchCurrentUser = useCallback(async () => {
    const currentToken = getToken();
    if (!currentToken) {
      setLoading(false);
      setUserState(null);
      setAuthToken(null);
      return;
    }

    try {
      const response = await apiService<AuthResponse>('/auth/me', {
        method: 'GET',
      });

      if (response.success && response.user) {
        const effectiveUser: User = {
          ...response.user,
          id: response.user._id || response.user.id,
        };
        setUserState(effectiveUser);
        setStoredUser(effectiveUser);
        setAuthToken(currentToken);
      } else {
        throw new Error(response.message || 'Session expired');
      }
    } catch (err: any) {
      console.error('Failed to verify auth:', err);
      removeToken();
      removeStoredUser();
      setUserState(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      setUserState(storedUser);
      setLoading(false);
      // Re-verify token in background
      fetchCurrentUser();
    } else if (storedToken) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  // Login with the external API
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.success && response.token && response.user) {
          const effectiveUser: User = {
            ...response.user,
            id: response.user._id || response.user.id,
          };
          console.log("effective user", effectiveUser)

          // ── Admin role gate ──
          const isAdmin = Array.isArray(effectiveUser.roles) &&
            effectiveUser.roles.some((r) => r.toLowerCase() === 'admin');
          if (!isAdmin) {
            throw new Error('Access denied. You do not have permission to access the admin panel.');
          }

          setToken(response.token);
          setStoredUser(effectiveUser);
          setAuthToken(response.token);
          setUserState(effectiveUser);
          router.push('/admin');
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (err: any) {
        const msg =
          err.message?.toLowerCase().includes('failed to fetch')
            ? 'Could not connect to the server. Check your internet connection.'
            : err.message || 'Login failed';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Logout
  const logout = useCallback(() => {
    removeToken();
    removeStoredUser();
    setUserState(null);
    setAuthToken(null);
    router.push('/admin/login');
  }, [router]);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
