// src/pages/Login.tsx
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.tsx";
import { login } from "../../Services/api.ts";

import "./Login.css";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

// Define a type for the authenticated user
interface AuthUser {
  userId: number;
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
  const [errorMessage, setErrorMessage] = useState(''); 
  const [email, setEmail] = useState<string>("technician@example.com");
  const [password, setPassword] = useState<string>("technician123");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simulate authentication (replace with your authentication logic)
    if (email && password) {
      console.log('Logging in...', { email, password });

      console.log('API Base URL:', baseUrl);

      try {
        const loginInfo = await login(email, password);
        
        const retRole = loginInfo.role;
        const retEmail = loginInfo.email;
        const token = loginInfo.token;
        const userId = loginInfo.userId;
        
        console.log('Email:', retEmail);
        console.log('Role:', retRole);
        console.log('Id:', userId);
        console.log("Token: '" +  token + "'");

        setUser({ email: retEmail, role: retRole, userId: userId });

        if (retRole === 'ShiftSupervisor') {
          navigate('/admin-dashboard');
        } else if (retRole === 'Admin') {      // THis one is done so far
          navigate('/admin-dashboard');
        } else if (retRole === 'Tester') {
          navigate('/tester-dashboard');
        } else if (retRole === 'Incident-manager') {
          navigate('/incident-manager-dashboard');
        } else if (retRole === 'Technician') {   
          navigate('/shift-view');
        } else {
          setErrorMessage('There was an error logging you in! Please try again.');
        }

      } catch {
        console.error('API Error:', Error);
        navigate('/not-authorized');
        
      }

    } else {
      setErrorMessage('Please enter valid credentials.');
    }
  };

  return (
    <div className="login-container">
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
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
