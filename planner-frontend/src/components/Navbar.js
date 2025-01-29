import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Home</Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/shift-management">Shift Management</Link> {/* Link to Shift Management Page */}
          </li>
          {/* Add other navigation links */}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
