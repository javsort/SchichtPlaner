// src/pages/TesterDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TesterDashboard.css";

const TesterDashboard: React.FC = () => {
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
    <div className="tester-dashboard-container">
      <aside className="tester-sidebar">
        <h2 className="sidebar-title">Tester Panel</h2>
        <ul className="sidebar-nav">
          <li>
            <button onClick={() => navigate("/tester-dashboard")} className="sidebar-btn">
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

      <main className="tester-content">
        <header className="tester-header">
          <h1>Tester Dashboard</h1>
        </header>

        <section className="tester-overview">
          {overviewCards.map((card, index) => (
            <div key={index} className="tester-card" onClick={() => navigate(card.route)}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default TesterDashboard;
