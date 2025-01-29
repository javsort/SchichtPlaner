import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function AdminDashboard() {
  const navigate = useNavigate();
  
  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-nav">
          <li><button onClick={() => navigate('/')} className="sidebar-btn">Dashboard</button></li>
          <li><button onClick={() => navigate('/create-shift')} className="sidebar-btn">Create Shift</button></li>
          <li><button onClick={() => navigate('/add-employee')} className="sidebar-btn">Add Employee</button></li>
          <li><button onClick={() => navigate('/shifts')} className="sidebar-btn">Shifts</button></li>
          <li><button onClick={() => navigate('/employees')} className="sidebar-btn">Employees</button></li>
          <li><button onClick={() => navigate('/reports')} className="sidebar-btn">Reports</button></li>
          <li><button onClick={() => navigate('/settings')} className="sidebar-btn">Settings</button></li>
          {/* Added Shift Management */}
          <li><button onClick={() => navigate('/shift-management')} className="sidebar-btn">Shift Management</button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <h1>Administrator Dashboard</h1>
        </header>

        {/* Dashboard Overview */}
        <div className="admin-overview">
          <div className="overview-card">
            <h3>Upcoming Shifts</h3>
            <p>Manage and view all upcoming shifts.</p>
            <button onClick={() => navigate('/shifts')} className="overview-btn">View Shifts</button>
          </div>

          <div className="overview-card">
            <h3>Employee Management</h3>
            <p>Add, edit, and delete employees.</p>
            <button onClick={() => navigate('/employees')} className="overview-btn">Manage Employees</button>
          </div>

          <div className="overview-card">
            <h3>Reports</h3>
            <p>View and generate shift reports.</p>
            <button onClick={() => navigate('/reports')} className="overview-btn">View Reports</button>
          </div>

          {/* Optionally add a link or button here to navigate to shift management */}
          <div className="overview-card">
            <h3>Shift Management</h3>
            <p>Manage shifts for employees.</p>
            <button onClick={() => navigate('/shift-management')} className="overview-btn">Manage Shifts</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;



















