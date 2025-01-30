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
import Shifts from './pages/Shifts';
import ShiftManagement from './pages/ShiftManagement';
import ShiftAvailability from './pages/ShiftAvailability'; // New Shift Availability Page

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
        <Route path="/shifts" element={<Shifts />} />
        <Route path="/shift-management" element={<ShiftManagement />} />
        <Route path="/shift-availability" element={<ShiftAvailability />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;

