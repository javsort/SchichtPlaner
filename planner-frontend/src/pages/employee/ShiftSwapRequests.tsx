// src/pages/employee/ShiftSwapRequests.tsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth, AuthUser } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import "./ShiftSwapRequests.css";
import { fetchAllSwapProposals } from "../../Services/api.ts";

// Extend the AuthUser type with additional properties used in this component.
interface ExtendedAuthUser extends AuthUser {
  id: number;
  name: string;
}

export interface Shift {
  id: number;
  title: string;
  start: Date;
  end: Date;
  assignedEmployee: number;
}

// Updated SwapRequest interface without targetEmployee and message fields.
export interface SwapRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  ownShift: Shift;
  targetShift: Shift;
  status: "Pending" | "Approved" | "Rejected";
}

type CalendarView = "month" | "week" | "day" | "agenda";

const localizer = momentLocalizer(moment);

const ShiftSwapRequests: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  // Cast or default to an ExtendedAuthUser type
  const currentUser: ExtendedAuthUser =
    (user as ExtendedAuthUser) || { id: 1, name: "John Doe", email: "", role: "" };

  // Set calendar messages based on translations.
  const messages = {
    today: t("calendarToday"),
    previous: t("calendarBack"),
    next: t("calendarNext"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda")
  };

  // State for form selections.
  const [selectedOwnShift, setSelectedOwnShift] = useState("");
  const [selectedTargetShift, setSelectedTargetShift] = useState("");
  const [view, setView] = useState<CalendarView>(Views.WEEK as CalendarView);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);

  // Load swap proposals for the current user on mount.
  useEffect(() => {
    const loadUserSwapProposals = async () => {
      try {
        const proposals = await fetchAllSwapProposals();
        const userProposals = proposals.filter(
          (req: SwapRequest) => req.employeeId === Number(currentUser.id)
        );
        setSwapRequests(userProposals);
      } catch (error) {
        console.error("Error loading swap proposals:", error);
      }
    };
    loadUserSwapProposals();
  }, [currentUser.id]);

  // For demonstration purposes, define a dummy shifts array.
  // In production, you would fetch this list from your backend.
  const shifts: Shift[] = [
    {
      id: 1,
      title: "Morning Shift",
      start: new Date("2025-02-26T08:00:00"),
      end: new Date("2025-02-26T12:00:00"),
      assignedEmployee: currentUser.id, // User’s own shift
    },
    {
      id: 2,
      title: "Evening Shift",
      start: new Date("2025-02-26T14:00:00"),
      end: new Date("2025-02-26T18:00:00"),
      assignedEmployee: 2, // A target shift from another employee
    },
  ];

  // Filter shifts: "Your Shift" are those assigned to the current user;
  // "Targeted Shift" are those NOT assigned to the current user.
  const ownShifts = shifts.filter(
    (shift) => shift.assignedEmployee === currentUser.id
  );
  const targetShifts = shifts.filter(
    (shift) => shift.assignedEmployee !== currentUser.id
  );

  const handleSubmitSwapRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ownShift = shifts.find((shift) => shift.id === Number(selectedOwnShift));
    const targetShift = shifts.find((shift) => shift.id === Number(selectedTargetShift));

    if (!ownShift || !targetShift) {
      alert(t("selectRequiredFields") || "Please select your shift and target shift.");
      return;
    }

    const newRequestData: Omit<SwapRequest, "id"> = {
      employeeId: Number(currentUser.id),
      employeeName: currentUser.name,
      ownShift,
      targetShift,
      status: "Pending"
    };

    const newRequest: SwapRequest = { id: Date.now(), ...newRequestData };

    // Optionally, you could post this new request to your backend.
    setSwapRequests((prev) => [...prev, newRequest]);
    alert(t("swapRequestSubmitted") || "Swap request submitted!");

    setSelectedOwnShift("");
    setSelectedTargetShift("");
  };

  return (
    <div className="shift-swap-container">
      <h2>{t("requestShiftSwap") || "Request a Shift Swap"}</h2>
      <div className="row">
        <div className="col-md-8">
          <Calendar
            key={i18n.language}
            localizer={localizer}
            culture={i18n.language}
            messages={messages}
            events={shifts}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(newView) => setView(newView as CalendarView)}
            style={{ height: 500, width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <form onSubmit={handleSubmitSwapRequest} className="request-form">
            <div className="form-group">
              <label>{t("yourShift") || "Your Shift:"}</label>
              <select
                className="form-select"
                value={selectedOwnShift}
                onChange={(e) => setSelectedOwnShift(e.target.value)}
              >
                <option value="">{t("selectYourShift") || "-- Select Your Shift --"}</option>
                {ownShifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.title} ({moment(shift.start).format("HH:mm")} - {moment(shift.end).format("HH:mm")})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t("targetShift") || "Targeted Shift:"}</label>
              <select
                className="form-select"
                value={selectedTargetShift}
                onChange={(e) => setSelectedTargetShift(e.target.value)}
              >
                <option value="">{t("selectTargetShift") || "-- Select Target Shift --"}</option>
                {targetShifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.title} ({moment(shift.start).format("HH:mm")} - {moment(shift.end).format("HH:mm")})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {t("submitSwapRequest") || "Submit Swap Request"}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-4 request-list">
        <h3>{t("myPendingSwapRequests") || "My Pending Swap Requests"}</h3>
        {swapRequests.filter((req) => req.employeeId === Number(currentUser.id)).length === 0 ? (
          <p>{t("noPendingRequests") || "No pending requests."}</p>
        ) : (
          <ul className="list-group">
            {swapRequests
              .filter((req) => req.employeeId === Number(currentUser.id))
              .map((req) => (
                <li key={req.id} className="list-group-item">
                  <strong>
                    {t("requestNumber") || "Request #"}
                    {req.id}
                  </strong>
                  : {req.ownShift.title} {t("swapArrow") || "→"} {req.targetShift.title} (
                  {t("status") || "Status"}: {req.status})
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShiftSwapRequests;
