"use client";

import { createContext, useContext, useEffect, useState } from "react";
import keycloak from "../lib/keycloak";

interface User {
  sub?: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  exp?: number;
  iat?: number;
  auth_time?: number;
  jti?: string;
  iss?: string;
  aud?: string | string[];
  typ?: string;
  azp?: string;
  nonce?: string;
  session_state?: string;
  acr?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  scope?: string;
}

interface AuthContextType {
  keycloak: typeof keycloak;
  authenticated: boolean;
  user: User | null;
  loading: boolean;
  authError: string | null;
  login: () => void;
  logout: () => void;
  getUserProfile: () => Promise<User | null>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const getUserProfile = async (): Promise<User | null> => {
    if (!keycloak.authenticated) {
      return null;
    }

    try {
      const tokenParsed = keycloak.tokenParsed;
      
      try {
        const userInfo = await keycloak.loadUserInfo();
        return {
          ...tokenParsed,
          ...userInfo,
          name: (userInfo as any).name || tokenParsed?.name,
          email: (userInfo as any).email || tokenParsed?.email,
          preferred_username: (userInfo as any).preferred_username || tokenParsed?.preferred_username,
        };
      } catch (error) {
        return tokenParsed || null;
      }
    } catch (error) {
      return null;
    }
  };

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
        });
        
        setAuthenticated(authenticated);
        if (authenticated) {
          const userProfile = await getUserProfile();
          setUser(userProfile);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      keycloak, 
      authenticated, 
      user, 
      loading, 
      authError,
      login, 
      logout,
      getUserProfile,
      clearAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};