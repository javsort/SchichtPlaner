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
  fetchShifts,
  getAllUsers,
  approveSwapProposal,
  declineSwapProposal 
} from "../../Services/api.ts";

export interface Shift {
  id: number;
  title: string;
  start: Date;
  end: Date;
  employeeId?: number | null;
  shiftOwner?: string;
  role?: string;
}

export interface SwapRequest {
  id: number;
  employeeId: number;
  ownShift?: Shift;
  currentShiftId?: number;
  proposedTitle?: string;
  proposedStartTime?: string;
  proposedEndTime?: string;
  targetEmployee?: { id: number; name: string };
  targetShift?: Shift;
  message: string;
  status: "PROPOSED" | "ACCEPTED" | "REJECTED";
}

type CalendarView = "month" | "week" | "day" | "agenda";
const localizer = momentLocalizer(moment);

const ShiftSwapAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [view, setView] = useState<CalendarView>(Views.WEEK as CalendarView);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error"; } | null>(null);

  // State for shifts and employees loaded from the backend:
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);

  // Toast notifications
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Load swap proposals from backend
  const loadProposals = async () => {
    try {
      const proposals = (await fetchAllSwapProposals()) as SwapRequest[];
      setSwapRequests(proposals);
    } catch (error) {
      console.error("Error loading proposals:", error);
    }
  };

  // Load shifts from backend
  const loadShifts = async () => {
    try {
      const fetchedShifts = await fetchShifts();
      const mapped: Shift[] = fetchedShifts.map((shift: any) => {
        const id = shift.id;
        const title = shift.title || t("unnamedShift");
        const employeeId =
          shift.shiftOwnerId !== null && shift.shiftOwnerId !== undefined
            ? Number(shift.shiftOwnerId)
            : null;
        const shiftOwner = shift.shiftOwnerName || t("unassigned");
        const role = shift.shiftOwnerRole || t("unassigned");
        const start = shift.startTime ? new Date(shift.startTime) : new Date();
        const end = shift.endTime ? new Date(shift.endTime) : new Date();
        return { id, title, employeeId, shiftOwner, role, start, end };
      });
      setShifts(mapped);
    } catch (error) {
      console.error("Error loading shifts:", error);
    }
  };

  // Load employees from backend
  const loadEmployees = async () => {
    try {
      const users = await getAllUsers();
      const employeeList = users.map((user: any) => ({
        id: user.id,
        name: user.username,
      }));
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  useEffect(() => {
    loadProposals();
    loadShifts();
    loadEmployees();
  }, []);

  // Helper: Get a valid ownShift for a swap request.
  const getOwnShift = (req: SwapRequest): Shift => {
    if (req.ownShift && req.ownShift.start && req.ownShift.end) {
      return req.ownShift;
    }
  
    // Find the shift from the loaded shifts
    const matchedShift = shifts.find(shift => shift.id === req.currentShiftId);
  
    if (matchedShift) {
      return matchedShift;
    }
  
    // Fallback shift if none is found
    return {
      id: req.currentShiftId || 0,
      title: req.proposedTitle || t("unnamedShift"),
      start: req.proposedStartTime ? new Date(req.proposedStartTime) : new Date(),
      end: req.proposedEndTime ? new Date(req.proposedEndTime) : new Date(),
      employeeId: req.employeeId || null,
      shiftOwner: t("unassigned"),
      role: t("unassigned"),
    };
  };
  
  

  // Helper: Look up employee name by ID.
  const getEmployeeName = (id: number): string => {
    const found = employees.find(emp => emp.id === id);
    return found ? found.name : `${t("employee")} #${id}`;
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

  // Approve and reject handlers.
  const handleApprove = async (requestId: number) => {
    try {
      const swapRequest = swapRequests.find(r => r.id === requestId);
      
      if (!swapRequest) {
        console.error(`Could not find swap request with ID ${requestId}`);
        showNotification(t("errorApprovingSwap") || "Error: Swap request not found.", "error");
        return;
      }
      
      if (!swapRequest.targetEmployee) {
        console.warn(`No target employee selected for swap request ${requestId}`);
        showNotification(t("selectCandidatePrompt") || "Please select a candidate for swap.", "error");
        return;
      }
      
      console.log("Approving swap for proposal", requestId);
      console.log("Target employee:", swapRequest.targetEmployee);
      console.log("Own shift details:", getOwnShift(swapRequest));
      
      try {
        // First, try to validate the target employee exists
        const employeeExists = employees.some(emp => emp.id === swapRequest.targetEmployee!.id);
        if (!employeeExists) {
          console.error(`Target employee with ID ${swapRequest.targetEmployee.id} not found in available employees list`);
          showNotification(t("errorApprovingSwap") || "Error: Target employee not found.", "error");
          return;
        }
        
        // Now call the API to approve the swap
        await approveSwapProposal(
          requestId.toString(), 
          swapRequest.targetEmployee.id.toString()
        );
        
        // If successful, reload proposals
        await loadProposals();
        showNotification(t("swapApproved") || "Swap request approved.", "success");
      } catch (error: any) {
        // Enhanced error reporting
        console.error("Error in handleApprove:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        showNotification(
          t("errorApprovingSwap") || 
          `Error approving swap: ${error.response?.data?.message || error.message || "Unknown error"}`,
          "error"
        );
      }
    } catch (outerError) {
      console.error("Unexpected error in handleApprove:", outerError);
      showNotification(t("errorApprovingSwap") || "Unexpected error approving swap.", "error");
    }
  };

  const handleReject = async (requestId: number) => {
    const managerComment = window.prompt(t("enterManagerComment") || "Enter manager comment (optional):", "");
    try {
      await declineSwapProposal(requestId.toString(), managerComment || "");
      await loadProposals();
      showNotification(t("swapRejected") || "Swap request rejected.", "error");
    } catch (error) {
      console.error("Error in handleReject:", error);
      showNotification(t("errorRejectingSwap") || "Error rejecting swap.", "error");
    }
  };

  // Updated candidate list builder:
  const buildCandidateList = (req: SwapRequest): number[] => {
    const candidateIds: number[] = [];
  
    const matchedShifts = shifts.filter(
      shift => shift.title.trim().toLowerCase() === req.proposedTitle?.trim().toLowerCase()
    );
  
    matchedShifts.forEach(shift => {
      if (shift.employeeId && shift.employeeId !== req.employeeId) {
        candidateIds.push(shift.employeeId);
      }
    });
  
    return candidateIds;
  };
   

  // Define messages for the calendar toolbar.
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
            <th>{t("actions") || "Actions"}</th>
          </tr>
        </thead>
        <tbody>
          {swapRequests.map((req: SwapRequest) => {
            const ownShift = getOwnShift(req);
            const candidateIds = buildCandidateList(req);
            return (
              <tr key={req.id} className={req.status !== "PROPOSED" ? "approved-row" : ""}>
                <td>{req.id}</td>
                <td>{getEmployeeName(req.employeeId)}</td>
                <td>
                  {ownShift.title} ({moment(ownShift.start).format("HH:mm")} - {moment(ownShift.end).format("HH:mm")})
                </td>
                <td>
                  {candidateIds.length > 0 ? (
                    <select
                      value={req.targetEmployee ? req.targetEmployee.id.toString() : ""}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        setSwapRequests((prev: SwapRequest[]) =>
                          prev.map((item: SwapRequest): SwapRequest =>
                            item.id === req.id
                              ? {
                                  ...item,
                                  targetEmployee: {
                                    id: selectedId,
                                    name: getEmployeeName(selectedId),
                                  },
                                }
                              : item
                          )
                        );
                      }}
                    >
                      <option value="">{t("selectCandidate") || "Select Candidate"}</option>
                      {candidateIds.map((candidateId: number) => (
                        <option key={candidateId} value={candidateId}>
                          {getEmployeeName(candidateId)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{t("noEligibleCandidates") || "No eligible candidates"}</span>
                  )}
                </td>
                <td>
                  {req.status === "PROPOSED" ? (
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-approve"
                        onClick={() => handleApprove(req.id)}
                        disabled={!req.targetEmployee}
                      >
                        {t("approve") || "Accept"}
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
