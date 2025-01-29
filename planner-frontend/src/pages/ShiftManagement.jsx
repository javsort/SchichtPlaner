import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ShiftManagement = () => {
  const [events, setEvents] = useState([
    {
      title: "Team Meeting (10:00 AM - 11:00 AM)",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
  ]);

  const [newShift, setNewShift] = useState({
    title: "",
    start: "",
    end: "",
  });

  const handleAddShift = (e) => {
    e.preventDefault();
    
    if (!newShift.title || !newShift.start || !newShift.end) {
      alert("Please fill out all fields!");
      return;
    }

    const start = new Date(newShift.start);
    const end = new Date(newShift.end);

    if (start >= end) {
      alert("End time must be after start time!");
      return;
    }

    const formattedStartTime = moment(start).format("hh:mm A");
    const formattedEndTime = moment(end).format("hh:mm A");
    
    const newEvent = {
      title: `${newShift.title} (${formattedStartTime} - ${formattedEndTime})`,
      start,
      end,
    };

    setEvents([...events, newEvent]);
    setNewShift({ title: "", start: "", end: "" });
  };

  return (
    <div>
      <h2>Shift Management</h2>

      {/* Shift Creation Form */}
      <form onSubmit={handleAddShift} style={{ marginBottom: "20px" }}>
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
        <button type="submit">Add Shift</button>
      </form>

      {/* Calendar View */}
      <div style={{ height: "500px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default ShiftManagement;
