import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function CreateShift() {
  const [shiftDetails, setShiftDetails] = useState({
    employee: '',
    shiftDate: '',
    startTime: '',
    endTime: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShiftDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to create a shift (e.g., send data to the API)
    console.log('Shift Created:', shiftDetails);
    // Navigate back to the shifts overview page after creating a shift
    navigate('/shifts');
  };

  return (
    <div className="create-shift-container">
      <h2>Create a New Shift</h2>
      <form onSubmit={handleSubmit} className="create-shift-form">
        <div className="form-group">
          <label htmlFor="employee">Employee</label>
          <input
            type="text"
            id="employee"
            name="employee"
            value={shiftDetails.employee}
            onChange={handleChange}
            placeholder="Employee Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="shiftDate">Shift Date</label>
          <input
            type="date"
            id="shiftDate"
            name="shiftDate"
            value={shiftDetails.shiftDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={shiftDetails.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={shiftDetails.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="create-shift-btn">Create Shift</button>
      </form>
    </div>
  );
}

export default CreateShift;
