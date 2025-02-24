// src/components/Calendar.js
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Ensure baseUrl is a string (fallback to an empty string if not defined)
const baseUrl: string = process.env.REACT_APP_API_BASE_URL || '';

const SideBar: React.FC = () => {
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

    console.log('Testing scheduler API Endpoint... URL:', `${baseUrl}/api/scheduler/assignments/test-jwt`);

    try {
      const response = await axios.get(`${baseUrl}/api/scheduler/assignments/test-jwt`, {
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
    <div className="sidebar-container">
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
    </div>
  );
};

export default SideBar;