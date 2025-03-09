// src/pages/ShiftApprovalCalendar.tsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftApprovalCalendar.css";
import { fetchShifts, proposeShift, approveShift } from "../../Services/api.ts";
import { useTranslation } from "react-i18next";

const localizer = momentLocalizer(moment);

const ShiftApprovalCalendar: React.FC = () => {
  const { t } = useTranslation();

  // State for pending shifts (only proposed shifts)
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  
  // State for all shifts (approved + pending)
  const [shifts, setShifts] = useState<any[]>([]);

  // Loading states
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  
  // Default view for the calendar
  const [view, setView] = useState(Views.WEEK);

  // Fetch all shifts (approved + proposed)
  const getAllShifts = async () => {
    setLoadingShifts(true);
    try {
      const fetchedShifts = await fetchShifts();
      if (fetchedShifts.length > 0) {
        const formattedShifts = fetchedShifts.map((shift: any) => ({
          id: shift.id,
          employee: shift.employeeId
            ? `${t("employee")} ${shift.employeeId}`
            : t("unknownEmployee") || "Unknown Employee",
          title: shift.title || t("unnamedShift") || "Unnamed Shift",
          start: new Date(shift.startTime),
          end: new Date(shift.endTime),
          status: shift.status // e.g., "APPROVED", "PROPOSED"
        }));
        setShifts(formattedShifts);
      }
    } catch (error) {
      console.error(t("errorFetchingShifts") || "Error fetching shifts:", error);
    }
    setLoadingShifts(false);
  };

  // Fetch pending (proposed) shifts
  const getPendingShifts = async () => {
    setLoadingPending(true);
    try {
      const fetchedPendingShifts = await proposeShift();
      if (fetchedPendingShifts.length > 0) {
        const formattedPendingShifts = fetchedPendingShifts
          .filter((shift: any) => shift.status !== "ACCEPTED") // only proposed
          .map((shift: any) => ({
            id: shift.id,
            employee: shift.employeeId
              ? `${t("employee")} ${shift.employeeId}`
              : t("unknownEmployee") || "Unknown Employee",
            title: shift.proposedTitle || t("unnamedShift") || "Unnamed Shift",
            start: new Date(shift.proposedStartTime),
            end: new Date(shift.proposedEndTime),
            status: shift.status
          }));
        setPendingRequests(formattedPendingShifts);
      }
    } catch (error) {
      console.error(t("errorFetchingPending") || "Error fetching pending shifts:", error);
    }
    setLoadingPending(false);
  };

  // Approve a shift
  const handleApprove = async (id: number) => {
    try {
      await approveShift(id);
      getAllShifts();
      getPendingShifts();
    } catch (error) {
      console.error(
        `${t("errorApprovingShift") || "Error approving shift"} ${id}:`,
        error
      );
      alert(t("failedApprove") || "Failed to approve shift. Please try again.");
    }
  };

  // Convert shifts into calendar events
  const calendarEvents = shifts.map((shift) => ({
    ...shift,
    title: `${shift.title} - ${shift.employee}`
  }));

  // Style shifts based on status
  const eventStyleGetter = (event: any) => {
    let backgroundColor;
    if (event.status === "APPROVED") {
      backgroundColor = "#27ae60"; // Green
    } else if (event.status === "PROPOSED") {
      backgroundColor = "#f39c12"; // Yellow
    } else {
      backgroundColor = "#3498db"; // Blue
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "none"
      }
    };
  };

  // Fetch data on component mount
  useEffect(() => {
    getAllShifts();
    getPendingShifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shift-approval-layout">
      <div className="shift-approval-content">
        <h2>{t("shiftApproval") || "Shift Approval"}</h2>

        {/* Calendar View Selector */}
        <div className="view-selector">
          <label htmlFor="calendar-view">
            {t("calendarView") || "Calendar View:"}
          </label>
          <select
            id="calendar-view"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value={Views.MONTH}>{t("month") || "Month"}</option>
            <option value={Views.WEEK}>{t("week") || "Week"}</option>
            <option value={Views.DAY}>{t("day") || "Day"}</option>
            <option value={Views.AGENDA}>{t("agenda") || "Agenda"}</option>
          </select>
        </div>

        {/* Calendar */}
        <div className="calendar-container">
          {loadingShifts ? (
            <p>{t("loadingCalendar") || "Loading calendar..."}</p>
          ) : (
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
          )}
        </div>

        {/* Pending Shift Requests */}
        <h3>{t("pendingShiftRequests") || "Pending Shift Requests"}</h3>
        {loadingPending ? (
          <p>{t("loadingPending") || "Loading pending requests..."}</p>
        ) : (
          <table className="pending-table">
            <thead>
              <tr>
                <th>{t("shift") || "Shift"}</th>
                <th>{t("employee") || "Employee"}</th>
                <th>{t("date") || "Date"}</th>
                <th>{t("time") || "Time"}</th>
                <th>{t("action") || "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.title || t("unnamedShift")}</td>
                  <td>{req.employee}</td>
                  <td>{moment(req.start).format("YYYY-MM-DD")}</td>
                  <td>
                    {moment(req.start).format("hh:mm A")} -{" "}
                    {moment(req.end).format("hh:mm A")}
                  </td>
                  <td>
                    <button onClick={() => handleApprove(req.id)}>
                      {t("approve") || "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
              {pendingRequests.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
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
