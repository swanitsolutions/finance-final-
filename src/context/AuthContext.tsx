import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { apiClient } from '../lib/api/apiClient';
import { db } from '../lib/storage/mockDatabase';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  register: (data: { fullName: string; email: string; phone: string; username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: (redirectPath?: string) => void;
  quickSwitchUser: (username: 'priya' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'loanease_auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { showCenterModal } = useNotification();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session on mount (only if previously logged in)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.userId && parsed.token) {
          const freshUser = db.getUserById(parsed.userId);
          if (freshUser) {
            setUser(freshUser);
            setToken(parsed.token);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await apiClient.login(identifier, password);
    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ userId: res.data.user.id, token: res.data.token })
      );
      return { success: true, message: res.message, role: res.data.user.role };
    }
    return { success: false, message: res.message || 'Authentication failed' };
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
  }) => {
    const res = await apiClient.register(data);
    if (res.success && res.data) {
      // Do NOT auto-login to dashboard. User must proceed to login with credentials.
      return {
        success: true,
        message: res.message || 'Registration successful! Please sign in with your credentials.',
      };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = (redirectPath: string = '/') => {
    showCenterModal({
      type: 'warning',
      title: 'Confirm Sign Out',
      message: 'Are you sure you want to sign out of your LoanEase account? You can choose to sign out or stay signed in.',
      buttonText: 'Sign Out',
      secondaryButtonText: 'Stay Signed In',
      onCancel: () => {
        // User cancels - stays signed in
      },
      onConfirm: () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        showCenterModal({
          type: 'success',
          title: 'Signed Out Successfully',
          message: 'You have been safely signed out. Returning to home page...',
          buttonText: 'Return to Home',
          autoCloseMs: 1800,
          onConfirm: () => {
            try {
              navigate(redirectPath, { replace: true });
            } catch {
              window.location.href = redirectPath;
            }
          },
        });
      },
    });
  };

  const quickSwitchUser = (username: 'priya' | 'admin') => {
    const targetUser = db.getUserByEmailOrUsername(username);
    if (targetUser) {
      const targetToken = `jwt_token_${targetUser.id}_demo`;
      setUser(targetUser);
      setToken(targetToken);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId: targetUser.id, token: targetToken }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickSwitchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
