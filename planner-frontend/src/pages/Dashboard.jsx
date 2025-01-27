import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Optional, if you want to add styles specifically for the Dashboard page

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session or token if applicable (for example, localStorage.clear())
    // Example: localStorage.removeItem('userToken');
    navigate('/');  // Redirect to Login page
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to the Dashboard</h1>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li><a href="/employees">Employees</a></li>
          <li><a href="/shifts">Shifts</a></li>
          <li><a href="/reports">Reports</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>

      <section className="dashboard-main">
        <h2>Upcoming Shifts</h2>
        <div className="shift-overview">
          <div className="shift-card">
            <p>Shift: Morning Shift</p>
            <p>Date: 2025-01-25</p>
            <p>Role: Technician</p>
            <p>Status: Unfilled</p>
            <button>Assign Shift</button>
          </div>
          {/* Add more shift cards as needed */}
        </div>

        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button>Create New Shift</button>
          <button>Add Employee</button>
          <button>View Reports</button>
        </div>
      </section>

      <footer className="dashboard-footer">
        <button onClick={handleLogout}>Logout</button>
        <p>© 2025 Your Company</p>
      </footer>
    </div>
  );
}

export default Dashboard;