// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";

import "./Login.css";

// Define a type for the authenticated user
interface AuthUser {
  email: string;
  role: string;
}

// If your AuthContext doesn’t provide proper types, you can cast it:
const useAuthTyped = () => {
  return useAuth() as {
    setUser: (user: AuthUser) => void;
    // Optionally, you can add: user: AuthUser | null;
  };
};

const Login: React.FC = () => {
  const { setUser } = useAuthTyped();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }
    // Simulate login by setting a dummy user
    setUser({
      email,
      role: "Shift Supervisor",
    });
    // Navigate to a protected route
    navigate("/admin-dashboard");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email or Username</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
