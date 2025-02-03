// /src/pages/ShiftView.jsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftView.css"; // Create this CSS file for custom styling

const localizer = momentLocalizer(moment);

// Dummy employee data (in production, fetch this from your API)
const dummyEmployees = [
  { id: 1, name: "John Doe", roles: ["Technician", "Supervisor"] },
  { id: 2, name: "Jane Smith", roles: ["Technician"] },
  { id: 3, name: "Bob Johnson", roles: ["Supervisor"] },
];

// Helper function: Check if two time ranges overlap
const isOverlap = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

const ShiftView = ({ currentUser = { id: 1, name: "John Doe" } }) => {
  // State for shifts
  // Each shift includes: id, title, start, end, rolesRequired (array), assignedEmployees (array of employee IDs)
  const [shifts, setShifts] = useState([
    {
      id: 101,
      title: "Morning Shift",
      start: new Date(new Date().setHours(8, 0, 0)),
      end: new Date(new Date().setHours(12, 0, 0)),
      rolesRequired: ["Technician"],
      assignedEmployees: [1],
    },
    {
      id: 102,
      title: "Evening Shift",
      start: new Date(new Date().setHours(14, 0, 0)),
      end: new Date(new Date().setHours(18, 0, 0)),
      rolesRequired: ["Supervisor"],
      assignedEmployees: [2],
    },
  ]);

  // State for calendar filter: "my", "all", "unoccupied"
  const [calendarFilter, setCalendarFilter] = useState("all");

  // State for shift creation form
  const [newShift, setNewShift] = useState({
    title: "",
    start: "",
    end: "",
    rolesRequired: "",
    assignedEmployees: "",
  });

  // Calendar view state (Week view is used here for the time axis)
  const [view, setView] = useState(Views.WEEK);

  // Filter shifts based on the selected filter
  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return shift.assignedEmployees.length === 0;
    }
    return true; // "all" returns all shifts
  });

  // Prepare events for react-big-calendar.
  // Optionally, you can include assigned employee names in the title.
  const calendarEvents = filteredShifts.map((shift) => ({
    ...shift,
    title:
      shift.title +
      " (" +
      (shift.assignedEmployees
        .map(
          (id) =>
            dummyEmployees.find((emp) => emp.id === id)?.name ||
            "Unknown"
        )
        .join(", ") || "Unassigned") +
      ")",
  }));

  // Event style getter for calendar events (example: different color if Supervisor role is required)
  const eventStyleGetter = (event) => {
    const requiresSupervisor = event.rolesRequired.includes("Supervisor");
    const style = {
      backgroundColor: requiresSupervisor ? "#2980b9" : "#27ae60",
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "none",
    };
    return { style };
  };

  // Handle new shift form submission
  const handleAddShift = (e) => {
    e.preventDefault();

    // Basic validation
    if (!newShift.title || !newShift.start || !newShift.end) {
      alert("Please fill out all required fields.");
      return;
    }
    const start = new Date(newShift.start);
    const end = new Date(newShift.end);
    if (start >= end) {
      alert("End time must be after start time.");
      return;
    }

    // Parse roles (comma separated) and assigned employees (comma separated IDs)
    const rolesRequired = newShift.rolesRequired
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const assignedEmployees = newShift.assignedEmployees
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((id) => !isNaN(id));

    // Conflict check: for each assigned employee, check if they have an overlapping shift
    let conflictFound = false;
    assignedEmployees.forEach((empId) => {
      shifts.forEach((existingShift) => {
        if (existingShift.assignedEmployees.includes(empId)) {
          if (isOverlap(start, end, existingShift.start, existingShift.end)) {
            conflictFound = true;
            const empName =
              dummyEmployees.find((e) => e.id === empId)?.name || empId;
            alert(
              `Conflict: Employee ${empName} already has a shift "${existingShift.title}" that overlaps.`
            );
          }
        }
      });
    });
    if (conflictFound) return;

    // Create new shift object
    const newShiftEvent = {
      id: Date.now(), // simple unique id
      title: newShift.title,
      start,
      end,
      rolesRequired,
      assignedEmployees,
    };

    setShifts([...shifts, newShiftEvent]);
    setNewShift({ title: "", start: "", end: "", rolesRequired: "", assignedEmployees: "" });
  };

  return (
    <div className="shift-view">
      <h2>Shift Calendar & Creation</h2>

      {/* Calendar Filter Buttons */}
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

      {/* Calendar View */}
      <div className="calendar-container" style={{ height: "500px" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          view={view}
          onView={(newView) => setView(newView)}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {/* Shift Creation Form */}
      <div className="shift-creation">
        <h3>Create New Shift</h3>
        <form onSubmit={handleAddShift}>
          <div>
            <label>Shift Name:</label>
            <input
              type="text"
              value={newShift.title}
              onChange={(e) =>
                setNewShift({ ...newShift, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Start Date & Time:</label>
            <input
              type="datetime-local"
              value={newShift.start}
              onChange={(e) =>
                setNewShift({ ...newShift, start: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>End Date & Time:</label>
            <input
              type="datetime-local"
              value={newShift.end}
              onChange={(e) =>
                setNewShift({ ...newShift, end: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Roles Required (comma separated):</label>
            <input
              type="text"
              placeholder="e.g., Supervisor, Technician"
              value={newShift.rolesRequired}
              onChange={(e) =>
                setNewShift({ ...newShift, rolesRequired: e.target.value })
              }
            />
          </div>
          <div>
            <label>Assign Employees (comma separated IDs):</label>
            <input
              type="text"
              placeholder="e.g., 1,2"
              value={newShift.assignedEmployees}
              onChange={(e) =>
                setNewShift({ ...newShift, assignedEmployees: e.target.value })
              }
            />
          </div>
          <button type="submit">Add Shift</button>
        </form>
      </div>
    </div>
  );
};

export default ShiftView;
