// src/pages/ShiftSwapRequests.jsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "./ShiftSwapRequests.css";

const localizer = momentLocalizer(moment);

// Expanded dummy shifts data
const initialShifts = [
  {
    id: 101,
    title: "Morning Shift",
    start: new Date(new Date().setHours(8, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0)),
    assignedEmployee: 1,
  },
  {
    id: 102,
    title: "Afternoon Shift",
    start: new Date(new Date().setHours(13, 0, 0)),
    end: new Date(new Date().setHours(17, 0, 0)),
    assignedEmployee: 2,
  },
  {
    id: 103,
    title: "Evening Shift",
    start: new Date(new Date().setHours(18, 0, 0)),
    end: new Date(new Date().setHours(22, 0, 0)),
    assignedEmployee: 3,
  },
  {
    id: 104,
    title: "Extra Shift",
    start: new Date(new Date().setHours(7, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0)),
    assignedEmployee: 2,
  },
];

// Dummy employee data
const dummyEmployees = [
  { id: 1, name: "Justus Fynn" },
  { id: 2, name: "Tanha Schmidt" },
  { id: 3, name: "Miley Cyrus" },
];

const ShiftSwapRequests = ({ currentUser, isAdmin }) => {
  // State for shifts (displayed on calendar)
  const [shifts, setShifts] = useState(initialShifts);
  // State for swap requests (no swap occurs until approved)
  const [swapRequests, setSwapRequests] = useState([]);
  // Calendar view state
  const [view, setView] = useState(Views.WEEK);

  // Form state for employee swap request
  const [selectedOwnShift, setSelectedOwnShift] = useState("");
  const [selectedTargetEmployee, setSelectedTargetEmployee] = useState("");
  const [selectedTargetShift, setSelectedTargetShift] = useState("");
  const [message, setMessage] = useState("");

  // Compute available target shifts based on the selected target employee
  const availableTargetShifts = shifts.filter(
    (shift) => shift.assignedEmployee === Number(selectedTargetEmployee)
  );

  // Basic conflict detection: checks if the two shifts overlap
  const isSwapConflict = (ownShift, targetShift) => {
    return ownShift.start < targetShift.end && targetShift.start < ownShift.end;
  };

  // Employee: Submit a swap request (remains pending until admin approves)
  const handleSubmitSwapRequest = (e) => {
    e.preventDefault();
    const ownShift = shifts.find(
      (shift) => shift.id === Number(selectedOwnShift)
    );
    const targetShift = shifts.find(
      (shift) => shift.id === Number(selectedTargetShift)
    );

    if (!ownShift || !targetShift || !selectedTargetEmployee) {
      alert("Please select your shift, a target employee, and a target shift.");
      return;
    }

    if (isSwapConflict(ownShift, targetShift)) {
      alert("Conflict: The selected shifts overlap. Please choose a different swap option.");
      return;
    }

    // Create a new swap request with status "Pending Authorization"
    const newRequest = {
      id: Date.now(),
      employeeId: currentUser.id,
      ownShift,
      targetEmployee: dummyEmployees.find(
        (emp) => emp.id === Number(selectedTargetEmployee)
      ),
      targetShift,
      message,
      status: "Pending Authorization",
    };

    setSwapRequests([...swapRequests, newRequest]);
    // Reset the form fields
    setSelectedOwnShift("");
    setSelectedTargetEmployee("");
    setSelectedTargetShift("");
    setMessage("");
  };

  // Admin: Approve a swap request and perform the swap
  const handleApprove = (requestId) => {
    const req = swapRequests.find((r) => r.id === requestId);
    if (!req) return;
    // Only perform swap if request is still pending
    if (req.status !== "Pending Authorization") return;

    // Swap the assigned employees for the two shifts
    setShifts((prevShifts) =>
      prevShifts.map((shift) => {
        if (shift.id === req.ownShift.id) {
          return { ...shift, assignedEmployee: req.targetEmployee.id };
        } else if (shift.id === req.targetShift.id) {
          return { ...shift, assignedEmployee: req.employeeId };
        }
        return shift;
      })
    );
    // Update the request status to "Approved"
    setSwapRequests(
      swapRequests.map((r) =>
        r.id === requestId ? { ...r, status: "Approved" } : r
      )
    );
  };

  // Admin: Reject a swap request (no swap occurs)
  const handleReject = (requestId) => {
    setSwapRequests(
      swapRequests.map((r) =>
        r.id === requestId ? { ...r, status: "Rejected" } : r
      )
    );
  };

  // Prepare calendar events from shifts
  const calendarEvents = shifts.map((shift) => ({
    ...shift,
    title: `${shift.title} - ${
      dummyEmployees.find((emp) => emp.id === shift.assignedEmployee)?.name
    }`,
  }));

  return (
    <div className="shift-swap-container">
      <h2>Shift Swap Requests</h2>

      {/* Calendar View */}
      <div className="calendar-container" style={{ height: "500px", marginBottom: "30px" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(newView) => setView(newView)}
          style={{ height: 500 }}
        />
      </div>

      {/* Employee View: Swap Request Form */}
      {!isAdmin && (
        <div className="request-form">
          <h3>Request a Shift Swap</h3>
          <form onSubmit={handleSubmitSwapRequest}>
            <div className="form-group">
              <label>Your Shift</label>
              <select
                value={selectedOwnShift}
                onChange={(e) => setSelectedOwnShift(e.target.value)}
              >
                <option value="">-- Select your shift --</option>
                {shifts
                  .filter((shift) => shift.assignedEmployee === currentUser.id)
                  .map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.title} ( {moment(shift.start).format("HH:mm")} - {moment(shift.end).format("HH:mm")} )
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label>Target Employee</label>
              <select
                value={selectedTargetEmployee}
                onChange={(e) => {
                  setSelectedTargetEmployee(e.target.value);
                  setSelectedTargetShift(""); // Reset target shift when employee changes
                }}
              >
                <option value="">-- Select target employee --</option>
                {dummyEmployees
                  .filter((emp) => emp.id !== currentUser.id)
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
              </select>
            </div>
            {selectedTargetEmployee && (
              <div className="form-group">
                <label>Target Shift</label>
                <select
                  value={selectedTargetShift}
                  onChange={(e) => setSelectedTargetShift(e.target.value)}
                >
                  <option value="">-- Select target shift --</option>
                  {availableTargetShifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.title} ( {moment(shift.start).format("HH:mm")} - {moment(shift.end).format("HH:mm")} )
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Optional Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message (optional)"
              ></textarea>
            </div>
            <button type="submit">Submit Swap Request</button>
          </form>
        </div>
      )}

      {/* Admin/Manager View: List of Swap Requests */}
      {isAdmin && (
        <div className="request-list">
          <h3>All Swap Requests</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Original Shift</th>
                <th>Target Employee</th>
                <th>Requested Shift</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {swapRequests.length > 0 ? (
                swapRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>
                      {dummyEmployees.find((emp) => emp.id === req.employeeId)?.name}
                    </td>
                    <td>
                      {req.ownShift.title} ( {moment(req.ownShift.start).format("HH:mm")} - {moment(req.ownShift.end).format("HH:mm")} )
                    </td>
                    <td>{req.targetEmployee?.name}</td>
                    <td>
                      {req.targetShift.title} ( {moment(req.targetShift.start).format("HH:mm")} - {moment(req.targetShift.end).format("HH:mm")} )
                    </td>
                    <td>{req.message || "-"}</td>
                    <td>{req.status}</td>
                    <td>
                      {req.status === "Pending Authorization" ? (
                        <>
                          <button onClick={() => handleApprove(req.id)}>Approve</button>
                          <button onClick={() => handleReject(req.id)}>Reject</button>
                        </>
                      ) : (
                        <span>{req.status}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No swap requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShiftSwapRequests;
