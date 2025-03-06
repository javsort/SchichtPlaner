import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftApprovalCalendar.css";
import { fetchShifts, approveShift } from "../../Services/api.ts";
import AdminSidebar from "../../components/AdminSidebar.tsx";

const localizer = momentLocalizer(moment);

const ShiftApprovalCalendar = () => {
  // State for pending shifts fetched from API
  const [pendingRequests, setPendingRequests] = useState([]);
  
  // State for approved shifts
  const [approvedShifts, setApprovedShifts] = useState([]);
  
  // Default view for the calendar
  const [view, setView] = useState(Views.WEEK);

  // Fetch shifts when the component mounts
  useEffect(() => {
    const getShifts = async () => {
      const shifts = await fetchShifts();
      if (shifts.length > 0) {
        // Map API response to the format used in the component
        const formattedShifts = shifts.map((shift) => ({
          id: shift.id,
          employee: `Employee ${shift.employeeId}`, // Replace with actual employee name if available
          title: shift.proposedTitle || "Unnamed Shift",
          start: new Date(shift.proposedStartTime),
          end: new Date(shift.proposedEndTime),
          status: shift.status
        }));

        // Filter shifts based on status
        const pending = formattedShifts.filter(shift => shift.status === "PROPOSED");
        const approved = formattedShifts.filter(shift => shift.status === "APPROVED");

        setPendingRequests(pending);
        setApprovedShifts(approved);
      }
    };

    getShifts();
  }, []);

  // Handler to approve a shift request
  const handleApprove = async (id) => {
    try {
      const approvedShift = await approveShift(id);
  
      if (approvedShift.status === "ACCEPTED") {
        // Update state: remove from pending and add to approved
        setPendingRequests(pendingRequests.filter((req) => req.id !== id));
  
        setApprovedShifts((prevApproved) => [
          ...prevApproved,
          {
            id: approvedShift.id,
            employee: `Employee ${approvedShift.employeeId}`, // Replace if actual name is available
            title: approvedShift.proposedTitle || "Unnamed Shift",
            start: new Date(approvedShift.proposedStartTime),
            end: new Date(approvedShift.proposedEndTime),
            status: approvedShift.status, 
          },
        ]);
  
        console.log(`Shift ${id} approved successfully`);
      }
    } catch (error) {
      console.error(`Error approving shift ${id}:`, error);
      alert("Failed to approve shift. Please try again.");
    }
  };

  // Prepare events for the calendar from approved shifts
  const calendarEvents = approvedShifts.map((shift) => ({
    ...shift,
    title: `${shift.title} - ${shift.employee}`,
  }));

  // Custom event style getter for the calendar
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: "#27ae60", // Green for approved shifts
      borderRadius: "5px",
      opacity: 0.9,
      color: "white",
      border: "none",
    },
  });

  return (
    <div className="shift-approval-layout">
      <AdminSidebar />
      <div className="shift-approval-content">
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

        {/* Calendar 
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
            min={new Date(1970, 1, 1, 0, 0)}
            max={new Date(1970, 1, 1, 23, 59)}
          />
        </div>*/}

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
