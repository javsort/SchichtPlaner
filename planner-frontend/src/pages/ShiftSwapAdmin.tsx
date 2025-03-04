// src/pages/ShiftSwapAdmin.tsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "./ShiftSwapAdmin.css"; // Updated CSS using theme variables

// --------------------
// Data Types
// --------------------
export interface Shift {
  id: number;
  title: string;
  start: Date;
  end: Date;
  assignedEmployee: number;
}

export interface SwapRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  ownShift: Shift;
  targetEmployee: { id: number; name: string };
  targetShift: Shift;
  message: string;
  status: "Pending" | "Approved" | "Rejected";
}

// --------------------
// Dummy Data
// --------------------
const dummyShifts: Shift[] = [
  {
    id: 101,
    title: "Early Morning Shift",
    start: new Date(2025, 1, 24, 5, 0),
    end: new Date(2025, 1, 24, 9, 0),
    assignedEmployee: 1,
  },
  {
    id: 102,
    title: "Morning Shift",
    start: new Date(2025, 1, 24, 9, 0),
    end: new Date(2025, 1, 24, 13, 0),
    assignedEmployee: 1,
  },
  {
    id: 104,
    title: "Evening Shift",
    start: new Date(2025, 1, 24, 17, 0),
    end: new Date(2025, 1, 24, 21, 0),
    assignedEmployee: 2,
  },
  {
    id: 105,
    title: "Night Shift",
    start: new Date(2025, 1, 25, 0, 0),
    end: new Date(2025, 1, 25, 6, 0),
    assignedEmployee: 3,
  },
];

const dummyEmployees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
];

const initialSwapRequests: SwapRequest[] = [
  {
    id: 201,
    employeeId: 1,
    employeeName: "John Doe",
    ownShift: dummyShifts[0],
    targetEmployee: { id: 2, name: "Jane Smith" },
    targetShift: dummyShifts[2],
    message: "I have an appointment in the morning.",
    status: "Pending",
  },
  {
    id: 202,
    employeeId: 1,
    employeeName: "John Doe",
    ownShift: dummyShifts[1],
    targetEmployee: { id: 3, name: "Bob Johnson" },
    targetShift: dummyShifts[3],
    message: "",
    status: "Pending",
  },
];

// --------------------
// Component
// --------------------
const localizer = momentLocalizer(moment);

interface ShiftSwapAdminProps {
  initialRequests?: SwapRequest[];
}

const ShiftSwapAdmin: React.FC<ShiftSwapAdminProps> = ({
  initialRequests = initialSwapRequests,
}) => {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(initialRequests);
  const [view, setView] = useState(Views.WEEK);

  // Create calendar events from swapRequests (using the own shift's time)
  const calendarEvents = swapRequests.map((req) => ({
    id: req.id,
    title: `Req #${req.id} - ${req.status}`,
    start: req.ownShift.start,
    end: req.ownShift.end,
    allDay: false,
  }));

  const handleApprove = (requestId: number) => {
    if (window.confirm("Are you sure you want to approve this swap?")) {
      setSwapRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "Approved" } : req
        )
      );
      alert("Swap request approved.");
    }
  };

  const handleReject = (requestId: number) => {
    if (window.confirm("Are you sure you want to reject this swap?")) {
      setSwapRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "Rejected" } : req
        )
      );
      alert("Swap request rejected.");
    }
  };

  return (
    <div className="shift-swap-admin-container container mt-4">
      <h2 className="mb-4">Manage Shift Swap Requests</h2>

      {/* Calendar View */}
      <div className="mb-4">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(newView) => setView(newView)}
          style={{ height: 400, width: "100%" }}
        />
      </div>

      {/* Swap Requests Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Employee</th>
            <th>Your Shift</th>
            <th>Target Employee</th>
            <th>Target Shift</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {swapRequests.map((req) => (
            <tr
              key={req.id}
              className={req.status === "Approved" ? "approved-row" : ""}
            >
              <td>{req.id}</td>
              <td>{req.employeeName}</td>
              <td>
                {req.ownShift.title} (
                {moment(req.ownShift.start).format("HH:mm")} -{" "}
                {moment(req.ownShift.end).format("HH:mm")})
              </td>
              <td>{req.targetEmployee.name}</td>
              <td>
                {req.targetShift.title} (
                {moment(req.targetShift.start).format("HH:mm")} -{" "}
                {moment(req.targetShift.end).format("HH:mm")})
              </td>
              <td>{req.message || "-"}</td>
              <td>{req.status}</td>
              <td>
                {req.status === "Pending" ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(req.id)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span>{req.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftSwapAdmin;
