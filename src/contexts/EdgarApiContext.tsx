
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AuthTokens, EdgarCredentials } from '@/types/edgar-api';
import edgarApi from '@/services/edgar-api';

interface EdgarApiContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: EdgarCredentials) => Promise<boolean>;
  logout: () => void;
  setTokensManually: (tokens: AuthTokens) => void;
}

const EdgarApiContext = createContext<EdgarApiContextType | undefined>(undefined);

export const EdgarApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing tokens on mount
  useEffect(() => {
    const hasTokens = edgarApi.hasTokens() || edgarApi.loadStoredTokens();
    setIsAuthenticated(hasTokens);
    setIsLoading(false);
  }, []);

  const login = async (credentials: EdgarCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await edgarApi.generateTokens(credentials);
      
      if (result.success && result.data) {
        setIsAuthenticated(true);
        toast.success('Successfully authenticated with EDGAR API');
        return true;
      } else {
        toast.error(`Authentication failed: ${result.error}`);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during login';
      toast.error(`Authentication error: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    edgarApi.clearTokens();
    setIsAuthenticated(false);
    toast.info('Logged out of EDGAR API');
  };

  const setTokensManually = (tokens: AuthTokens) => {
    edgarApi.setTokens(tokens);
    setIsAuthenticated(true);
    toast.success('API tokens set successfully');
  };

  return (
    <EdgarApiContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        setTokensManually,
      }}
    >
      {children}
    </EdgarApiContext.Provider>
  );
};

export const useEdgarApi = (): EdgarApiContextType => {
  const context = useContext(EdgarApiContext);
  if (context === undefined) {
    throw new Error('useEdgarApi must be used within an EdgarApiProvider');
  }
  return context;
};
