import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../../components/LanguageSwitcher.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css"; // Reusing the login CSS for consistent styling

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Technician');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Dummy registration logic; replace with your API call as needed
      alert(t("accountRegistered"));
      if (role === "Administrator") {
        navigate('/admin-dashboard');
      } else {
        alert(t("registeredAs") + " " + role);
        // Optionally, navigate to a user-specific page
      }
    } else {
      alert(t("passwordsNotMatch"));
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <LanguageSwitcher />
        <div className="login-content">
          <img src="/MainLogo.png" alt="Main Logo" className="login-logo" />
          <h2 className="text-center">{t("registerTitle")}</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3">
              <label>{t("username")}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>{t("password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>{t("confirmPassword")}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>{t("role")}</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                className="form-select"
              >
                <option value="Technician">{t("technician")}</option>
                <option value="Tester">{t("tester")}</option>
                <option value="Incident-Manager">{t("incidentManager")}</option>
                <option value="Shift-Supervisor">{t("shiftSupervisor")}</option>
                <option value="Administrator">{t("administrator")}</option>
              </select>
            </div>
            <button type="submit" className="login-btn">
              {t("registerButton")}
            </button>
          </form>
          <div className="text-center mt-3">
            <a href="/login" className="text-decoration-none">
              {t("alreadyHaveAccount")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
