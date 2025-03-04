// src/components/Header.tsx
import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="global-header">
      {/* Remove or comment out the site title line if you don't want it */}
      {/* <h1 className="site-title">Your Site Title</h1> */}
      <img src="/logo.png" alt="Company Logo" className="company-logo" />
    </header>
  );
};

export default Header;
