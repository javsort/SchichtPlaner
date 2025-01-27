// CreateShiftForm.jsx
import React, { useState } from 'react';

function CreateShiftForm() {
  const [shiftTime, setShiftTime] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to create shift (e.g., API call)
    alert(`Shift created for ${assignedEmployee} at ${shiftTime}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Shift Time:</label>
        <input 
          type="text" 
          value={shiftTime} 
          onChange={(e) => setShiftTime(e.target.value)} 
        />
      </div>
      <div>
        <label>Assign Employee:</label>
        <input 
          type="text" 
          value={assignedEmployee} 
          onChange={(e) => setAssignedEmployee(e.target.value)} 
        />
      </div>
      <button type="submit">Create Shift</button>
    </form>
  );
}

export default CreateShiftForm;