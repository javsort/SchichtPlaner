// src/pages/ShiftSwapAdmin.tsx
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftSwapAdmin.css";
import { useTranslation } from "react-i18next";
import { 
  fetchAllSwapProposals,
  approveSwapProposal,
  declineSwapProposal 
} from "../../Services/api.ts";

export interface Shift {
  id: number;
  title: string;
  start: Date;
  end: Date;
  assignedEmployees: number[]; // now an array of candidate employee IDs
}

export interface SwapRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  // ownShift may sometimes be missing; we'll synthesize one if needed.
  ownShift?: Shift;
  // Minimal fields available if ownShift is missing:
  currentShiftId?: number;
  proposedTitle?: string;
  proposedStartTime?: string;
  proposedEndTime?: string;
  // targetEmployee is now optional; admin will select one if not provided.
  targetEmployee?: { id: number; name: string };
  targetShift: Shift;
  message: string;
  status: "Pending" | "Approved" | "Rejected";
}

type CalendarView = "month" | "week" | "day" | "agenda";

const localizer = momentLocalizer(moment);

const ShiftSwapAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [view, setView] = useState<CalendarView>(Views.WEEK as CalendarView);
  
  // Notification state for toast messages
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Function to show toast notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Load swap proposals from backend on mount and when refreshed
  const loadProposals = async () => {
    try {
      const proposals = (await fetchAllSwapProposals()) as SwapRequest[];
      setSwapRequests(proposals);
    } catch (error) {
      console.error("Error loading proposals:", error);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  // Helper function to ensure we have a valid ownShift object
  const getOwnShift = (req: SwapRequest): Shift => {
    if (req.ownShift && req.ownShift.start && req.ownShift.end) {
      return req.ownShift;
    }
    // If ownShift is missing, synthesize one using minimal fields
    return {
      id: req.currentShiftId || 0,
      title: req.proposedTitle || t("unnamedShift"),
      start: req.proposedStartTime ? new Date(req.proposedStartTime) : new Date(),
      end: req.proposedEndTime ? new Date(req.proposedEndTime) : new Date(),
      assignedEmployees: req.targetShift.assignedEmployees || []
    };
  };

  // Map swap requests to calendar events.
  const calendarEvents = swapRequests.map((req) => {
    const ownShift = getOwnShift(req);
    return {
      id: req.id,
      title: `Req #${req.id} - ${req.status}`,
      start: ownShift.start,
      end: ownShift.end,
      allDay: false,
    };
  });

  // In the approval handler, ensure a candidate is selected.
  const handleApprove = async (requestId: number) => {
    const swapRequest = swapRequests.find(r => r.id === requestId);
    if (!swapRequest?.targetEmployee) {
      alert(t("selectCandidatePrompt") || "Please select a candidate for swap.");
      return;
    }
    try {
      await approveSwapProposal(requestId.toString(), swapRequest.targetEmployee.id);
      await loadProposals();
      showNotification(t("swapApproved") || "Swap request approved.", "success");
    } catch (error) {
      showNotification(t("errorApprovingSwap") || "Error approving swap.", "error");
    }
  };

  const handleReject = async (requestId: number) => {
    const managerComment = window.prompt(
      t("enterManagerComment") || "Enter manager comment (optional):",
      ""
    );
    try {
      await declineSwapProposal(requestId.toString(), managerComment || "");
      await loadProposals();
      showNotification(t("swapRejected") || "Swap request rejected.", "error");
    } catch (error) {
      showNotification(t("errorRejectingSwap") || "Error rejecting swap.", "error");
    }
  };

  // Define messages for the Calendar toolbar
  const messages = {
    today: t("calendarToday"),
    previous: t("calendarBack"),
    next: t("calendarNext"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda")
  };

  return (
    <div className="shift-swap-admin-container container mt-4">
      {/* Toast Notification */}
      {notification && (
        <div className={`notification-toast ${notification.type} show`}>
          {notification.message}
        </div>
      )}

      <h2 className="mb-4">{t("manageShiftSwapRequests") || "Manage Shift Swap Requests"}</h2>

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
          onView={(newView) => setView(newView as CalendarView)}
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
          {swapRequests.map((req) => {
            const ownShift = getOwnShift(req);
            return (
              <tr key={req.id} className={req.status === "Approved" ? "approved-row" : ""}>
                <td>{req.id}</td>
                <td>{req.employeeName}</td>
                <td>
                  {ownShift.title} (
                  {moment(ownShift.start).format("HH:mm")} -{" "}
                  {moment(ownShift.end).format("HH:mm")})
                </td>
                <td>
                  {req.targetEmployee ? (
                    req.targetEmployee.name
                  ) : (
                    <select
                      value={req.targetEmployee?.id || ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        // Update the targetEmployee property for this swap request in state
                        setSwapRequests((prev: SwapRequest[]) =>
                          prev.map((item: SwapRequest): SwapRequest =>
                            item.id === req.id
                              ? {
                                  ...item,
                                  targetEmployee: { id: selectedId, name: t("employee") + " #" + selectedId },
                                }
                              : item
                          )
                        );
                      }}
                    >
                      <option value="">{t("selectCandidate") || "Select Candidate"}</option>
                      {req.targetShift.assignedEmployees.map((candidateId) => (
                        <option key={candidateId} value={candidateId}>
                          {t("employee")} #{candidateId}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftSwapAdmin;
