import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { getApiErrorMessage } from "../../lib/apiClient";
import type { User } from "../../types/api";
import { getCurrentUser, login, logout, signup } from "./authApi";
import type { LoginPayload, SignupPayload } from "./authApi";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  loginUser: (payload: LoginPayload) => Promise<void>;
  signupUser: (payload: SignupPayload) => Promise<void>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loginUser = useCallback(async (payload: LoginPayload) => {
    try {
      const loggedInUser = await login(payload);
      setUser(loggedInUser);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }, []);

  const signupUser = useCallback(async (payload: SignupPayload) => {
    try {
      const createdUser = await signup(payload);
      setUser(createdUser);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }, []);

  const logoutUser = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      loginUser,
      signupUser,
      logoutUser
    }),
    [isBootstrapping, loginUser, logoutUser, signupUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
