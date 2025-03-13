// src/components/GlobalSidebar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { testLogicGate, testAuth, testScheduler } from "../Services/api.ts";
import { useAuth } from "../AuthContext.tsx";
import { useTranslation } from "react-i18next";
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
  { labelKey: "shiftSwapAdmin", path: "/shift-swap-admin", roles: ["Admin", "Shift-Supervisor"] },
  { labelKey: "shiftManagement", path: "/shift-management", roles: ["Admin", "Shift-Supervisor"] },
  { labelKey: "shiftAvailability", path: "/shift-availability", roles: ["Employee", "Tester", "Technician", "Incident-Manager"] },
  { labelKey: "companyShiftCalendar", path: "/shift-view", roles: ["Admin", "Shift-Supervisor", "Employee", "Tester", "Technician", "Incident-Manager"] },
  { labelKey: "shiftSwap", path: "/shift-swap", roles: ["Employee", "Tester", "Technician", "Incident-Manager"] }
];

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleLinkClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleApiTest = (apiFn: () => void) => {
    apiFn();
    onClose();
  };

  // Filter items based on user role
  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className={`global-sidebar ${open ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose} aria-label={t("closeSidebar") || "Close Sidebar"}>
        ×
      </button>
      <h3>{t("shiftPlanner") || "Shift Planner"}</h3>
      <ul>
        {filteredNavItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} onClick={() => handleLinkClick(item.path)}>
              {t(item.labelKey)}
            </Link>
          </li>
        ))}
        <li>
          <button onClick={() => handleApiTest(testLogicGate)}>
            {t("testLogicGate") || "Test Logic Gate"}
          </button>
        </li>
        <li>
          <button onClick={() => handleApiTest(testAuth)}>
            {t("testAuthConnection") || "Test Auth Connection"}
          </button>
        </li>
        <li>
          <button onClick={() => handleApiTest(testScheduler)}>
            {t("testScheduler") || "Test Scheduler"}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default GlobalSidebar;
