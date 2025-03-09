// src/pages/employee/ShiftSwapRequests.tsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import "./ShiftSwapRequests.css";

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

const defaultShifts: Shift[] = [/* ... */];
const defaultEmployees = [/* ... */];

interface ShiftSwapRequestsProps {
  shifts?: Shift[];
  swapRequests?: SwapRequest[];
  setSwapRequests: React.Dispatch<React.SetStateAction<SwapRequest[]>>;
  dummyEmployees?: { id: number; name: string }[];
}

const localizer = momentLocalizer(moment);

const ShiftSwapRequests: React.FC<ShiftSwapRequestsProps> = ({
  shifts = defaultShifts,
  swapRequests = [],
  setSwapRequests,
  dummyEmployees = defaultEmployees,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const currentUser = user || { id: 1, name: "John Doe" };

  // State
  const [selectedOwnShift, setSelectedOwnShift] = useState("");
  const [selectedTargetEmployee, setSelectedTargetEmployee] = useState("");
  const [selectedTargetShift, setSelectedTargetShift] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState(Views.WEEK);

  // Filter available target shifts
  const availableTargetShifts = shifts.filter(
    (shift) => shift.assignedEmployee === Number(selectedTargetEmployee)
  );

  // Submit
  const handleSubmitSwapRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ownShift = shifts.find((shift) => shift.id === Number(selectedOwnShift));
    const targetShift = shifts.find((shift) => shift.id === Number(selectedTargetShift));

    if (!ownShift || !targetShift || !selectedTargetEmployee) {
      alert(t("selectRequiredFields") || "Please select your shift, target employee, and target shift.");
      return;
    }

    const newRequest: SwapRequest = {
      id: Date.now(),
      employeeId: Number(currentUser.id),
      employeeName: currentUser.name,
      ownShift,
      targetEmployee:
        dummyEmployees.find((emp) => emp.id === Number(selectedTargetEmployee)) || {
          id: 0,
          name: t("unknownEmployee") || "Unknown",
        },
      targetShift,
      message,
      status: "Pending",
    };

    setSwapRequests([...swapRequests, newRequest]);
    alert(t("swapRequestSubmitted") || "Swap request submitted!");

    // Reset
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
            localizer={localizer}
            events={shifts}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(newView) => setView(newView)}
            style={{ height: 500, width: "100%" }}
          />
        </div>

        <div className="col-md-4">
          <form onSubmit={handleSubmitSwapRequest} className="request-form">
            {/* Own Shift */}
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

            {/* Target Employee */}
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

            {/* Target Shift */}
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

            {/* Message */}
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

      {/* Pending Requests */}
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
