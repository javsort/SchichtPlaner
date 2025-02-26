import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ShiftSupervisorDashboard.css"; // Use same styles as AdminDashboard.css

const ShiftSupervisorDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Shift Supervisor Panel</h2>
        <ul className="sidebar-nav">
          <li>
            <button onClick={() => navigate("/shift-supervisor-dashboard")} className="sidebar-btn">
              Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/employee-management")} className="sidebar-btn">
              Employee Management
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-management")} className="sidebar-btn">
              Shift Management
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-view")} className="sidebar-btn">
              Company Shift Calendar
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-approval")} className="sidebar-btn">
              Shift Approval
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-availability")} className="sidebar-btn">
              Shift Availability
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
            <h3>Employee Management</h3>
            <p>Add, edit, and manage employees.</p>
          </div>

          <div className="overview-card" onClick={() => navigate("/shift-management")}>
            <h3>Shift Management</h3>
            <p>Create, edit, and assign shifts with conflict detection.</p>
          </div>

          <div className="overview-card" onClick={() => navigate("/shift-view")}>
            <h3>Company Shift Calendar</h3>
            <p>View all scheduled shifts across the company.</p>
          </div>

          <div className="overview-card" onClick={() => navigate("/shift-approval")}>
            <h3>Shift Approval</h3>
            <p>Review and approve pending shift requests.</p>
          </div>

          <div className="overview-card" onClick={() => navigate("/shift-availability")}>
            <h3>Shift Availability</h3>
            <p>Set available times for shifts.</p>
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
