// CalendarView.jsx
import React, { useState } from 'react';

function CalendarView() {
  const [view, setView] = useState('myShifts');

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div>
      <h2>Calendar View</h2>
      <button onClick={() => handleViewChange('myShifts')}>My Shifts</button>
      <button onClick={() => handleViewChange('allShifts')}>All Shifts</button>
      <button onClick={() => handleViewChange('unoccupiedShifts')}>Unoccupied Shifts</button>

      <div>
        <h3>{view === 'myShifts' ? 'Your Assigned Shifts' : (view === 'allShifts' ? 'All Shifts' : 'Unoccupied Shifts')}</h3>
        {/* Calendar logic goes here */}
      </div>
    </div>
  );
}

export default CalendarView;
