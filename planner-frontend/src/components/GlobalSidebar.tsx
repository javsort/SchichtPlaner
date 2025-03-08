// src/components/GlobalSidebar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testLogicGate, testAuth, testScheduler } from '../Services/api.ts';
import { useAuth } from '../AuthContext.tsx';
import './GlobalSidebar.css';

interface GlobalSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  roles: string[];
}

// Define navigation items with roles that can view them.
const navItems: NavItem[] = [
  { label: 'Employee Management', path: '/employee-management', roles: ['Admin', 'Supervisor'] },
  { label: 'Shift Approval', path: '/shift-approval', roles: ['Admin', 'Supervisor'] },
  { label: 'Shift Swap Admin', path: '/shift-swap-admin', roles: ['Admin', 'Supervisor'] },
  { label: 'Shift Management', path: '/shift-management', roles: ['Admin', 'Supervisor'] },
  { label: 'Shift Availability', path: '/shift-availability', roles: ['Admin', 'Supervisor', 'Employee', 'Tester', 'Technician'] },
  { label: 'Company Shift Calendar', path: '/shift-view', roles: ['Admin', 'Supervisor', 'Employee', 'Tester', 'Technician'] },
  { label: 'Shift Swap', path: '/shift-swap', roles: ['Admin', 'Supervisor', 'Employee', 'Tester', 'Technician'] },
];

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Ensure AuthProvider is wrapping your app.

  const handleLinkClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleApiTest = (apiFn: () => void) => {
    apiFn();
    onClose();
  };

  // Filter navigation items based on the current user's role.
  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className={`global-sidebar ${open ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose} aria-label="Close Sidebar">
        ×
      </button>
      <h3>Shift Planner</h3>
      <ul>
        {filteredNavItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} onClick={() => handleLinkClick(item.path)}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <button onClick={() => handleApiTest(testLogicGate)}>
            Test Logic Gate
          </button>
        </li>
        <li>
          <button onClick={() => handleApiTest(testAuth)}>
            Test Auth Connection
          </button>
        </li>
        <li>
          <button onClick={() => handleApiTest(testScheduler)}>
            Test Scheduler
          </button>
        </li>
      </ul>
    </div>
  );
};

export default GlobalSidebar;
