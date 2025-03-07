// src/pages/admin/AdminDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import GlobalSidebar from "../../components/GlobalSidebar.tsx";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <GlobalSidebar />

      {/* Main Content Area */}
      <main className="admin-content">
        <header className="admin-header">
          <h1>Administrator Dashboard</h1>
        </header>

        {/* Pinned Logo at the Top-Right */}
        <img src="/logo.png" alt="Company Logo" className="top-logo" />

        {/* Dashboard Overview */}
        <section className="admin-overview">
          <div
            className="overview-card"
            onClick={() => navigate("/employee-management")}
          >
            <h3>Employee Management</h3>
            <p>Add, edit, and manage employees.</p>
          </div>
          <div
            className="overview-card"
            onClick={() => navigate("/shift-management")}
          >
            <h3>Shift Management</h3>
            <p>Create, edit, and delete shifts.</p>
          </div>
          <div
            className="overview-card"
            onClick={() => navigate("/shift-view")}
          >
            <h3>Company Shift Calendar</h3>
            <p>View all scheduled shifts across the company.</p>
          </div>
          <div
            className="overview-card"
            onClick={() => navigate("/shift-approval")}
          >
            <h3>Shift Approval</h3>
            <p>Review and approve pending shift requests.</p>
          </div>
          <div
            className="overview-card"
            onClick={() => navigate("/shift-availability")}
          >
            <h3>Shift Availability</h3>
            <p>Set available times for shifts.</p>
          </div>
          <div
            className="overview-card"
            onClick={() => navigate("/shift-swap-admin")}
          >
            <h3>Shift Swap Management</h3>
            <p>Manage shift swap requests and approvals.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
