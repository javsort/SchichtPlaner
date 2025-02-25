// src/components/Calendar.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { testLogicGate, testAuth, testScheduler } from '../Services/api.ts';

// Ensure baseUrl is a string (fallback to an empty string if not defined)
const baseUrl: string = process.env.REACT_APP_API_BASE_URL || '';

const SideBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3>Shift Planner</h3>
      <nav>
        <ul>
          <li>
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/employee-management">Employees</Link>
          </li>
          <li>
            <Link to="/shift-management">Shifts</Link>
          </li>
          <li>
            <Link to="/shift-approval">Shift Approval</Link>
          </li>
          <li>
            <Link to="/shift-swap">Shift Swap</Link>
          </li>
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
      </nav>
    </div>
  );
};

export default SideBar;
