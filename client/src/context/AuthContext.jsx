import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.api';
import { TOKEN_KEY } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  // Restore the session on page load; the server decides whether the token is still valid.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    authApi
      .getCurrentUser()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => {
    const startSession = ({ user: authUser, token }) => {
      localStorage.setItem(TOKEN_KEY, token);
      setUser(authUser);
      return authUser;
    };

    return {
      user,
      loading,
      login: async (credentials) => startSession(await authApi.login(credentials)),
      register: async (payload) => startSession(await authApi.register(payload)),
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      },
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
