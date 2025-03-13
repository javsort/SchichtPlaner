import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Optional: Custom styles

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Technician');
  const navigate = useNavigate(); // Initialize the navigation hook

  const handleRegister = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Proceed with registration logic (e.g., API call)
      alert('Account registered successfully!');
      
      // Redirect based on role
      if (role === 'Administrator') {
        navigate('/admin-dashboard'); // Redirect to the admin dashboard if the role is Administrator
      } else {
        // Redirect to the default page (you can adjust this to fit your needs)
        alert('You are registered as a ' + role);
        // Optionally, navigate to a user-specific page
      }
    } else {
      alert('Passwords do not match.');
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center">
      <div className="register-card p-4 shadow-lg rounded">
        <h2 className="text-center">Register for Shift Planner</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
              <option value="Technician">Technician</option>
              <option value="Tester">Tester</option>
              <option value="Incident-Manager">Incident Manager</option>
              <option value="Shift-Supervisor">Shift Supervisor</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
