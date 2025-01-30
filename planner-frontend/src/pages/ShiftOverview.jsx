import React from 'react';

const ShiftOverview = ({ shifts }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Shift Name</th>
          <th>Date & Time</th>
          <th>Assigned Employees</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {shifts.map((shift, index) => (
          <tr key={index}>
            <td>{shift.shiftName}</td>
            <td>{shift.dateTime}</td>
            <td>{shift.assignedEmployees.join(', ')}</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShiftOverview;
