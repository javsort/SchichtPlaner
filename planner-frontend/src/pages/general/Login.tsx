// src/pages/general/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.tsx";
import { login } from "../../Services/api.ts";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher.tsx";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Login.css";

// Consistent InfoIcon: White-filled circle with #4da8d6 border and black "i"
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#4da8d6" strokeWidth="1" />
    <path fill="#000000" d="M7.5 12h1V7h-1v5zm0-6h1V5h-1v1z" />
  </svg>
);

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("admin123");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // If using default "password", assume new user and redirect to register page
      if (password === "password") {
        navigate("/register", { state: { email, tempPassword: password } });
        return;
      }
      try {
        const loginInfo = await login(email, password);
        const { role, email: retEmail, token, userId, username, permissions } = loginInfo;
        setUser({ email: retEmail, role, userId, permissions, username });
        navigate("/shift-view");
      } catch (error: any) {
        console.error("API Error:", error.response ? error.response.data : error);
        setErrorMessage(
          error.response?.data?.message ??
            t("loginError", "There was an error logging you in! Please try again.")
        );
      }
    } else {
      setErrorMessage(t("invalidCredentials", "Please enter valid credentials."));
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-content">
          {/* Language Switcher */}
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <LanguageSwitcher />
          </div>
          <img src="/MainLogo.png" alt={t("mainLogo", "Main Logo")} className="login-logo" />
          <h2>{t("shiftPlannerLogin", "Shift Planner Login")}</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>
                {t("email", "Email")}
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="email-tooltip" className="custom-tooltip">
                      {t("enterEmailTooltip", "Enter your email address here.")}
                    </Tooltip>
                  }
                >
                  <span className="tooltip-icon">{<InfoIcon />}</span>
                </OverlayTrigger>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-test-id="email-input"
              />
            </div>
            <div className="form-group">
              <label>
                {t("password", "Password")}
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="password-tooltip" className="custom-tooltip">
                      {t(
                        "passwordTooltip",
                        "Password must be at least 8 characters, include uppercase letters, numbers, and special characters."
                      )}
                    </Tooltip>
                  }
                >
                  <span className="tooltip-icon">{<InfoIcon />}</span>
                </OverlayTrigger>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-test-id="password-input"
              />
            </div>
            <button type="submit" className="login-btn">
              {t("login", "Login")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
