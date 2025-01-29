import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ShiftManagement = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newShift, setNewShift] = useState({
    title: "",
    start: "",
    end: "",
    role: "",
    assignedTo: "",
  });
  const [filter, setFilter] = useState("all");

  // Function to check for conflicts
  const hasConflict = (newStart, newEnd) => {
    return events.some(
      (event) =>
        (newStart >= event.start && newStart < event.end) ||
        (newEnd > event.start && newEnd <= event.end)
    );
  };

  // Add new shift
  const handleAddShift = (e) => {
    e.preventDefault();

    const startDate = new Date(newShift.start);
    const endDate = new Date(newShift.end);

    if (startDate >= endDate) {
      alert("End time must be after start time.");
      return;
    }

    if (hasConflict(startDate, endDate)) {
      alert("This shift overlaps with an existing shift.");
      return;
    }

    setEvents([...events, { ...newShift, start: startDate, end: endDate }]);
    setShowForm(false);
    setNewShift({ title: "", start: "", end: "", role: "", assignedTo: "" });
  };

  // Filter shifts
  const filteredEvents = events.filter((event) => {
    if (filter === "my") return event.assignedTo === "Me";
    if (filter === "unoccupied") return !event.assignedTo;
    return true;
  });

  return (
    <div>
      <h2>Shift Management</h2>

      {/* Filter Buttons */}
      <div>
        <button onClick={() => setFilter("all")}>All Shifts</button>
        <button onClick={() => setFilter("my")}>My Shifts</button>
        <button onClick={() => setFilter("unoccupied")}>Unoccupied Shifts</button>
        <button onClick={() => setShowForm(!showForm)}>Create Shift</button>
      </div>

      {/* Shift Creation Form */}
      {showForm && (
        <form onSubmit={handleAddShift}>
          <input
            type="text"
            placeholder="Shift Name"
            value={newShift.title}
            onChange={(e) => setNewShift({ ...newShift, title: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={newShift.start}
            onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={newShift.end}
            onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Role (e.g., Supervisor, Technician)"
            value={newShift.role}
            onChange={(e) => setNewShift({ ...newShift, role: e.target.value })}
          />
          <input
            type="text"
            placeholder="Assign to (optional)"
            value={newShift.assignedTo}
            onChange={(e) => setNewShift({ ...newShift, assignedTo: e.target.value })}
          />
          <button type="submit">Add Shift</button>
        </form>
      )}

      {/* Calendar */}
      <div style={{ height: "500px", marginTop: "20px" }}>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>

      {/* Shift Overview */}
      <h3>Shift Overview</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Shift Name</th>
            <th>Date & Time</th>
            <th>Role</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event, index) => (
            <tr key={index}>
              <td>{event.title}</td>
              <td>{moment(event.start).format("LLL")} - {moment(event.end).format("LLL")}</td>
              <td>{event.role || "N/A"}</td>
              <td>{event.assignedTo || "Unoccupied"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftManagement;

