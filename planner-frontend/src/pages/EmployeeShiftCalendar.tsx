import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./EmployeeShiftCalendar.css"; // Custom CSS using theme variables

const localizer = momentLocalizer(moment);

const EmployeeShiftCalendar = ({ currentUser = { name: "Default Employee" } }) => {
  // Dummy shift data; in production, fetch from your API
  const [shifts, setShifts] = useState([
    {
      start: new Date(new Date().setHours(9, 0)),
      end: new Date(new Date().setHours(13, 0)),
      assignedTo: "Justus Fynn",
      type: "morning",
    },
    {
      start: new Date(new Date().setHours(14, 0)),
      end: new Date(new Date().setHours(18, 0)),
      assignedTo: "Justus Fynn",
      type: "evening",
    },
    {
      start: new Date(new Date().setHours(20, 0)),
      end: new Date(new Date().setHours(23, 0)),
      assignedTo: "Amina Ali",
      type: "night",
    },
  ]);

  const [view, setView] = useState(Views.MONTH); // Default to Month View

  // Filter shifts for the current user
  const userShifts = shifts.filter(
    (shift) => shift.assignedTo === currentUser.name
  );

  // Custom event style getter using CSS variables with fallbacks
  const eventStyleGetter = (event) => {
    let backgroundColor = "var(--calendar-event-bg, #3174ad)"; // Default blue
    if (event.type === "morning") {
      backgroundColor = "var(--morning-shift-bg, #f39c12)"; // Orange for morning shifts
    } else if (event.type === "evening") {
      backgroundColor = "var(--evening-shift-bg, #2980b9)"; // Blue for evening shifts
    } else if (event.type === "night") {
      backgroundColor = "var(--night-shift-bg, #8e44ad)"; // Purple for night shifts
    }
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div className="employee-shift-calendar">
      <h2>{currentUser.name}'s Shift Calendar</h2>

      {/* View Selector */}
      <div className="view-selector">
        <label>
          <strong>Select View:</strong>
        </label>
        <select value={view} onChange={(e) => setView(e.target.value)}>
          <option value={Views.MONTH}>Month</option>
          <option value={Views.WEEK}>Week</option>
          <option value={Views.DAY}>Day</option>
          <option value={Views.AGENDA}>Agenda</option>
        </select>
      </div>

      {/* Calendar */}
      <div className="calendar-container" style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={userShifts}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={(newView) => setView(newView)}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default EmployeeShiftCalendar;
