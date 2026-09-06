import React, { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { AuthAccessCheck } from '../../lib/firebase';

interface AuthContextType {
  user: User | null;
  authAccess: AuthAccessCheck | null;
  isSuperAdmin: boolean;
  logout: () => Promise<void>;
  openWhitelistModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authAccess: null,
  isSuperAdmin: false,
  logout: async () => {},
  openWhitelistModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        authAccess: {
          isAllowed: true,
          isSuperAdmin: true,
          role: 'admin',
        },
        isSuperAdmin: true,
        logout: async () => {},
        openWhitelistModal: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
