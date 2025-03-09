// src/pages/ShiftSwapAdmin.tsx

import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "./ShiftSwapAdmin.css";
import { useTranslation } from "react-i18next"; // <-- Import translation hook

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

const ShiftSwapAdmin: React.FC = () => {
  const { t } = useTranslation(); // Use the translation hook
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(initialSwapRequests);
  const [view, setView] = useState(Views.WEEK);

  // Create calendar events from swapRequests
  const calendarEvents = swapRequests.map((req) => ({
    id: req.id,
    title: `Req #${req.id} - ${req.status}`,
    start: req.ownShift.start,
    end: req.ownShift.end,
    allDay: false,
  }));

  const handleApprove = (requestId: number) => {
    if (window.confirm(t("approveSwapConfirm") || "Are you sure you want to approve this swap?")) {
      setSwapRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "Approved" } : req))
      );
      alert(t("swapApproved") || "Swap request approved.");
    }
  };

  const handleReject = (requestId: number) => {
    if (window.confirm(t("rejectSwapConfirm") || "Are you sure you want to reject this swap?")) {
      setSwapRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "Rejected" } : req))
      );
      alert(t("swapRejected") || "Swap request rejected.");
    }
  };

  return (
    <div className="shift-swap-admin-container container mt-4">
      <h2 className="mb-4">{t("manageShiftSwapRequests") || "Manage Shift Swap Requests"}</h2>

      {/* Calendar View */}
      <div className="calendar-container mb-4">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(newView) => setView(newView)}
        />
      </div>

      {/* Swap Requests Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>{t("requestID") || "Request ID"}</th>
            <th>{t("employee") || "Employee"}</th>
            <th>{t("yourShift") || "Your Shift"}</th>
            <th>{t("targetEmployee") || "Target Employee"}</th>
            <th>{t("targetShift") || "Target Shift"}</th>
            <th>{t("message") || "Message"}</th>
            <th>{t("status") || "Status"}</th>
            <th>{t("actions") || "Actions"}</th>
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
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-approve"
                      onClick={() => handleApprove(req.id)}
                    >
                      {t("approve") || "Approve"}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleReject(req.id)}
                    >
                      {t("reject") || "Reject"}
                    </button>
                  </div>
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
