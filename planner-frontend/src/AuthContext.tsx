// src/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// AuthUser interface
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

// Define the context type.
interface AuthContextType {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

// Create the context with an initial value of undefined.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the AuthProvider.
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("user");
    const savedPermissions = localStorage.getItem("permissions");

    return savedUser
      ? { ...(JSON.parse(savedUser) as AuthUser), permissions: savedPermissions ? JSON.parse(savedPermissions) : [] }
      : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("permissions", JSON.stringify(user.permissions));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
