// src/components/Header.tsx
import React from "react";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar?: () => void; // optional callback to open/close a sidebar
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
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

      {/* Right side: logo */}
      <div className="header-right">
        <img src="/logo.png" alt="Company Logo" className="header-logo" />
      </div>
    </header>
  );
};

export default Header;
