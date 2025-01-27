import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';  // Global styles
import Login from './pages/Login';  // Import the Login component correctly
import Register from './pages/Register';  // Import the Register component
import AdminDashboard from './pages/AdminDashboard';
import CreateShift from './pages/CreateShift';
import AddEmployee from './pages/AddEmployee';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* Register route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/create-shift" element={<CreateShift />} />
        <Route path="/add-employee" element={<AddEmployee />} />
      </Routes>
    </Router>
  );
}

// Use ReactDOM.createRoot for React 18 and beyond
const root = ReactDOM.createRoot(document.getElementById('root')); // Get the root div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;

