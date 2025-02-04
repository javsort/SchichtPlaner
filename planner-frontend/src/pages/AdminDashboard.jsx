// /src/pages/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  
  return (
    <div className="admin-dashboard-container">
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
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-header">
          <h1>Administrator Dashboard</h1>
        </header>

        {/* Dashboard Overview */}
        <section className="admin-overview">
          <div className="overview-card" onClick={() => navigate('/employee-management')}>
            <h3>Employee Management</h3>
            <p>Add, edit, and manage employees.</p>
          </div>

          <div className="overview-card" onClick={() => navigate('/shift-management')}>
            <h3>Shift Management</h3>
            <p>Create, edit, and delete shifts.</p>
          </div>

          <div className="overview-card" onClick={() => navigate('/shift-view')}>
            <h3>Company Shift Calendar</h3>
            <p>View all scheduled shifts across the company.</p>
          </div>
          
          <div className="overview-card" onClick={() => navigate('/shift-approval')}>
            <h3>Shift Approval</h3>
            <p>Review and approve pending shift requests.</p>
          </div>

          <div className="overview-card" onClick={() => navigate('/shift-availability')}>
            <h3>Shift Availability</h3>
            <p>Set available times for shifts.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;



















