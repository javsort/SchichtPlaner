// src/components/GlobalSidebar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testLogicGate, testAuth, testScheduler } from '../Services/api.ts';
import './GlobalSidebar.css';

interface GlobalSidebarProps {
  open: boolean;
  onClose: () => void;
}

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleApiTest = (apiFn: () => void) => {
    apiFn();
    onClose();
  };

  return (
    <div className={`global-sidebar ${open ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose} aria-label="Close Sidebar">
        ×
      </button>
      <h3>Shift Planner</h3>
      <ul>
        <li>
          <Link to="/employee-management" onClick={() => handleLinkClick('/employee-management')}>
            Employee Management
          </Link>
        </li>
        <li>
          <Link to="/shift-approval" onClick={() => handleLinkClick('/shift-approval')}>
            Shift Approval
          </Link>
        </li>
        <li>
          <Link to="/shift-swap-admin" onClick={() => handleLinkClick('/shift-swap-admin')}>
            Shift Swap Admin
          </Link>
        </li>
        <li>
          <Link to="/shift-management" onClick={() => handleLinkClick('/shift-management')}>
            Shift Management
          </Link>
        </li>
        <li>
          <Link to="/shift-availability" onClick={() => handleLinkClick('/shift-availability')}>
            Shift Availability
          </Link>
        </li>
        <li>
          <Link to="/shift-view" onClick={() => handleLinkClick('/shift-view')}>
            Company Shift Calendar
          </Link>
        </li>
        <li>
          <Link to="/shift-swap" onClick={() => handleLinkClick('/shift-swap')}>
            Shift Swap
          </Link>
        </li>
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
