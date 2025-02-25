// src/components/Calendar.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { testLogicGate, testAuth, testScheduler } from '../Services/api.ts';
import './SideBar.css';

// Ensure baseUrl is a string (fallback to an empty string if not defined)
const baseUrl: string = process.env.REACT_APP_API_BASE_URL || '';

const SideBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3 onClick={() => navigate('/shift-view')}>Shift Planner</h3>
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
            <Link to="/shift-availability">Submit Shift Proposal</Link>
          </li>
          <li>
            <a onClick={testLogicGate}>Test Logic Gate Connection</a>
          </li>
          {/* Duplicate button for testing auth */}
          <li>
            <a onClick={testAuth}>Test Auth Connection</a>
          </li>
          {/* Duplicate button for testing scheduler */}
          <li>
            <a onClick={testScheduler}>Test Scheduler Connection</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
