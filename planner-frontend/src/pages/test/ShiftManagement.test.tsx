// src/pages/ShiftManagement.tsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../admin/ShiftManagement.css"; // Ensure you have your custom styling here

// Dummy data for shifts and employees (for demo purposes)
interface Shift {
  id: number;
  title: string;
  start: Date;
  end: Date;
  rolesRequired: string[];
  assignedEmployees: number[];
}

const initialShifts: Shift[] = [
  {
    id: 101,
    title: "Morning Shift",
    start: new Date(2025, 1, 24, 8, 0),
    end: new Date(2025, 1, 24, 12, 0),
    rolesRequired: ["Technician"],
    assignedEmployees: [1],
  },
  {
    id: 102,
    title: "Afternoon Shift",
    start: new Date(2025, 1, 24, 13, 0),
    end: new Date(2025, 1, 24, 17, 0),
    rolesRequired: ["Supervisor"],
    assignedEmployees: [2],
  },
];

// Dummy absence periods for employees (for demo purposes)
// Each absence is defined with a start and end time.
interface Absence {
  employeeId: number;
  start: Date;
  end: Date;
}

const dummyAbsences: Absence[] = [
  {
    employeeId: 1,
    start: new Date(2025, 1, 24, 10, 0),
    end: new Date(2025, 1, 24, 11, 0),
  },
];

// Helper function to check if two time ranges overlap
const isOverlap = (startA: Date, endA: Date, startB: Date, endB: Date): boolean => {
  return startA < endB && startB < endA;
};

const ShiftManagement: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [newShift, setNewShift] = useState({
    title: "",
    start: "",
    end: "",
    rolesRequired: "",
    assignedEmployees: "",
  });
  const [error, setError] = useState<string>("");

  const localizer = momentLocalizer(moment);
  const [view, setView] = useState(Views.WEEK);

  // Function to handle shift creation/update with conflict detection
  const handleAddOrUpdateShift = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // clear previous error

    // Validate required fields
    if (!newShift.title || !newShift.start || !newShift.end) {
      setError("Please fill out all required fields.");
      return;
    }

    const start = new Date(newShift.start);
    const end = new Date(newShift.end);
    if (start >= end) {
      setError("End time must be after start time.");
      return;
    }

    // Parse roles and assigned employees
    const rolesRequired = newShift.rolesRequired
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const assignedEmployees = newShift.assignedEmployees
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((id) => !isNaN(id));

    // Conflict detection: Check for double booking for each assigned employee
    for (const empId of assignedEmployees) {
      for (const existingShift of shifts) {
        // Skip if comparing with the same shift in edit mode
        if (existingShift.id === Number(newShift.id)) continue;
        if (existingShift.assignedEmployees.includes(empId)) {
          if (isOverlap(start, end, existingShift.start, existingShift.end)) {
            setError(
              `Conflict: Employee ${empId} has an overlapping shift "${existingShift.title}" scheduled from ${moment(existingShift.start).format("HH:mm")} to ${moment(existingShift.end).format("HH:mm")}.`
            );
            return;
          }
        }
      }
    }

    // Absence conflict: Check if any assigned employee is absent during the shift
    for (const empId of assignedEmployees) {
      for (const absence of dummyAbsences) {
        if (absence.employeeId === empId) {
          if (isOverlap(start, end, absence.start, absence.end)) {
            setError(
              `Conflict: Employee ${empId} is absent from ${moment(absence.start).format("HH:mm")} to ${moment(absence.end).format("HH:mm")}.`
            );
            return;
          }
        }
      }
    }

    // If no conflicts, add the new shift
    const newShiftEvent = {
      id: Date.now(),
      title: newShift.title,
      start,
      end,
      rolesRequired,
      assignedEmployees,
    };

    setShifts([...shifts, newShiftEvent]);
    alert("Shift created successfully!");

    // Reset form
    setNewShift({
      title: "",
      start: "",
      end: "",
      rolesRequired: "",
      assignedEmployees: "",
    });
  };

  // Calendar events for display
  const calendarEvents = shifts.map((shift) => ({
    ...shift,
    title:
      shift.title +
      " (" +
      (shift.assignedEmployees.length > 0
        ? shift.assignedEmployees.join(", ")
        : "Unassigned") +
      ")",
  }));

  return (
    <div className="shift-management container mt-4">
      <h2>Shift Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Shift Creation Form */}
      <div className="shift-creation mb-4 p-3 border rounded">
        <h3>Create New Shift</h3>
        <form onSubmit={handleAddOrUpdateShift}>
          <div className="form-group mb-3">
            <label>Shift Name:</label>
            <input
              type="text"
              className="form-control"
              value={newShift.title}
              onChange={(e) => setNewShift({ ...newShift, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Start Date & Time:</label>
            <input
              type="datetime-local"
              className="form-control"
              value={newShift.start}
              onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>End Date & Time:</label>
            <input
              type="datetime-local"
              className="form-control"
              value={newShift.end}
              onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Roles Required (comma separated):</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Supervisor, Technician"
              value={newShift.rolesRequired}
              onChange={(e) => setNewShift({ ...newShift, rolesRequired: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label>Assigned Employees (comma separated IDs):</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., 1,2"
              value={newShift.assignedEmployees}
              onChange={(e) =>
                setNewShift({ ...newShift, assignedEmployees: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Shift
          </button>
        </form>
      </div>

      {/* Calendar Display */}
      <div className="calendar-container mb-4">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(newView) => setView(newView)}
          style={{ height: 500, width: "100%" }}
        />
      </div>

      {/* Shift Overview Table */}
      <div className="shift-overview">
        <h3>Shift Overview</h3>
        {shifts.length === 0 ? (
          <p>No shifts available.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Shift Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Assigned Employees</th>
                <th>Roles Required</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id}>
                  <td>{shift.title}</td>
                  <td>{moment(shift.start).format("YYYY-MM-DD")}</td>
                  <td>
                    {moment(shift.start).format("HH:mm")} -{" "}
                    {moment(shift.end).format("HH:mm")}
                  </td>
                  <td>{shift.assignedEmployees.join(", ")}</td>
                  <td>{shift.rolesRequired.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ShiftManagement;
