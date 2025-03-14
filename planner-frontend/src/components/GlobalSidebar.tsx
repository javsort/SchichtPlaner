import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import { FiLogOut } from "react-icons/fi"; // Import the logout icon
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
  { labelKey: "employeeManagement", path: "/employee-management", roles: ["Admin", "ShiftSupervisor"] },
  { labelKey: "shiftApproval", path: "/shift-approval", roles: ["Admin", "ShiftSupervisor"] },
  { labelKey: "Requests", path: "/shift-swap-admin", roles: ["Admin", "ShiftSupervisor"] },
  { labelKey: "shiftManagement", path: "/shift-management", roles: ["Admin", "ShiftSupervisor"] },
  { labelKey: "shiftAvailability", path: "/shift-availability", roles: ["Admin", "ShiftSupervisor", "Employee", "Tester", "Technician"] },
  { labelKey: "Calendar", path: "/shift-view", roles: ["Admin", "ShiftSupervisor", "Employee", "Tester", "Technician"] },
  { labelKey: "shiftSwap", path: "/shift-swap", roles: ["Admin", "ShiftSupervisor", "Employee", "Tester", "Technician"] }
];

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleLinkClick = (path: string) => {
    navigate(path);
    onClose();
  };

  // Handle logout by clearing localStorage (or call your AuthContext logout function)
  const handleLogout = () => {
    localStorage.removeItem("user"); // Or call your logout function
    localStorage.removeItem("token");
    localStorage.removeItem("lang");
    localStorage.removeItem("userId");
    navigate("/login");
    onClose();
  };

  // Filter items based on user role
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
      {/* Logout button placed at the bottom */}
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
