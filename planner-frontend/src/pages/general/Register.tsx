import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate for redirection
import { getUserData, register } from "../../Services/api.ts";
import { useAuth } from "../../AuthContext.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Optional: Custom styles

interface AuthUser {
  userId: string;
  username: string;
  email: string;
  role: string;
  permissions: string;
}

interface UserMetaData {
  userId: string;
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
  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState("");
  const { state } = useLocation() as {
    state: {
      email?: string;
      tempPassword?: string;
    };
  };

  // New password fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Stores user metadata from the server
  const [userMetadata, setUserMetadata] = useState<UserMetaData | null>(null);

  // Fetch metadata using the temporary password
  const getUserMetadata = async (userEmail: string, tempPass: string) => {
    try {
      const data = await getUserData(userEmail, tempPass);
      if (!data) {
        console.error("No data returned from server on second call.");
        return; // Stop here so you don't try to parse undefined
      }
      
      const user: UserMetaData = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role
      };
      
      setUserMetadata(user);
      console.log("User Metadata:", user);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  let hasFetched = false;

  useEffect(() => {
    if (!hasFetched && state?.email && state?.tempPassword) {
      hasFetched = true;
      getUserMetadata(state.email, state.tempPassword);
    }
  }, [state]);

  // Re-enable this function so registration is actually called:
  const handleRegister = async (e: React.FormEvent) => {

    if (password && confirmPassword) {
      e.preventDefault();

      // Make sure user metadata is loaded
      if (!userMetadata?.email) {
        console.error("User metadata not loaded.");
        alert("User metadata not loaded. Please try again.");
        return;
      }

      // Check that new passwords match
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      if (password === "password") {
        setErrorMessage("Please enter a new password.");
        return;
      }

      try {
        const loginInfo = await register(userMetadata.email, password);

        console.log("Registration response:", loginInfo);

        const retRole = loginInfo.role; 
        const retEmail = loginInfo.email;
        const token = loginInfo.token;
        const userId = loginInfo.userId;
        const username = loginInfo.username;
        const permissions = Array.isArray(loginInfo.permissions)
          ? loginInfo.permissions
          : [];

        // Save that data in context so the user is effectively "logged in"
        setUser({
          email: retEmail,
          role: retRole,
          userId,
          permissions,
          username
        });

        // Then navigate them into your main app
        navigate("/shift-view");
      } catch (error: any) {
        console.error("Error during registration:", error);
        setErrorMessage(
          error?.response?.data?.message ||
            "Registration failed. Check console for details."
        );
      }
    } else {
      setErrorMessage("Please enter a new password.");
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="register-card p-4 shadow-lg rounded">
        <h2 className="text-center">Welcome Employee</h2>
        <div className="text-center mt-3 mb-3">
          <label>This is a new account.</label>
          <label>You must update your password:</label>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              value={userMetadata?.username || ''}
              className="form-control"
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="text"
              value={userMetadata?.email || ''}
              className="form-control"
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label>Role</label>
            <input
              type="text"
              value={userMetadata?.role || ''}
              className="form-control"
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
