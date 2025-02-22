import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const ShiftCalendar = () => {
  const [view, setView] = useState('all'); // Default to 'All Shifts'

  const handleEventClick = (info) => {
    alert(`Shift Details: ${info.event.title}`);
  };

  const shifts = [
    { title: "Morning Shift", start: "2025-01-30T08:00:00", end: "2025-01-30T16:00:00" },
    { title: "Evening Shift", start: "2025-01-30T16:00:00", end: "2025-01-30T23:59:59" },
  ];

  return (
    <div>
      <button onClick={() => setView('myShifts')}>My Shifts</button>
      <button onClick={() => setView('all')}>All Shifts</button>
      <button onClick={() => setView('unoccupied')}>Unoccupied Shifts</button>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={shifts.filter(shift => {
          // Filter shifts based on selected view
          if (view === 'myShifts') {
            // Filter for only logged-in user's shifts (mock data)
            return shift.title.includes("Morning");
          } else if (view === 'unoccupied') {
            // Filter for unoccupied shifts (add condition here)
            return false;
          }
          return true; // Show all shifts
        })}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default ShiftCalendar;
