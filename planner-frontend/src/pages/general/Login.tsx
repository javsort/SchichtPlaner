// src/pages/general/Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.tsx";
import { login } from "../../Services/api.ts";

import "./Login.css";

interface AuthUser {
  userId: number;
  username: string;
  email: string;
  role: string;
  permissions: string;
}

const useAuthTyped = () => {
  return useAuth() as {
    setUser: (user: AuthUser) => void;
  };
};

const Login: React.FC = () => {
  const { setUser } = useAuthTyped();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("admin123");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {

      // this is a new user, send to the register page
      if (password === "password") {
        console.log("New user detected, sending to register page...");
        navigate("/register", { 
          state: { email: email, tempPassword: password }
        });
        return;
      }

      console.log('Logging in...', { email, password });

      try {
        const loginInfo = await login(email, password);
        
        const retRole = loginInfo.role;
        const retEmail = loginInfo.email;
        const token = loginInfo.token;
        const userId = loginInfo.userId;
        const username = loginInfo.username;
        const permissions = Array.isArray(loginInfo.permissions) ? loginInfo.permissions : [];
        
        console.log('Email:', retEmail);
        console.log('Role:', retRole);
        console.log('Id:', userId);
        console.log("Token: '" +  token + "'");
        console.log("Permissions: '" +  permissions + "'");
        console.log("Username: '" +  username + "'");

        setUser({ email: retEmail, role: retRole, userId: userId, permissions: permissions, username: username });

        // Instead of navigating based on role, always redirect to the Company Shift Calendar page.
        navigate("/shift-view");
      } catch (error: any) {
        console.error("API Error:", error.response ? error.response.data : error);
        setErrorMessage(
          error.response?.data?.message ??
            "There was an error logging you in! Please try again."
        );
      }
    } else {
      setErrorMessage("Please enter valid credentials.");
    }
  };

  return (
    <div className="login-page">
      {/* The larger white box */}
      <div className="login-box">
        {/* The narrower content wrapper */}
        <div className="login-content">
          <img src="/MainLogo.png" alt="Main Logo" className="login-logo" />
          <h2>Shift Planner Login</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
