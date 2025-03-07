// src/pages/general/Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.tsx";
import { login } from "../../Services/api.ts";

import "./Login.css";

interface AuthUser {
  email: string;
  role: string;
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
      try {
        const loginInfo = await login(email, password);
        const { role, email: retEmail, token } = loginInfo;

        console.log("Logged in:", { retEmail, role, token });
        setUser({ email: retEmail, role });

        // Navigate based on role
        if (role === "ShiftSupervisor" || role === "Admin") {
          navigate("/admin-dashboard");
        } else if (role === "Tester") {
          navigate("/tester-dashboard");
        } else if (role === "Incident-manager") {
          navigate("/incident-manager-dashboard");
        } else if (role === "Technician") {
          navigate("/shift-view");
        } else {
          setErrorMessage("There was an error logging you in! Please try again.");
        }
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
