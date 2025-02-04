// /src/pages/ShiftApprovalCalendar.jsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftApprovalCalendar.css";

const localizer = momentLocalizer(moment);

const ShiftApprovalCalendar = () => {
  // Dummy pending shift requests (with dates in February 2025)
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      title: "Morning Shift",
      employee: "John Doe",
      start: new Date("2025-02-10T08:00"),
      end: new Date("2025-02-10T12:00"),
    },
    {
      id: 2,
      title: "Evening Shift",
      employee: "Jane Smith",
      start: new Date("2025-02-12T14:00"),
      end: new Date("2025-02-12T18:00"),
    },
    {
      id: 3,
      title: "Night Shift",
      employee: "Bob Johnson",
      start: new Date("2025-02-15T20:00"),
      end: new Date("2025-02-15T23:00"),
    },
    {
      id: 4,
      title: "Afternoon Shift",
      employee: "Alice Brown",
      start: new Date("2025-02-18T13:00"),
      end: new Date("2025-02-18T17:00"),
    },
  ]);

  // Approved shifts that will be displayed on the calendar
  const [approvedShifts, setApprovedShifts] = useState([]);

  // Calendar view state; default to Week view.
  const [view, setView] = useState(Views.WEEK);

  // Handler to approve a pending shift request
  const handleApprove = (id) => {
    const shiftToApprove = pendingRequests.find((req) => req.id === id);
    if (shiftToApprove) {
      // Remove from pending requests
      setPendingRequests(pendingRequests.filter((req) => req.id !== id));
      // Add to approved shifts with a status field
      setApprovedShifts([...approvedShifts, { ...shiftToApprove, status: "approved" }]);
    }
  };

  // Prepare events for the calendar from approved shifts.
  // We format the event title as "Shift Title - Employee".
  const calendarEvents = approvedShifts.map((shift) => ({
    ...shift,
    title: `${shift.title} - ${shift.employee}`,
  }));

  // Custom event style getter: use a green background for approved shifts.
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "#27ae60", // Green for approved shifts
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "none",
      },
    };
  };

  return (
    <div className="shift-approval-calendar">
      <h2>Shift Approval</h2>

      {/* Calendar View Selector */}
      <div className="view-selector">
        <label htmlFor="calendar-view">Calendar View: </label>
        <select
          id="calendar-view"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value={Views.MONTH}>Month</option>
          <option value={Views.WEEK}>Week</option>
          <option value={Views.DAY}>Day</option>
          <option value={Views.AGENDA}>Agenda</option>
        </select>
      </div>

      {/* Approved Shifts Calendar */}
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
          // Display full 24 hours:
          min={new Date(1970, 1, 1, 0, 0)}
          max={new Date(1970, 1, 1, 23, 59)}
        />
      </div>

      {/* Pending Shift Requests Table */}
      <h3>Pending Shift Requests</h3>
      <table className="pending-table">
        <thead>
          <tr>
            <th>Shift</th>
            <th>Employee</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.map((req) => (
            <tr key={req.id}>
              <td>{req.title}</td>
              <td>{req.employee}</td>
              <td>{moment(req.start).format("YYYY-MM-DD")}</td>
              <td>
                {moment(req.start).format("hh:mm A")} -{" "}
                {moment(req.end).format("hh:mm A")}
              </td>
              <td>
                <button onClick={() => handleApprove(req.id)}>Approve</button>
              </td>
            </tr>
          ))}
          {pendingRequests.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No pending shift requests.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftApprovalCalendar;
