// src/pages/TechnicianDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TechnicianDashboard.css";

const TechnicianDashboard: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="technician-dashboard-container">
      <aside className="technician-sidebar">
        <h2 className="sidebar-title">Technician Panel</h2>
        <ul className="sidebar-nav">
          <li>
            <button
              onClick={() => navigate("/technician-dashboard")}
              className="sidebar-btn"
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/shift-view")}
              className="sidebar-btn"
            >
              Company Shift Calendar
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/my-shifts")}
              className="sidebar-btn"
            >
              My Shifts
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/shift-availability")}
              className="sidebar-btn"
            >
              Shift Availability
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/shift-swap")}
              className="sidebar-btn"
            >
              Shift Swap Requests
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/notifications")}
              className="sidebar-btn"
            >
              Notifications
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/settings")}
              className="sidebar-btn"
            >
              Settings
            </button>
          </li>
        </ul>
      </aside>

      <main className="technician-content">
        <header className="technician-header">
          <h1>Technician Dashboard</h1>
        </header>

        <section className="technician-overview">
          {overviewCards.map((card, index) => (
            <div
              key={index}
              className="technician-card"
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

export default TechnicianDashboard;
