// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.tsx";
import { login } from "../../Services/api.ts";
import "../styling/Login.css";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

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
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("admin123");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      console.log('Logging in...', { email, password });
      console.log('API Base URL:', baseUrl);

      try {
        const loginInfo = await login(email, password);
        const retRole = loginInfo.role;
        const retEmail = loginInfo.email;
        const token = loginInfo.token;

        console.log('Email:', retEmail);
        console.log('Role:', retRole);
        console.log("Token:", token);

        setUser({ email: retEmail, role: retRole });

        if (retRole === 'ShiftSupervisor') {
          navigate('/admin-dashboard');
        } else if (retRole === 'Admin') {
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
      } catch (error: any) {
        console.error('API Error:', error.response ? error.response.data : error);
        setErrorMessage(
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'There was an error logging you in! Please try again.'
        );
        // Optionally, you can navigate to a "not-authorized" page:
        // navigate('/not-authorized');
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
