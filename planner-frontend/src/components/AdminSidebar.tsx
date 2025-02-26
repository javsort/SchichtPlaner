// src/components/Calendar.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { testLogicGate, testAuth, testScheduler } from '../Services/api.ts';
import './SideBar.css';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <h3 onClick={() => navigate('/admin-dashboard')}>Shift Planner</h3>
      <ul className="sidebar">
        <li>
          <Link to="/admin-dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/employee-management">Employee Management</Link>
        </li>
        <li>
          <Link to="/shift-management">Shifts Management</Link>
        </li>
        <li>
          <Link to="/shift-approval">Shift Approval</Link>
        </li>
        <li>
          <Link to="/shift-view">Company Shift Calendar</Link>
        </li>
        <li>
          <Link to="/shift-swap-admin">Shift Swap Management</Link>
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
    </div>
  );
};

export default AdminSidebar;
