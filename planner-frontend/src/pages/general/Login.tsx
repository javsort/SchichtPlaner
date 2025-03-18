import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher.tsx";
import "./Login.css";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("admin123");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      try {
        // Dummy login logic; replace with your API call as needed
        console.log('Logging in...', { email, password });
        navigate("/shift-view");
      } catch (error) {
        console.error("API Error:", error);
        setErrorMessage(t("errorLoggingIn") || "Error logging in. Please try again.");
      }
    } else {
      setErrorMessage(t("enterValidCredentials") || "Please enter valid credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <LanguageSwitcher />
        <div className="login-content">
          <img src="/MainLogo.png" alt="Main Logo" className="login-logo" />
          <h2>{t("login") || "Shift Planner Login"}</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>{t("email")}</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              {t("loginButton") || "Login"}
            </button>
          </form>
          <div className="text-center mt-3">
            <a href="/register" className="text-decoration-none">
              {t("Register") || " Register"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
