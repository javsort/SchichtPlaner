import React, { useState } from 'react';
import './styles.css';

function AddEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [shiftAssignment, setShiftAssignment] = useState('');

  const handleAddEmployee = () => {
    // Logic to handle employee creation (API call or local state management)
    console.log("Employee Added: ", { name, email, role, shiftAssignment });
    // Redirect to Admin Dashboard or other page after addition
  };

  return (
    <div className="add-employee-container">
      <h1>Add New Employee</h1>
      <form className="add-employee-form">
        <div className="form-group">
          <label>Employee Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter employee name"
            required
          />
        </div>
        <div className="form-group">
          <label>Employee Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter employee email"
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="shift-supervisor">Shift Supervisor</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <div className="form-group">
          <label>Assigned Shift</label>
          <select
            value={shiftAssignment}
            onChange={(e) => setShiftAssignment(e.target.value)}
            required
          >
            <option value="">Select Shift</option>
            {/* Add available shifts dynamically or manually */}
            <option value="morning">Morning Shift</option>
            <option value="afternoon">Afternoon Shift</option>
            <option value="night">Night Shift</option>
          </select>
        </div>
        <button type="button" onClick={handleAddEmployee} className="action-btn">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;