// src/pages/ShiftApprovalCalendar.tsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftApprovalCalendar.css";

import {
  fetchShifts,
  fetchProposalShifts,
  approveShiftProposal,
  rejectShiftProposal
} from "../../Services/api.ts";

import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Force English locale to start on Monday
moment.updateLocale("en", { week: { dow: 1 } });

const localizer = momentLocalizer(moment);

// Force 24-hour time format for the calendar's displays
const calendarFormats = {
  timeGutterFormat: (date: Date) => moment(date).format("HH:mm"),
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
};

interface Shift {
  id: number;
  title: string;
  shiftOwnerId: number | null;
  shiftOwner: string;
  role: string;
  start: Date;
  end: Date;
}

interface ProposalShift {
  id: number;
  employeeId: number | null;
  employee: string;
  role: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
}

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#4da8d6" strokeWidth="1" />
    <path fill="#000000" d="M7.5 12h1V7h-1v5zm0-6h1V5h-1v1z" />
  </svg>
);

const ShiftApprovalCalendar: React.FC = () => {
  const { t, i18n } = useTranslation();
  moment.locale(i18n.language);

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<ProposalShift[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [view, setView] = useState(Views.WEEK);

  const mapShifts = (apiShifts: any[]): Shift[] => {
    return apiShifts.map((shift) => ({
      id: shift.id,
      title: shift.title || t("unnamedShift"),
      shiftOwnerId: shift.shiftOwnerId ?? null,
      shiftOwner: shift.shiftOwnerName || t("unassigned"),
      role: shift.shiftOwnerRole || t("unassigned"),
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
    }));
  };

  const mapProposalShifts = (apiProposals: any[]): ProposalShift[] => {
    return apiProposals
      .filter(
        (shift) =>
          shift.status !== "ACCEPTED" &&
          shift.status !== "REJECTED" &&
          shift.status !== "CANCELLED"
      )
      .map((shift) => ({
        id: shift.id,
        employeeId: shift.employeeId ?? null,
        employee: shift.employeeName
          ? `${shift.employeeName}`
          : t("unknownEmployee") || "Unknown Employee",
        role: shift.employeeRole,
        title: shift.proposedTitle || t("unnamedShift") || "Unnamed Shift",
        start: new Date(shift.proposedStartTime),
        end: new Date(shift.proposedEndTime),
        status: shift.status,
      }));
  };

  const loadShifts = async () => {
    setLoadingShifts(true);
    try {
      const fetchedShifts = await fetchShifts();
      if (!Array.isArray(fetchedShifts)) {
        console.error("Invalid API response:", fetchedShifts);
        setLoadingShifts(false);
        return;
      }
      const formattedShifts = mapShifts(fetchedShifts);
      setShifts(formattedShifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
    setLoadingShifts(false);
  };

  const getPendingShifts = async () => {
    setLoadingPending(true);
    try {
      const fetchedPendingShifts = await fetchProposalShifts();
      if (Array.isArray(fetchedPendingShifts)) {
        const formatted = mapProposalShifts(fetchedPendingShifts);
        setPendingRequests(formatted);
      } else {
        console.error("Invalid proposals response:", fetchedPendingShifts);
      }
    } catch (error) {
      console.error(t("errorFetchingPending") || "Error fetching pending shifts:", error);
    }
    setLoadingPending(false);
  };

  useEffect(() => {
    loadShifts();
    getPendingShifts();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveShiftProposal(id);
      loadShifts();
      getPendingShifts();
    } catch (error) {
      console.error(`${t("errorApprovingShift") || "Error approving shift"} ${id}:`, error);
      alert(t("failedApprove") || "Failed to approve shift. Please try again.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectShiftProposal(id);
      loadShifts();
      getPendingShifts();
      alert(t("shiftProposalRejected") || "Shift rejected successfully.");
    } catch (error) {
      console.error(`${t("errorRejectingShift") || "Error rejecting shift"} ${id}:`, error);
      alert(t("failedReject") || "Failed to reject shift. Please try again.");
    }
  };

  const calendarEvents = shifts.map((shift) => ({
    id: shift.id,
    title: `${shift.title} - ${shift.shiftOwner}`,
    start: shift.start,
    end: shift.end,
    role: shift.role,
    shiftOwnerId: shift.shiftOwnerId,
  }));

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3498db";
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
    <div className="shift-approval-layout">
      <div className="shift-approval-content">
        <h2>{t("shiftApproval") || "Shift Approval"}</h2>

        {/* View selector for the big calendar with tooltip icon on the left */}
        <div className="view-selector">
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="calendar-view-tooltip" className="custom-tooltip">
                  {t("calendarViewTooltip", "Select a calendar view.")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon" style={{ marginRight: "8px" }}>
                <InfoIcon />
              </span>
            </OverlayTrigger>
            <select
              id="calendar-view"
              value={view}
              onChange={(e) => setView(e.target.value as Views)}
            >
              <option value={Views.MONTH}>{t("month") || "Month"}</option>
              <option value={Views.WEEK}>{t("week") || "Week"}</option>
              <option value={Views.DAY}>{t("day") || "Day"}</option>
              <option value={Views.AGENDA}>{t("agenda") || "Agenda"}</option>
            </select>
          </div>
        </div>

        {/* Calendar display */}
        <div className="calendar-container">
          {loadingShifts ? (
            <p>{t("loadingCalendar") || "Loading calendar..."}</p>
          ) : (
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
              eventPropGetter={eventStyleGetter}
              min={new Date(1970, 1, 1, 0, 0)}
              max={new Date(1970, 1, 1, 23, 59)}
              formats={calendarFormats}
            />
          )}
        </div>

        {/* Pending shift requests table */}
        <h3>{t("pendingShiftRequests") || "Pending Shift Requests"}</h3>
        {loadingPending ? (
          <p>{t("loadingPending") || "Loading pending requests..."}</p>
        ) : (
          <table className="pending-table">
            <thead>
              <tr>
                <th>{t("shift") || "Shift"}</th>
                <th>{t("employeeId") || "Employee Id"}</th>
                <th>{t("employee") || "Employee"}</th>
                <th>{t("role") || "Role"}</th>
                <th>{t("date") || "Date"}</th>
                <th>{t("time") || "Time"}</th>
                <th>{t("action") || "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.title}</td>
                  <td>{req.employeeId}</td>
                  <td>{req.employee}</td>
                  <td>{req.role}</td>
                  <td>{moment(req.start).format("YYYY-MM-DD")}</td>
                  <td>
                    {moment(req.start).format("HH:mm")} -{" "}
                    {moment(req.end).format("HH:mm")}
                  </td>
                  <td>
                    <button onClick={() => handleApprove(req.id)} className="approve-btn">
                      {t("approve") || "Approve"}
                    </button>
                    <button onClick={() => handleReject(req.id)} className="approve-btn">
                      {t("reject") || "Reject"}
                    </button>
                  </td>
                </tr>
              ))}
              {pendingRequests.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    {t("noPendingShiftRequests") || "No pending shift requests."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ShiftApprovalCalendar;
