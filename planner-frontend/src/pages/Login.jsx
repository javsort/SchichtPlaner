import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Technician');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate authentication (replace with your authentication logic)
    if (username && password) {
      // Mock role check after login (you would replace this with actual logic)
      if (role === 'Shift Supervisor') {
        navigate('/supervisor-dashboard');
      } else if (role === 'Administrator') {
        navigate('/admin-dashboard');
      } else if (role === 'Tester') {
        navigate('/tester-dashboard');
      } else if (role === 'Incident Manager') {
        navigate('/incident-manager-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } else {
      setErrorMessage('Please enter valid credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Shift Planner Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Technician">Technician</option>
            <option value="Tester">Tester</option>
            <option value="Incident Manager">Incident Manager</option>
            <option value="Shift Supervisor">Shift Supervisor</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
