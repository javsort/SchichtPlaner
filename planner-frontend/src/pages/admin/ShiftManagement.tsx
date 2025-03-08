// /src/pages/ShiftManagement.jsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftManagement.css"; // Updated CSS for styling

const localizer = momentLocalizer(moment);

// Dummy employee data for display in the overview
const dummyEmployees = [
  { id: 1, name: "Justus Fynn", roles: ["Technician", "Supervisor"] },
  { id: 2, name: "Tanha Schmidt", roles: ["Technician"] },
  { id: 3, name: "Miley Cyrus", roles: ["Supervisor"] },
];

// Helper: Check if two time ranges overlap
const isOverlap = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

const ShiftManagement = ({ currentUser = { id: 1 } }) => {
  // State for shifts: each shift has id, title, start, end, rolesRequired, assignedEmployees
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
      title: "Afternoon Shift",
      start: new Date(new Date().setHours(14, 0, 0)),
      end: new Date(new Date().setHours(18, 0, 0)),
      rolesRequired: ["Supervisor"],
      assignedEmployees: [2],
    },
  ]);

  // Calendar view state (Week view for time-axis)
  const [view, setView] = useState(Views.WEEK);

  // Shift filter state: "all", "my", or "unoccupied"
  const [calendarFilter, setCalendarFilter] = useState("all");

  // State for the shift creation/edit form
  const [newShift, setNewShift] = useState({
    title: "",
    start: "",
    end: "",
    rolesRequired: "",
    assignedEmployees: "",
  });

  // Editing mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);

  // Filter shifts based on the selected calendar filter
  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    return true;
  });

  // Prepare events for the calendar view (update title with assigned employee names)
  const calendarEvents = filteredShifts.map((shift) => ({
    ...shift,
    title:
      (shift.title || "Unnamed Shift") +
      " (" +
      (shift.assignedEmployees && shift.assignedEmployees.length > 0
        ? shift.assignedEmployees
            .map(
              (id) => dummyEmployees.find((emp) => emp.id === id)?.name || id
            )
            .join(", ")
        : "Unassigned") +
      ")",
  }));

  // Custom event style getter (example: different color for Supervisor-required shifts)
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"; // Default blue
    if (event.rolesRequired.includes("Supervisor")) {
      backgroundColor = "#2980b9";
    } else if (event.rolesRequired.includes("Technician")) {
      backgroundColor = "#27ae60";
    }
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "none",
      },
    };
  };

  // Handle form submission: add new shift or update existing one
  const handleAddOrUpdateShift = (e) => {
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

    const rolesRequired = newShift.rolesRequired
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const assignedEmployees = newShift.assignedEmployees
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((id) => !isNaN(id));

    // Conflict checking: for each assigned employee, check for overlapping shifts
    let conflictFound = false;
    assignedEmployees.forEach((empId) => {
      shifts.forEach((existingShift) => {
        if (isEditing && existingShift.id === editingShiftId) return;
        if (existingShift.assignedEmployees.includes(empId)) {
          if (isOverlap(start, end, existingShift.start, existingShift.end)) {
            conflictFound = true;
            const empName =
              dummyEmployees.find((e) => e.id === empId)?.name || empId;
            alert(
              `Conflict: Employee ${empName} already has an overlapping shift "${existingShift.title}".`
            );
          }
        }
      });
    });
    if (conflictFound) return;

    if (isEditing) {
      // Update the existing shift
      setShifts(
        shifts.map((shift) =>
          shift.id === editingShiftId
            ? { ...shift, title: newShift.title, start, end, rolesRequired, assignedEmployees }
            : shift
        )
      );
      setIsEditing(false);
      setEditingShiftId(null);
    } else {
      // Add a new shift
      const newShiftEvent = {
        id: Date.now(),
        title: newShift.title,
        start,
        end,
        rolesRequired,
        assignedEmployees,
      };
      setShifts([...shifts, newShiftEvent]);
    }
    // Reset the form
    setNewShift({ title: "", start: "", end: "", rolesRequired: "", assignedEmployees: "" });
  };

  // Handle editing a shift: pre-fill the form with shift details
  const handleEditShift = (shift) => {
    setNewShift({
      title: shift.title,
      start: moment(shift.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(shift.end).format("YYYY-MM-DDTHH:mm"),
      rolesRequired: shift.rolesRequired.join(", "),
      assignedEmployees: shift.assignedEmployees.join(", "),
    });
    setIsEditing(true);
    setEditingShiftId(shift.id);
  };

  // Handle deletion of a shift
  const handleDeleteShift = (shiftId) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      setShifts(shifts.filter((shift) => shift.id !== shiftId));
      if (isEditing && editingShiftId === shiftId) {
        setIsEditing(false);
        setEditingShiftId(null);
        setNewShift({ title: "", start: "", end: "", rolesRequired: "", assignedEmployees: "" });
      }
    }
  };

  return (
    <div className="shift-management">
      <h2>Shift Management</h2>

      {/* Shift Creation / Edit Form */}
      <div className="shift-creation">
        <h3>{isEditing ? "Edit Shift" : "Create New Shift"}</h3>
        <form onSubmit={handleAddOrUpdateShift}>
          <div className="form-row">
            <div className="form-group">
              <label>Shift Name:</label>
              <input
                type="text"
                value={newShift.title}
                onChange={(e) => setNewShift({ ...newShift, title: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date & Time:</label>
              <input
                type="datetime-local"
                value={newShift.start}
                onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date & Time:</label>
              <input
                type="datetime-local"
                value={newShift.end}
                onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Roles Required (comma separated):</label>
              <input
                type="text"
                placeholder="Supervisor, Technician"
                value={newShift.rolesRequired}
                onChange={(e) => setNewShift({ ...newShift, rolesRequired: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Assign Employees (comma separated IDs):</label>
              <input
                type="text"
                placeholder="e.g., 1,2"
                value={newShift.assignedEmployees}
                onChange={(e) => setNewShift({ ...newShift, assignedEmployees: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">{isEditing ? "Update Shift" : "Add Shift"}</button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingShiftId(null);
                  setNewShift({ title: "", start: "", end: "", rolesRequired: "", assignedEmployees: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
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

      {/* Shift Overview Table */}
      <div className="shift-overview">
        <h3>Shift Overview</h3>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Roles Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td>
                  {shift.assignedEmployees && shift.assignedEmployees.length > 0
                    ? shift.assignedEmployees
                        .map(
                          (id) =>
                            dummyEmployees.find((emp) => emp.id === id)?.name || id
                        )
                        .join(", ")
                    : "Unassigned"}
                </td>
                <td>{moment(shift.start).format("YYYY-MM-DD")}</td>
                <td>
                  {moment(shift.start).format("hh:mm A")} -{" "}
                  {moment(shift.end).format("hh:mm A")}
                </td>
                <td>{shift.rolesRequired.join(", ")}</td>
                <td>
                  <button onClick={() => handleEditShift(shift)}>Edit</button>
                  <button onClick={() => handleDeleteShift(shift.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftManagement;

