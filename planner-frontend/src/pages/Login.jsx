import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  /*
  
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
  */

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simulate authentication (replace with your authentication logic)
    if (email && password) {
      console.log('Logging in...', { email, password });

      try {
        const response = await axios.post(`${baseUrl}/api/auth/login`, {
          email: email,
          password: password
        });

        const data = await response;
        
        console.log('API Response:', data);
        
        console.log('Email:', data.data.email);
        console.log('Role:', data.data.role);
        console.log("Token: '" +  data.data.token + "'");

        // Extract role from response headers
        localStorage.setItem('token', data.data.token)
        
        setRole(data.data.role);

      } catch (error) {
        console.error('API Error:', error);
      }

      // Mock role check after login (you would replace this with actual logic)
      if (role === 'Shift Supervisor') {    // Update with DB data!!!
        navigate('/supervisor-dashboard');
      } else if (role === 'Admin') {      // THis one is done so far
        navigate('/admin-dashboard');
      } else if (role === 'Tester') {
        navigate('/tester-dashboard');
      } else if (role === 'Incident Manager') {
        navigate('/incident-manager-dashboard');
      } else if (role === 'Employee') {
        navigate('/employee-dashboard');
      } else {
        setErrorMessage('There was an error logging you in! Please try again.');
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
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
