import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeDashboard.css";

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Overview cards for employee functions
  const overviewCards = [
    {
      title: "Company Shift Calendar",
      description: "View the company-wide shift schedule.",
      route: "/shift-view",
    },
    {
      title: "My Shifts",
      description: "Manage your assigned shifts, swap, and track updates.",
      route: "/my-shifts",
    },
    {
      title: "Shift Availability",
      description: "Set and update your preferred working hours.",
      route: "/shift-availability",
    },
    {
      title: "Shift Swap Requests",
      description: "Submit a swap request and view its status.",
      route: "/shift-swap",
    },
    {
      title: "Notifications",
      description: "Receive alerts on shift changes and reminders.",
      route: "/notifications",
    },
    {
      title: "Settings",
      description: "Update your profile, change password, and preferences.",
      route: "/settings",
    },
  ];

  return (
    <div className="employee-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="employee-sidebar">
        <h2 className="sidebar-title">Employee Panel</h2>
        <ul className="sidebar-nav">
          <li>
            <button
              onClick={() => navigate("/employee-dashboard")}
              className="sidebar-btn"
            >
              Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-view")} className="sidebar-btn">
              Company Shift Calendar
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/my-shifts")} className="sidebar-btn">
              My Shifts
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-availability")} className="sidebar-btn">
              Shift Availability
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shift-swap")} className="sidebar-btn">
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
      <main className="employee-content">
        <header className="employee-header">
          <h1>Employee Dashboard</h1>
        </header>

        {/* Overview Cards using CSS Grid */}
        <section className="employee-overview">
          {overviewCards.map((card, index) => (
            <div
              key={index}
              className="employee-card"
              onClick={() => navigate(card.route)}
            >
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
