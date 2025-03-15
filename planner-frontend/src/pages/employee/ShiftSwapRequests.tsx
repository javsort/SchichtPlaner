// src/pages/employee/ShiftSwapRequests.tsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth, AuthUser } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import "./ShiftSwapRequests.css";
import { fetchAllSwapProposals } from "../../Services/api.ts";

// Extend the AuthUser type with properties used in this component.
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

const defaultEmployees: { id: number; name: string }[] = [
  // You can fetch employee data from your backend as well.
];

type CalendarView = "month" | "week" | "day" | "agenda";

const localizer = momentLocalizer(moment);

interface ShiftSwapRequestsProps {
  dummyEmployees?: { id: number; name: string }[];
}

const ShiftSwapRequests: React.FC<ShiftSwapRequestsProps> = ({
  dummyEmployees = defaultEmployees,
}) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  // Cast or default to an ExtendedAuthUser type
  const currentUser: ExtendedAuthUser =
    (user as ExtendedAuthUser) || { id: 1, name: "John Doe", email: "", role: "" };

  // Calendar localization
  moment.locale(i18n.language);
  const messages = {
    today: t("calendarToday"),
    previous: t("calendarBack"),
    next: t("calendarNext"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda")
  };

  // State for form selections and message
  const [selectedOwnShift, setSelectedOwnShift] = useState("");
  const [selectedTargetEmployee, setSelectedTargetEmployee] = useState("");
  const [selectedTargetShift, setSelectedTargetShift] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState<CalendarView>(Views.WEEK as CalendarView);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);

  // Load swap proposals from backend for the current user on mount
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

  // For demonstration, assume an empty shifts array; in production, fetch from backend.
  const shifts: Shift[] = [];

  const availableTargetShifts = shifts.filter(
    (shift) => shift.assignedEmployee === Number(selectedTargetEmployee)
  );

  const handleSubmitSwapRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ownShift = shifts.find((shift) => shift.id === Number(selectedOwnShift));
    const targetShift = shifts.find((shift) => shift.id === Number(selectedTargetShift));

    if (!ownShift || !targetShift || !selectedTargetEmployee) {
      alert(t("selectRequiredFields") || "Please select your shift, target employee, and target shift.");
      return;
    }

    const newRequestData: Omit<SwapRequest, "id"> = {
      employeeId: Number(currentUser.id),
      employeeName: currentUser.name,
      ownShift,
      targetEmployee:
        dummyEmployees.find((emp) => emp.id === Number(selectedTargetEmployee)) || {
          id: 0,
          name: t("unknownEmployee") || "Unknown"
        },
      targetShift,
      message,
      status: "Pending"
    };

    // Simulate creating a new swap proposal locally (since proposeSwapProposal is not available)
    const newRequest: SwapRequest = { id: Date.now(), ...newRequestData };

    // Optionally, you could also merge with proposals fetched from backend:
    setSwapRequests((prev) => [...prev, newRequest]);
    alert(t("swapRequestSubmitted") || "Swap request submitted!");

    setSelectedOwnShift("");
    setSelectedTargetEmployee("");
    setSelectedTargetShift("");
    setMessage("");
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
                {shifts
                  .filter((shift) => shift.assignedEmployee === Number(currentUser.id))
                  .map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.title} ({moment(shift.start).format("HH:mm")} - {moment(shift.end).format("HH:mm")})
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t("targetEmployee") || "Target Employee:"}</label>
              <select
                className="form-select"
                value={selectedTargetEmployee}
                onChange={(e) => {
                  setSelectedTargetEmployee(e.target.value);
                  setSelectedTargetShift("");
                }}
              >
                <option value="">{t("selectTargetEmployee") || "-- Select Target Employee --"}</option>
                {dummyEmployees
                  .filter((emp) => emp.id !== Number(currentUser.id))
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
              </select>
            </div>
            {selectedTargetEmployee && (
              <div className="form-group">
                <label>{t("targetShift") || "Target Shift:"}</label>
                <select
                  className="form-select"
                  value={selectedTargetShift}
                  onChange={(e) => setSelectedTargetShift(e.target.value)}
                >
                  <option value="">{t("selectTargetShift") || "-- Select Target Shift --"}</option>
                  {availableTargetShifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.title} ({moment(shift.start).format("HH:mm")} - {moment(shift.end).format("HH:mm")})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>{t("messageOptional") || "Message (optional):"}</label>
              <textarea
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("enterMessage") || "Enter a message..."}
              />
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
