import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftApprovalCalendar.css";
import { fetchShifts, fetchProposalShifts, approveShift } from "../../Services/api.ts";
import AdminSidebar from "../../components/AdminSidebar.tsx";

const localizer = momentLocalizer(moment);

const ShiftApprovalCalendar = () => {
  // State for pending shifts (only proposed shifts)
  const [pendingRequests, setPendingRequests] = useState([]);
  
  // State for all shifts (approved + pending)
  const [shifts, setShifts] = useState([]);
  
  // Default view for the calendar
  const [view, setView] = useState(Views.WEEK);

  // Function to fetch all shifts (approved + proposed)
  const getAllShifts = async () => {
    try {
      const fetchedShifts = await fetchShifts();
      if (fetchedShifts.length > 0) {
        const formattedShifts = fetchedShifts.map((shift) => ({
          id: shift.id,
          employee: shift.employeeId ? `Employee ${shift.employeeId}` : "Unknown Employee",
          title: shift.title || "Unnamed Shift",
          start: new Date(shift.startTime),
          end: new Date(shift.endTime),
          status: shift.status, // Store status for styling
        }));
        setShifts(formattedShifts);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

   // Function to fetch pending (proposed) shifts
  const getPendingShifts = async () => {
    try {
      const fetchedPendingShifts = await fetchProposalShifts();
      if (fetchedPendingShifts.length > 0) {
        const formattedPendingShifts = fetchedPendingShifts.map((shift) => ({
          id: shift.id,
          employee: shift.employeeId ? `Employee ${shift.employeeId}` : "Unknown Employee",
          title: shift.proposedTitle || "Unnamed Shift",
          start: new Date(shift.proposedStartTime), // Ensure proper date conversion
          end: new Date(shift.proposedEndTime), // Ensure proper date conversion
          status: shift.status,
        }));
        setPendingRequests(formattedPendingShifts);
      }
    } catch (error) {
      console.error("Error fetching pending shifts:", error);
    }
  };

  // Fetch all shifts and pending shifts on component mount
  useEffect(() => {
    getAllShifts();
    getPendingShifts();
  }, []);

  // Handler to approve a shift request
  const handleApprove = async (id) => {
    try {
      await approveShift(id); // Call backend to approve the shift
      getAllShifts(); // Fetch updated shifts immediately after approval
      getPendingShifts(); // Refresh pending requests as well
    } catch (error) {
      console.error(`Error approving shift ${id}:`, error);
      alert("Failed to approve shift. Please try again.");
    }
  };

  // Convert shifts into calendar events
  const calendarEvents = shifts.map((shift) => ({
    ...shift,
    title: `${shift.title} - ${shift.employee}`,
  }));

  // Style shifts based on status
  const eventStyleGetter = (event) => {
    let backgroundColor;
    if (event.status === "APPROVED") {
      backgroundColor = "#27ae60"; // Green for approved shifts
    } else if (event.status === "PROPOSED") {
      backgroundColor = "#f39c12"; // Yellow for proposed shifts
    } else {
      backgroundColor = "#3498db"; // Default blue
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

  return (
    <div className="shift-approval-layout">
      <AdminSidebar />
      <div className="shift-approval-content">
        <h2>Shift Approval</h2>

        {/* Calendar View Selector */}
        <div className="view-selector">
          <label htmlFor="calendar-view">Calendar View: </label>
          <select id="calendar-view" value={view} onChange={(e) => setView(e.target.value)}>
            <option value={Views.MONTH}>Month</option>
            <option value={Views.WEEK}>Week</option>
            <option value={Views.DAY}>Day</option>
            <option value={Views.AGENDA}>Agenda</option>
          </select>
        </div>

        {/* Calendar */}
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(newView) => setView(newView)}
            eventPropGetter={eventStyleGetter}
            min={new Date(1970, 1, 1, 0, 0)}
            max={new Date(1970, 1, 1, 23, 59)}
          />
        </div>

        {/* Pending Shift Requests */}
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
                <td>{req.title || "Unnamed Shift"}</td>
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
    </div>
  );
};

export default ShiftApprovalCalendar;
