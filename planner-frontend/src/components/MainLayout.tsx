// src/components/MainLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import GlobalSidebar from "./GlobalSidebar.tsx";
import Header from "./Header.tsx";
import "./MainLayout.css";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="main-layout">
      <Header onToggleSidebar={toggleSidebar} />
      <GlobalSidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="main-content" onClick={closeSidebar}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
