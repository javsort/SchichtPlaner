// src/pages/ShiftSwapRequests.tsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
// import "../styles/ShiftSwapRequests.css"; // CSS import commented out

import { Shift, SwapRequest } from "../App";

interface EmployeeShiftSwapProps {
  currentUser: { id: number; name: string } | null;
  shifts: Shift[];
  swapRequests: SwapRequest[];
  setSwapRequests: React.Dispatch<React.SetStateAction<SwapRequest[]>>;
  dummyEmployees: { id: number; name: string }[];
}

const localizer = momentLocalizer(moment);

const ShiftSwapRequests: React.FC<EmployeeShiftSwapProps> = ({
  currentUser,
  shifts,
  swapRequests,
  setSwapRequests,
  dummyEmployees,
}) => {
  const [view, setView] = useState(Views.WEEK);
  const [employeeName, setEmployeeName] = useState(currentUser ? currentUser.name : "");
  const [selectedOwnShift, setSelectedOwnShift] = useState<string>("");
  const [selectedTargetEmployee, setSelectedTargetEmployee] = useState<string>("");
  const [selectedTargetShift, setSelectedTargetShift] = useState<string>("");
  const [message, setMessage] = useState("");

  // Filter available target shifts for the selected target employee
  const availableTargetShifts = shifts.filter(
    (shift) => shift.assignedEmployee === Number(selectedTargetEmployee)
  );

  // Basic conflict detection: checks if the two shifts overlap
  const isSwapConflict = (ownShift: Shift, targetShift: Shift) => {
    return ownShift.start < targetShift.end && targetShift.start < ownShift.end;
  };

  const handleSubmitSwapRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ownShift = shifts.find((shift) => shift.id === Number(selectedOwnShift));
    const targetShift = shifts.find((shift) => shift.id === Number(selectedTargetShift));

    if (!currentUser && !employeeName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!ownShift || !targetShift || !selectedTargetEmployee) {
      alert("Please select your shift, a target employee, and a target shift.");
      return;
    }

    if (isSwapConflict(ownShift, targetShift)) {
      alert("Conflict: The selected shifts overlap. Please choose a different swap option.");
      return;
    }

    const newRequest: SwapRequest = {
      id: Date.now(),
      employeeId: currentUser ? currentUser.id : null,
      employeeName: currentUser ? currentUser.name : employeeName,
      ownShift,
      targetEmployee: dummyEmployees.find(
        (emp) => emp.id === Number(selectedTargetEmployee)
      )!,
      targetShift,
      message,
      status: "Pending Authorization",
    };

    setSwapRequests([...swapRequests, newRequest]);

    // Reset form fields
    setSelectedOwnShift("");
    setSelectedTargetEmployee("");
    setSelectedTargetShift("");
    setMessage("");
    if (!currentUser) setEmployeeName("");
  };

  const calendarEvents = shifts.map((shift) => ({
    ...shift,
    title: `${shift.title} - ${dummyEmployees.find((emp) => emp.id === shift.assignedEmployee)?.name}`,
  }));

  return (
    <div className="shift-swap-container">
      <h2>Shift Swap Requests (Employee)</h2>
      <div className="calendar-container" style={{ height: "500px", marginBottom: "30px" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(newView) => setView(newView)}
          style={{ height: 500 }}
        />
      </div>

      <div className="request-form">
        <h3>Request a Shift Swap</h3>
        <form onSubmit={handleSubmitSwapRequest}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Enter your name"
              disabled={currentUser ? true : false}
            />
          </div>
          <div className="form-group">
            <label>Your Shift</label>
            <select
              value={selectedOwnShift}
              onChange={(e) => setSelectedOwnShift(e.target.value)}
            >
              <option value="">-- Select your shift --</option>
              {shifts
                .filter((shift) => shift.assignedEmployee === (currentUser ? currentUser.id : null))
                .map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.title} ( {moment(shift.start).format("HH:mm")} - {moment(shift.end).format("HH:mm")} )
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Target Employee</label>
            <select
              value={selectedTargetEmployee}
              onChange={(e) => {
                setSelectedTargetEmployee(e.target.value);
                setSelectedTargetShift("");
              }}
            >
              <option value="">-- Select target employee --</option>
              {dummyEmployees
                .filter((emp) => emp.id !== (currentUser ? currentUser.id : null))
                .map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
            </select>
          </div>
          {selectedTargetEmployee && (
            <div className="form-group">
              <label>Target Shift</label>
              <select
                value={selectedTargetShift}
                onChange={(e) => setSelectedTargetShift(e.target.value)}
              >
                <option value="">-- Select target shift --</option>
                {availableTargetShifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.title} ( {moment(shift.start).format("HH:mm")} - {moment(shift.end).format("HH:mm")} )
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Optional Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message (optional)"
            ></textarea>
          </div>
          <button type="submit">Submit Swap Request</button>
        </form>
      </div>
    </div>
  );
};

export default ShiftSwapRequests;
