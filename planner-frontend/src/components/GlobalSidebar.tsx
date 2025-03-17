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
  permission: string;
}

const navItems: NavItem[] = [
  { labelKey: "employeeManagement", path: "/employee-management", permission: "EMPLOYEE_MANAGEMENT" },
  { labelKey: "roleManagement", path: "/role-management", permission: "ROLE_MANAGEMENT" },
  { labelKey: "shiftApproval", path: "/shift-approval", permission: "PROPOSAL_APPROVAL" },
  { labelKey: "Requests", path: "/shift-swap-admin", permission: "SWAP_APPROVAL" },
  { labelKey: "shiftManagement", path: "/shift-management", permission: "SHIFT_MANAGEMENT" },
  { labelKey: "shiftAvailability", path: "/shift-availability", permission: "SHIFT_PROPOSAL" },
  { labelKey: "Calendar", path: "/shift-view", permission: "CALENDAR_VIEW" },
  { labelKey: "shiftSwap", path: "/shift-swap", permission: "SWAP_PROPOSAL" }
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
    (item) => user && user.permissions?.includes(item.permission)
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
