// src/pages/ShiftApprovalCalendar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styling/ShiftApprovalCalendar.css"; // Custom CSS using theme variables
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
  // Filter state if needed (not used in this component but you may add later)
  // const [calendarFilter, setCalendarFilter] = useState("all");

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
          status: shift.status,
        }));

        // Filter shifts based on status
        const pending = formattedShifts.filter(
          (shift) => shift.status === "PROPOSED"
        );
        const approved = formattedShifts.filter(
          (shift) => shift.status === "APPROVED"
        );

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
            employee: `Employee ${approvedShift.employeeId}`, // Replace if actual name available
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

  // Optional event styling using CSS variables (fallback to hardcoded value if needed)
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: "var(--button-bg, #27ae60)",
      borderRadius: "5px",
      opacity: 0.9,
      color: "white",
      border: "none",
    },
  });

  // File import reference and handlers (for demonstration)
  const fileInputRef = useRef(null);
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("Imported file contents:", e.target.result);
      // parse and update data as needed
    };
    reader.readAsText(file);
  };

  return (
    <div className="shift-approval-layout">
      <AdminSidebar />
      <div className="shift-approval-content">
        <h2>Shift Approval</h2>

        {/* Calendar View Selector (if needed, you can move this into CSS) */}
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
                  <button className="approve-btn" onClick={() => handleApprove(req.id)}>
                    Approve
                  </button>
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

        {/* Hidden file input for data import */}
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default ShiftApprovalCalendar;
