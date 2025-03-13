// src/components/Header.tsx
import React from "react";
import LanguageSwitcher from "./LanguageSwitcher.tsx";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  // Removed: const { t } = useTranslation();

  return (
    <header className="header-container">
      {/* Left side: hamburger button */}
      <div className="header-left">
        {onToggleSidebar && (
          <button
            className="hamburger-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        )}
      </div>

      {/* Right side: logo and language switcher */}
      <div className="header-right">
        <div className="header-right-inner" style={{ marginRight: "50px" }}>
          <LanguageSwitcher />
        </div>
        <img
          src="/logo.png"
          alt="Company Logo"
          className="header-logo"
          style={{ marginLeft: "50px", cursor: "pointer" }}
          onClick={() => window.location.href = "/shift-view"}
        />
      </div>
    </header>
  );
};

export default Header;
