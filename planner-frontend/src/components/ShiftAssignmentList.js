import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testLogicGate, testAuth, testScheduler } from '../Services/api.ts';
import './GlobalSidebar.css';

const GlobalSidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the sidebar open/closed
  const toggleSidebar = () => setOpen(prev => !prev);

  // Close the sidebar and navigate
  const handleLinkClick = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  // Close sidebar after an API test is triggered
  const handleApiTest = (apiFn: () => void) => {
    apiFn();
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger button always visible */}
      <button
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar container: hidden off-screen until open */}
      <div className={`global-sidebar ${open ? 'open' : ''}`}>
        <button 
          className="close-btn" 
          onClick={() => setOpen(false)}
          aria-label="Close Sidebar"
        >
          ×
        </button>
        <h3>Shift Planner</h3>
        <ul>
          <li>
            <Link to="/admin-dashboard" onClick={() => handleLinkClick('/admin-dashboard')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/employee-management" onClick={() => handleLinkClick('/employee-management')}>
              Employee Management
            </Link>
          </li>
          <li>
            <Link to="/shift-management" onClick={() => handleLinkClick('/shift-management')}>
              Shifts Management
            </Link>
          </li>
          <li>
            <Link to="/shift-approval" onClick={() => handleLinkClick('/shift-approval')}>
              Shift Approval
            </Link>
          </li>
          <li>
            <Link to="/shift-view" onClick={() => handleLinkClick('/shift-view')}>
              Company Shift Calendar
            </Link>
          </li>
          <li>
            <Link to="/shift-swap-admin" onClick={() => handleLinkClick('/shift-swap-admin')}>
              Shift Swap Management
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
    </>
  );
};

export default GlobalSidebar;
