import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, IndustryProfile } from '../types';
import { authApi, industriesApi } from '../api';

interface AuthContextType {
  user: User | null;
  profile: IndustryProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string, mfaCode?: string) => Promise<void>;
  register: (data: { email: string; industryName: string; category: string; gstin: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchRoleForDemo: (role: 'industry' | 'admin') => void;
  setMockVerificationStatus: (status: 'pending' | 'approved' | 'rejected' | 'suspended', reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<IndustryProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfileForUser = async (u: User) => {
    if (u.industryId) {
      try {
        const ind = await industriesApi.getProfile(u.industryId);
        setProfile(ind);
      } catch (e) {
        console.error('Failed to load industry profile', e);
      }
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await fetchProfileForUser(currentUser);
        } else {
          // Provide default logged in demo user for immediate seamless review
          const defaultDemoUser: User = {
            id: 'user-01',
            email: 'sustainability@kotharibio.in',
            role: 'industry',
            industryId: 'ind-demo-current',
            industryName: 'Kothari Bio-Energy & Allied Industries',
            isMfaEnabled: true,
            createdAt: '2024-04-10T10:00:00Z',
          };
          setUser(defaultDemoUser);
          await fetchProfileForUser(defaultDemoUser);
        }
      } catch (err) {
        console.error('Auth initialization error', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password?: string, mfaCode?: string) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authApi.login(email, password, mfaCode);
      setUser(loggedInUser);
      await fetchProfileForUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; industryName: string; category: string; gstin: string }) => {
    setIsLoading(true);
    try {
      const { user: registeredUser } = await authApi.register(data);
      setUser(registeredUser);
      await fetchProfileForUser(registeredUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.industryId) {
      const ind = await industriesApi.getProfile(user.industryId);
      setProfile(ind);
    }
  };

  const switchRoleForDemo = (role: 'industry' | 'admin') => {
    if (role === 'admin') {
      const adminUser: User = {
        id: 'admin-01',
        email: 'tnpcb.nodal@tn.gov.in',
        role: 'admin',
        isMfaEnabled: true,
        createdAt: '2023-01-01T00:00:00Z',
      };
      setUser(adminUser);
      setProfile(null);
    } else {
      const industryUser: User = {
        id: 'user-01',
        email: 'sustainability@kotharibio.in',
        role: 'industry',
        industryId: 'ind-demo-current',
        industryName: 'Kothari Bio-Energy & Allied Industries',
        isMfaEnabled: true,
        createdAt: '2024-04-10T10:00:00Z',
      };
      setUser(industryUser);
      fetchProfileForUser(industryUser);
    }
  };

  const setMockVerificationStatus = (status: 'pending' | 'approved' | 'rejected' | 'suspended', reason?: string) => {
    if (profile) {
      setProfile({
        ...profile,
        status,
        rejectionReason: reason,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        switchRoleForDemo,
        setMockVerificationStatus,
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
