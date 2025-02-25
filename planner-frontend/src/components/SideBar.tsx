// src/components/Calendar.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { testLogicGate, testAuth, testScheduler } from '../Services/api.ts';

// Ensure baseUrl is a string (fallback to an empty string if not defined)
const baseUrl: string = process.env.REACT_APP_API_BASE_URL || '';

const SideBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-nav">
          <li>
            <button onClick={() => navigate('/employee-management')} className="sidebar-btn">
              Employee Management
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/shift-management')} className="sidebar-btn">
              Shift Management
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/shift-view')} className="sidebar-btn">
              Company Shift Calendar
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/shift-approval')} className="sidebar-btn">
              Shift Approval
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/shift-availability')} className="sidebar-btn">
              Shift Availability
            </button>
          </li>

          {/* Buttons to test the backend connection */}
          <li>
            <button type="button" onClick={testLogicGate} className="action-btn">
              Test Logic Gate Connection
            </button>
          </li>
          {/* Duplicate button for testing auth */}
          <li>
            <button type="button" onClick={testAuth} className="action-btn">
              Test Auth Connection
            </button>
          </li>
          {/* Duplicate button for testing scheduler */}
          <li>
            <button type="button" onClick={testScheduler} className="action-btn">
              Test Scheduler Connection
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SideBar;