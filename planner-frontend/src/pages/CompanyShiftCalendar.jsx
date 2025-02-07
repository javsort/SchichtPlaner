// /src/pages/CompanyShiftCalendar.jsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css"; // Custom CSS for styling

const localizer = momentLocalizer(moment);

const CompanyShiftCalendar = ({ currentUser = { id: 1, name: "John Doe" } }) => {
  // Dummy employee data (resources)
  const [employees] = useState([
    { id: 1, name: "david Marrco" },
    { id: 2, name: "justus Magdy" },
    { id: 3, name: "hany Ali" },
    // Add more employees as needed
  ]);

  // Dummy shift data (events)
  const [shifts] = useState([
    {
      title: "David Marco",
      start: new Date(new Date().setHours(9, 0, 0)),
      end: new Date(new Date().setHours(13, 0, 0)),
      resourceId: 1, // Assigned to John Doe
    
      assignedEmployees: [1],
    },
    {
      title: "David Marco",
      start: new Date(new Date().setHours(14, 0, 0)),
      end: new Date(new Date().setHours(18, 0, 0)),
      resourceId: 1, // Assigned to John Doe
    
      assignedEmployees: [1],
    },
    {
      title: "Hany Ali",
      start: new Date(new Date().setHours(8, 0, 0)),
      end: new Date(new Date().setHours(12, 0, 0)),
      resourceId: 2, // Assigned to Jane Smith
      
      assignedEmployees: [2],
    },
    {
      title: "Hany Ali",
      start: new Date(new Date().setHours(13, 0, 0)),
      end: new Date(new Date().setHours(17, 0, 0)),
      resourceId: 3, // Assigned to Bob Johnson
      type: "afternoon",
      assignedEmployees: [3],
    },
    // You can add more shift events as needed
  ]);

  // Calendar view state (Week view is used here for the time axis)
  const [view, setView] = useState(Views.WEEK);

  // Filter state: "all", "my", or "unoccupied"
  const [calendarFilter, setCalendarFilter] = useState("all");

  // Filter shifts based on the selected calendar filter
  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees && shift.assignedEmployees.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    return true; // "all" shows every shift
  });

  // Map shifts to calendar events.
  // The title is updated to include the names of the assigned employees.
  const calendarEvents = filteredShifts.map((shift) => ({
    ...shift,
    title:
      shift.title +
      " (" +
      (shift.assignedEmployees && shift.assignedEmployees.length > 0
        ? shift.assignedEmployees
            .map(
              (id) =>
                employees.find((emp) => emp.id === id)?.name || id
            )
            .join(", ")
        : "Unassigned") +
      ")",
  }));

  // Custom event style getter to color-code shifts by type
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"; // Default blue
    if (event.type === "morning") backgroundColor = "#f39c12"; // Orange
    else if (event.type === "evening") backgroundColor = "#2980b9"; // Blue
    else if (event.type === "afternoon") backgroundColor = "#27ae60"; // Green

    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.9,
      color: "white",
      border: "none",
    };

    return { style };
  };

  return (
    <div className="company-shift-calendar">
      <h2>Company Shift Calendar</h2>

      {/* Filter Buttons */}
      <div className="calendar-filters">
        <button
          className={calendarFilter === "my" ? "active" : ""}
          onClick={() => setCalendarFilter("my")}
        >
          My Shifts
        </button>
        <button
          className={calendarFilter === "all" ? "active" : ""}
          onClick={() => setCalendarFilter("all")}
        >
          All Shifts
        </button>
        <button
          className={calendarFilter === "unoccupied" ? "active" : ""}
          onClick={() => setCalendarFilter("unoccupied")}
        >
          Unoccupied Shifts
        </button>
      </div>

      {/* Calendar Display */}
      <div className="calendar-container" style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={(newView) => setView(newView)}
          eventPropGetter={eventStyleGetter}
          resources={employees} // Resource data (employees)
          resourceIdAccessor="id"
          resourceTitleAccessor="name"
        />
      </div>
    </div>
  );
};

export default CompanyShiftCalendar;
