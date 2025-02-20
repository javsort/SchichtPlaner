import React, { useState } from 'react';

const ShiftCreationForm = () => {
  const [shiftName, setShiftName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [roles, setRoles] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for saving shift (send to backend or update state)
    console.log({ shiftName, dateTime, roles, assignedEmployees });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Shift Name:</label>
        <input
          type="text"
          value={shiftName}
          onChange={(e) => setShiftName(e.target.value)}
        />
      </div>
      <div>
        <label>Date & Time:</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
      </div>
      <div>
        <label>Roles Required:</label>
        <select multiple onChange={(e) => setRoles([...e.target.selectedOptions].map(option => option.value))}>
          <option value="Supervisor">Supervisor</option>
          <option value="Technician">Technician</option>
        </select>
      </div>
      <div>
        <label>Assigned Employees:</label>
        <input
          type="text"
          value={assignedEmployees}
          onChange={(e) => setAssignedEmployees(e.target.value.split(','))}
          placeholder="Enter employees separated by commas"
        />
      </div>
      <button type="submit">Create Shift</button>
    </form>
  );
};

export default ShiftCreationForm;
