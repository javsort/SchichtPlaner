import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./ShiftCalendar.css"; // Custom CSS using theme variables

const ShiftCalendar = () => {
  const [view, setView] = useState('all'); // Default to 'All Shifts'

  const handleEventClick = (info) => {
    alert(`Shift Details: ${info.event.title}`);
  };

  const shifts = [
    { title: "Morning Shift", start: "2025-01-30T08:00:00", end: "2025-01-30T16:00:00" },
    { title: "Evening Shift", start: "2025-01-30T16:00:00", end: "2025-01-30T23:59:59" },
  ];

  // Filter shifts based on selected view using simple mock logic.
  const filteredShifts = shifts.filter(shift => {
    if (view === 'myShifts') {
      // Example: only show shifts that include "Morning"
      return shift.title.includes("Morning");
    } else if (view === 'unoccupied') {
      // Add your condition for unoccupied shifts here.
      return false;
    }
    return true; // For 'all' view, show every shift
  });

  return (
    <div className="shift-calendar-container">
      <div className="calendar-filters">
        <button onClick={() => setView('myShifts')} className={view === 'myShifts' ? 'active' : ''}>
          My Shifts
        </button>
        <button onClick={() => setView('all')} className={view === 'all' ? 'active' : ''}>
          All Shifts
        </button>
        <button onClick={() => setView('unoccupied')} className={view === 'unoccupied' ? 'active' : ''}>
          Unoccupied Shifts
        </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={filteredShifts}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default ShiftCalendar;
