import React from 'react';

const ShiftList = ({ shifts }) => {
  return (
    <div className="shift-list">
      <h2>Shift List</h2>
      {shifts.length === 0 ? (
        <p>No shifts assigned yet.</p>
      ) : (
        <ul>
          {shifts.map((shift, index) => (
            <li key={index}>
              {shift.time} - {shift.employee}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShiftList;
