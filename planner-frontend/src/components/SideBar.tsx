// src/components/SideBar.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css"; // Optional: create a CSS file for custom styles

const SideBar: React.FC = () => {
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
            <Link to="/shift-view">Calendar View</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
