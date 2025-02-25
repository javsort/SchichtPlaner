// src/pages/ShiftSupervisorDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ShiftSupervisorDashboard.css"; // Use same styles as AdminDashboard.css

const ShiftSupervisorDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Supervisor Panel</h2>
        <ul className="sidebar-nav">
          <li>
            <button onClick={() => navigate("/shift-supervisor-dashboard")} className="sidebar-btn">
              Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/employee-management")} className="sidebar-btn">
              Employees
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-management")} className="sidebar-btn">
              Shifts
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-swap-admin")} className="sidebar-btn">
              Shift Swap Requests
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/notifications")} className="sidebar-btn">
              Notifications
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/settings")} className="sidebar-btn">
              Settings
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-header">
          <h1>Shift Supervisor Dashboard</h1>
        </header>

        {/* Overview Cards */}
        <section className="admin-overview">
          <div className="overview-card" onClick={() => navigate("/employee-management")}>
            <h3>Employees</h3>
            <p>View employee details (read-only or limited editing).</p>
          </div>
          <div className="overview-card" onClick={() => navigate("/shift-management")}>
            <h3>Shifts</h3>
            <p>Create, edit, and assign shifts with conflict detection.</p>
          </div>
          <div className="overview-card" onClick={() => navigate("/shift-swap-admin")}>
            <h3>Shift Swap Requests</h3>
            <p>Review and approve/reject swap requests.</p>
          </div>
          <div className="overview-card" onClick={() => navigate("/notifications")}>
            <h3>Notifications</h3>
            <p>View system alerts regarding scheduling changes.</p>
          </div>
          <div className="overview-card" onClick={() => navigate("/settings")}>
            <h3>Settings</h3>
            <p>Update your profile, password, and integration options.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ShiftSupervisorDashboard;
