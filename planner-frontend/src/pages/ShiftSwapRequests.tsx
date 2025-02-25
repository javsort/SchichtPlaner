// src/pages/ShiftSwapRequests.tsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../AuthContext.tsx";

// --------------------
// Types
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
// Default Dummy Data
// --------------------
const defaultShifts: Shift[] = [
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
    id: 103,
    title: "Afternoon Shift",
    start: new Date(2025, 1, 24, 13, 0),
    end: new Date(2025, 1, 24, 17, 0),
    assignedEmployee: 1,
  },
  {
    id: 104,
    title: "Evening Shift",
    start: new Date(2025, 1, 24, 17, 0),
    end: new Date(2025, 1, 24, 21, 0),
    assignedEmployee: 2,
  },
  // Added dummy shift for testing purposes (for current user John Doe)
  {
    id: 105,
    title: "Night Shift (Dummy)",
    start: new Date(2025, 1, 25, 21, 0),
    end: new Date(2025, 1, 26, 5, 0),
    assignedEmployee: 1,
  },
];

const defaultEmployees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

// --------------------
// Props Interface
// --------------------
interface ShiftSwapRequestsProps {
  shifts?: Shift[];
  swapRequests?: SwapRequest[];
  setSwapRequests: React.Dispatch<React.SetStateAction<SwapRequest[]>>;
  dummyEmployees?: { id: number; name: string }[];
}

// --------------------
// Component
// --------------------
const localizer = momentLocalizer(moment);

const ShiftSwapRequests: React.FC<ShiftSwapRequestsProps> = ({
  shifts = defaultShifts,
  swapRequests = [],
  setSwapRequests,
  dummyEmployees = defaultEmployees,
}) => {
  const { user } = useAuth();

  // Fallback user if not authenticated
  const currentUser = user || { id: 1, name: "John Doe" };

  // State
  const [selectedOwnShift, setSelectedOwnShift] = useState("");
  const [selectedTargetEmployee, setSelectedTargetEmployee] = useState("");
  const [selectedTargetShift, setSelectedTargetShift] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState(Views.WEEK);

  // Debug
  console.log("currentUser:", currentUser);
  console.log("shifts:", shifts);
  console.log("dummyEmployees:", dummyEmployees);

  // Filter target shifts
  const availableTargetShifts = shifts.filter(
    (shift) => shift.assignedEmployee === Number(selectedTargetEmployee)
  );

  // Submit Handler
  const handleSubmitSwapRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ownShift = shifts.find((shift) => shift.id === Number(selectedOwnShift));
    const targetShift = shifts.find((shift) => shift.id === Number(selectedTargetShift));

    if (!ownShift || !targetShift || !selectedTargetEmployee) {
      alert("Please select your shift, target employee, and target shift.");
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
          name: "Unknown",
        },
      targetShift,
      message,
      status: "Pending",
    };

    setSwapRequests([...swapRequests, newRequest]);
    alert("Swap request submitted!");

    // Reset form
    setSelectedOwnShift("");
    setSelectedTargetEmployee("");
    setSelectedTargetShift("");
    setMessage("");
  };

  return (
    <div className="container mt-4">
      <h2>Request a Shift Swap</h2>
      <div className="row">
        {/* Calendar */}
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

        {/* Swap Form */}
        <div className="col-md-4">
          <form onSubmit={handleSubmitSwapRequest} className="p-3 border rounded">
            <div className="mb-3">
              <label>Your Shift:</label>
              <select
                className="form-select"
                value={selectedOwnShift}
                onChange={(e) => setSelectedOwnShift(e.target.value)}
              >
                <option value="">-- Select Your Shift --</option>
                {shifts
                  .filter((shift) => shift.assignedEmployee === Number(currentUser.id))
                  .map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.title} ({moment(shift.start).format("HH:mm")} -{" "}
                      {moment(shift.end).format("HH:mm")})
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Target Employee:</label>
              <select
                className="form-select"
                value={selectedTargetEmployee}
                onChange={(e) => {
                  setSelectedTargetEmployee(e.target.value);
                  setSelectedTargetShift("");
                }}
              >
                <option value="">-- Select Target Employee --</option>
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
              <div className="mb-3">
                <label>Target Shift:</label>
                <select
                  className="form-select"
                  value={selectedTargetShift}
                  onChange={(e) => setSelectedTargetShift(e.target.value)}
                >
                  <option value="">-- Select Target Shift --</option>
                  {availableTargetShifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.title} ({moment(shift.start).format("HH:mm")} -{" "}
                      {moment(shift.end).format("HH:mm")})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label>Message (optional):</label>
              <textarea
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter a message..."
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit Swap Request
            </button>
          </form>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mt-4">
        <h3>My Pending Swap Requests</h3>
        {swapRequests.filter((req) => req.employeeId === Number(currentUser.id)).length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul className="list-group">
            {swapRequests
              .filter((req) => req.employeeId === Number(currentUser.id))
              .map((req) => (
                <li key={req.id} className="list-group-item">
                  <strong>Request #{req.id}</strong>: {req.ownShift.title} →{" "}
                  {req.targetShift.title} (Status: {req.status})
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShiftSwapRequests;
