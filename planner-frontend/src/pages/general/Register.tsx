// src/pages/general/RegisterPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserData, register } from "../../Services/api.ts";
import { useAuth } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher.tsx";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import "./Register.css";

// Define interfaces
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
  return useAuth() as { setUser: (user: AuthUser) => void };
};

// Consistent InfoIcon component
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#4da8d6" strokeWidth="1" />
    <path fill="#000000" d="M7.5 12h1V7h-1v5zm0-6h1V5h-1v1z" />
  </svg>
);

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { setUser } = useAuthTyped();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { state } = useLocation() as { state: { email?: string; tempPassword?: string } };

  // New password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // User metadata from server
  const [userMetadata, setUserMetadata] = useState<UserMetaData | null>(null);

  const getUserMetadata = async (userEmail: string, tempPass: string) => {
    try {
      const data = await getUserData(userEmail, tempPass);
      if (!data) {
        console.error("No data returned from server.");
        return;
      }
      const user: UserMetaData = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
      };
      setUserMetadata(user);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    if (state?.email && state?.tempPassword) {
      getUserMetadata(state.email, state.tempPassword);
    }
  }, [state]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && confirmPassword) {
      if (!userMetadata?.email) {
        alert(t("userMetadataNotLoaded", "User metadata not loaded. Please try again."));
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(t("passwordsDoNotMatch", "Passwords do not match."));
        return;
      }
      if (password === "password") {
        setErrorMessage(t("enterNewPassword", "Please enter a new password."));
        return;
      }
      try {
        const loginInfo = await register(userMetadata.email, password);
        const { role, email: retEmail, userId, username, permissions } = loginInfo;
        setUser({ email: retEmail, role, userId, permissions, username });
        navigate("/shift-view");
      } catch (error: any) {
        console.error("Error during registration:", error);
        setErrorMessage(
          error?.response?.data?.message ||
            t("registrationFailed", "Registration failed. Check console for details.")
        );
      }
    } else {
      setErrorMessage(t("enterNewPassword", "Please enter a new password."));
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="register-card p-4 shadow-lg rounded">
        {/* Language Switcher */}
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-3">
          <img src="/MainLogo.png" alt={t("mainLogo", "Main Logo")} className="login-logo" />
        </div>
        <h2 className="text-center">{t("welcomeEmployee", "Welcome Employee")}</h2>
        <div className="text-center mt-3 mb-3">
          <label>{t("newAccount", "This is a new account.")}</label>
          <label>{t("updatePassword", "You must update your password:")}</label>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group mb-3">
            <label>
              {t("username", "Username")}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="username-tooltip" className="custom-tooltip">
                    {t("usernameTooltip", "This is your assigned username.")}
                  </Tooltip>
                }
              >
                <span className="tooltip-icon">{<InfoIcon />}</span>
              </OverlayTrigger>
            </label>
            <input type="text" value={userMetadata?.username || ''} className="form-control" readOnly />
          </div>
          <div className="form-group mb-3">
            <label>
              {t("email", "Email")}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="email-tooltip" className="custom-tooltip">
                    {t("emailTooltip", "This is your assigned email address.")}
                  </Tooltip>
                }
              >
                <span className="tooltip-icon">{<InfoIcon />}</span>
              </OverlayTrigger>
            </label>
            <input type="text" value={userMetadata?.email || ''} className="form-control" readOnly />
          </div>
          <div className="form-group mb-3">
            <label>
              {t("role", "Role")}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="role-tooltip" className="custom-tooltip">
                    {t("roleTooltip", "Your assigned user role.")}
                  </Tooltip>
                }
              >
                <span className="tooltip-icon">{<InfoIcon />}</span>
              </OverlayTrigger>
            </label>
            <input type="text" value={userMetadata?.role || ''} className="form-control" readOnly />
          </div>
          <div className="form-group mb-3">
            <label>
              {t("newPassword", "New Password")}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="newpassword-tooltip" className="custom-tooltip">
                    {t("newPasswordTooltip", "Choose a strong password (8+ chars, uppercase letters, numbers, special characters).")}
                  </Tooltip>
                }
              >
                <span className="tooltip-icon">{<InfoIcon />}</span>
              </OverlayTrigger>
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
          </div>
          <div className="form-group mb-3">
            <label>
              {t("confirmNewPassword", "Confirm New Password")}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="confirmnewpassword-tooltip" className="custom-tooltip">
                    {t("confirmNewPasswordTooltip", "Re-enter your new password to confirm.")}
                  </Tooltip>
                }
              >
                <span className="tooltip-icon">{<InfoIcon />}</span>
              </OverlayTrigger>
            </label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {t("register", "Register")}
          </button>
        </form>
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">
            {t("alreadyHaveAccount", "Already have an account? Login")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
