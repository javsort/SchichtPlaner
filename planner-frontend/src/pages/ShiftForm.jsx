import React, { useState } from 'react';

const ShiftForm = ({ onSubmit }) => {
  const [shiftTime, setShiftTime] = useState('');
  const [employee, setEmployee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ time: shiftTime, employee });
    setShiftTime('');
    setEmployee('');
  };

  return (
    <div className="shift-form">
      <h2>Create Shift</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Shift Time:</label>
          <input
            type="text"
            value={shiftTime}
            onChange={(e) => setShiftTime(e.target.value)}
            placeholder="e.g., 06:00 - 14:00"
            required
          />
        </div>
        <div>
          <label>Employee:</label>
          <input
            type="text"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            placeholder="Employee Name"
            required
          />
        </div>
        <button type="submit">Save Shift</button>
      </form>
    </div>
  );
};

export default ShiftForm;
