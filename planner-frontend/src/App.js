import React from 'react';
import ReactDOM from 'react-dom/client';  // Import for React 18 and newer
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';  // Global styles
import AdminDashboard from './pages/AdminDashboard';
import CreateShift from './pages/CreateShift';
import AddEmployee from './pages/AddEmployee';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} /> {/* Default route */}
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
