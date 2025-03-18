import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate for redirection
import { getUserData, register } from "../../Services/api.ts";
import { useAuth } from "../../AuthContext.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Optional: Custom styles

interface AuthUser {
  userId: number;
  username: string;
  email: string;
  role: string;
  permissions: string;
}

interface UserMetaData {
  userId: number;
  username: string;
  email: string | null;
  role: string;
}

const useAuthTyped = () => {
  return useAuth() as {
    setUser: (user: AuthUser) => void;
  };
};

const RegisterPage: React.FC = () => {
  const { setUser } = useAuthTyped();
  const navigate = useNavigate(); // Initialize the navigation hook
  
  const { state } = useLocation() as {
    state: {
      email?: string;
      tempPassword?: string;
    };
  };

  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userMetadata, setUserMetadata] = useState<UserMetaData | null>(null);


  const getUserMetadata = async (userEmail: string, tempPass: string) => {
    try {
      const response = await getUserData(userEmail, tempPass);
  
      const data = response.data;
  
      const user: UserMetaData = {
        userId: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      };
  
      setUserMetadata(user);

      console.log('User Metadata:', user);
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error);
    }
  };

  useEffect(() => {
    if (state?.email && state?.tempPassword) {
      getUserMetadata(state.email, state.tempPassword);
    }
  }, [state]);

  /*const handleRegister = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Proceed with registration logic (e.g., API call)
      alert('Account registered successfully!');
      
      const loginInfo = await register(userMetadata.email, password);

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

    } else {
      alert('Passwords do not match.');
    }
  };*/
  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="register-card p-4 shadow-lg rounded">
        <h2 className="text-center">Welcome Employee</h2>
        <div className="text-center mt-3 mb-3">
          <label>This is a new account.</label>
          <label>You must update your password:</label>

        </div>
        <form onSubmit={handleRegister}>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              value={userMetadata?.username}
              className="form-control"
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="text"
              value={userMetadata?.email}
              className="form-control"
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label>Role</label>
            <input
              type="text"
              value={userMetadata?.role}
              className="form-control"
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
