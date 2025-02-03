// /src/pages/EmployeeShiftCalendar.jsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./EmployeeShiftCalendar.css"; // Custom CSS for calendar (see below)

const localizer = momentLocalizer(moment);

const EmployeeShiftCalendar = ({ currentUser = { name: "Default Employee" } }) => {
  // Dummy shift data; in production, fetch from your API
  const [shifts, setShifts] = useState([
    {
      title: "Morning Shift",
      start: new Date(new Date().setHours(9, 0)),
      end: new Date(new Date().setHours(13, 0)),
      assignedTo: "John Doe",
      type: "morning",
    },
    {
      title: "Evening Shift",
      start: new Date(new Date().setHours(14, 0)),
      end: new Date(new Date().setHours(18, 0)),
      assignedTo: "John Doe",
      type: "evening",
    },
    {
      title: "Night Shift",
      start: new Date(new Date().setHours(20, 0)),
      end: new Date(new Date().setHours(23, 0)),
      assignedTo: "Jane Smith",
      type: "night",
    },
  ]);

  const [view, setView] = useState(Views.MONTH); // Default to Month View

  // (Optional) If you plan to fetch events from your API:
  /*
  useEffect(() => {
    fetch('/api/shifts')
      .then(response => response.json())
      .then(data => setShifts(data))
      .catch(error => console.error('Error fetching shifts:', error));
  }, []);
  */

  // Filter shifts for the current user
  const userShifts = shifts.filter(
    (shift) => shift.assignedTo === currentUser.name
  );

  // Custom event style getter to color-code based on shift type
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"; // Default blue

    if (event.type === "morning") {
      backgroundColor = "#f39c12"; // Orange for morning shifts
    } else if (event.type === "evening") {
      backgroundColor = "#2980b9"; // Blue for evening shifts
    } else if (event.type === "night") {
      backgroundColor = "#8e44ad"; // Purple for night shifts
    }
    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style,
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
      <div style={{ height: "600px" }}>
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
