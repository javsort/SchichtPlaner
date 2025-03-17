// src/components/GlobalSidebar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import { FiLogOut } from "react-icons/fi";
import "./GlobalSidebar.css";

interface GlobalSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  labelKey: string;
  path: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { labelKey: "employeeManagement", path: "/employee-management", roles: ["Admin", "Shift-Supervisor"] },
  { labelKey: "shiftApproval", path: "/shift-approval", roles: ["Admin", "Shift-Supervisor"] },
  { labelKey: "Requests", path: "/shift-swap-admin", roles: ["Admin", "Shift-Supervisor"] },
  { labelKey: "shiftManagement", path: "/shift-management", roles: ["Admin", "Shift-Supervisor"] },
  { labelKey: "shiftAvailability", path: "/shift-availability", roles: ["Admin", "Shift-Supervisor", "Employee", "Tester", "Technician"] },
  { labelKey: "Calendar", path: "/shift-view", roles: ["Admin", "Shift-Supervisor", "Employee", "Tester", "Technician"] },
  { labelKey: "shiftSwap", path: "/shift-swap", roles: ["Admin", "Shift-Supervisor", "Employee", "Tester", "Technician"] },
  { labelKey: "employeeReport", path: "/employee-report", roles: ["Admin", "Shift-Supervisor", "Employee"] },
  { labelKey: "employeeICS", path: "/employee-ics", roles: ["Admin", "Shift-Supervisor", "Employee"] },
];

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleLinkClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("lang");
    localStorage.removeItem("userId");
    navigate("/login");
    onClose();
  };

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className={`global-sidebar ${open ? "open" : ""}`}>
      <h3>{t("shiftPlanner") || "Shift Planner"}</h3>
      <ul className="nav-list">
        {filteredNavItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} onClick={() => handleLinkClick(item.path)}>
              {t(item.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          <span>
            <FiLogOut style={{ marginRight: "8px" }} />
          </span>
          {typeof t("logout") === "string" ? t("logout") : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default GlobalSidebar;
