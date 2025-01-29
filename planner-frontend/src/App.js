import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CreateShift from './pages/CreateShift';
import AddEmployee from './pages/AddEmployee';
import Employees from './pages/Employees';
import Shifts from './pages/Shifts';  // New shift management component
import ShiftManagement from './pages/ShiftManagement';  // New shift management component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/create-shift" element={<CreateShift />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/shifts" element={<Shifts />} />  {/* Add this route */}
        <Route path="/shift-management" element={<ShiftManagement />} />  {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
