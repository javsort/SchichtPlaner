// src/pages/ShiftSwapAdmin.tsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftSwapAdmin.css";
import { useTranslation } from "react-i18next";
import {
  fetchSwapProposals,
  acceptSwapProposal,
  declineSwapProposal,
} from "../../Services/api";

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

const localizer = momentLocalizer(moment);

const ShiftSwapAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [view, setView] = useState(Views.WEEK);

  const loadSwapRequests = async () => {
    try {
      const proposals = await fetchSwapProposals();
      setSwapRequests(proposals);
    } catch (error) {
      console.error("Error fetching swap proposals:", error);
    }
  };

  useEffect(() => {
    loadSwapRequests();
  }, []);

  const handleApprove = async (requestId: number) => {
    const swapEmployeeIdStr = prompt(
      t("enterSwapEmployeeId") || "Enter the swap employee ID:"
    );
    if (!swapEmployeeIdStr) return;
    const swapEmployeeId = parseInt(swapEmployeeIdStr, 10);
    if (isNaN(swapEmployeeId)) {
      alert(t("invalidEmployeeId") || "Invalid employee ID");
      return;
    }
    if (window.confirm(t("approveSwapConfirm") || "Are you sure you want to approve this swap?")) {
      try {
        await acceptSwapProposal(requestId.toString(), swapEmployeeId);
        alert(t("swapApproved") || "Swap request approved.");
        loadSwapRequests();
      } catch (error) {
        console.error("Error approving swap proposal:", error);
        alert(t("failedApprove") || "Failed to approve swap. Please try again.");
      }
    }
  };

  const handleReject = async (requestId: number) => {
    const managerComment = prompt(
      t("enterManagerComment") || "Enter a manager comment (optional):"
    );
    if (window.confirm(t("rejectSwapConfirm") || "Are you sure you want to reject this swap?")) {
      try {
        await declineSwapProposal(requestId.toString(), managerComment || "");
        alert(t("swapRejected") || "Swap request rejected.");
        loadSwapRequests();
      } catch (error) {
        console.error("Error rejecting swap proposal:", error);
        alert(t("failedReject") || "Failed to reject swap. Please try again.");
      }
    }
  };

  const calendarEvents = swapRequests.map((req) => ({
    id: req.id,
    title: `Req #${req.id} - ${req.status}`,
    start: new Date(req.ownShift.start),
    end: new Date(req.ownShift.end),
    allDay: false,
  }));

  const messages = {
    today: t("calendarToday"),
    previous: t("calendarBack"),
    next: t("calendarNext"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda"),
  };

  return (
    <div className="shift-swap-admin-container container mt-4">
      <h2 className="mb-4">
        {t("manageShiftSwapRequests") || "Manage Shift Swap Requests"}
      </h2>
      <div className="calendar-container mb-4">
        <Calendar
          key={i18n.language}
          localizer={localizer}
          culture={i18n.language}
          messages={messages}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(newView) => setView(newView)}
        />
      </div>
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
            <tr key={req.id} className={req.status === "Approved" ? "approved-row" : ""}>
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
