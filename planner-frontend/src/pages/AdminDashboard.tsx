// /src/pages/AdminDashboard.tsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Ensure baseUrl is a string (fallback to an empty string if not defined)
const baseUrl: string = process.env.REACT_APP_API_BASE_URL || '';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Type the event parameter as a MouseEvent from a button
  const testLogicEndpoint = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    console.log('Testing logicGate API Endpoint... URL:', `${baseUrl}/api/hello`);

    try {
      const response = await axios.get(`${baseUrl}/api/hello`, {
        headers: {
          'Content-Type': 'application/json',
          // Provide a default empty string if no token is found
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      
      // Log the data from the API response
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const testAuthEndpoint = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    console.log('Testing auth API Endpoint... URL:', `${baseUrl}/api/auth/test-jwt`);

    try {
      const response = await axios.get(`${baseUrl}/api/auth/test-jwt`, {
        headers: {
          'Content-Type': 'application/json',
          // Provide a default empty string if no token is found
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      
      // Log the data from the API response
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const testSchedulerEndpoint = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    console.log('Testing scheduler API Endpoint... URL:', `${baseUrl}/api/assignments/test-jwt`);

    try {
      const response = await axios.get(`${baseUrl}/api/assignments/test-jwt`, {
        headers: {
          'Content-Type': 'application/json',
          // Provide a default empty string if no token is found
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      
      // Log the data from the API response
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };


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

          {/* Buttons to test the backend connection */}
          <li>
            <button type="button" onClick={testLogicEndpoint} className="action-btn">
              Test Logic Gate Connection
            </button>
          </li>
          {/* Duplicate button for testing auth */}
          <li>
            <button type="button" onClick={testAuthEndpoint} className="action-btn">
              Test Auth Connection
            </button>
          </li>
          {/* Duplicate button for testing scheduler */}
          <li>
            <button type="button" onClick={testSchedulerEndpoint} className="action-btn">
              Test Scheduler Connection
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
};

export default AdminDashboard;














