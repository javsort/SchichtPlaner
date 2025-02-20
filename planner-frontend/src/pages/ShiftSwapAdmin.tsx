// src/pages/ShiftSwapAdmin.tsx
import React from "react";
import moment from "moment";
import "ShiftSwapAdmin.css"; // Adjust the path to your CSS file
import { Shift, SwapRequest } from "../App";

interface AdminShiftSwapProps {
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  swapRequests: SwapRequest[];
  setSwapRequests: React.Dispatch<React.SetStateAction<SwapRequest[]>>;
  dummyEmployees: { id: number; name: string }[];
}

const ShiftSwapAdmin: React.FC<AdminShiftSwapProps> = ({
  shifts,
  setShifts,
  swapRequests,
  setSwapRequests,
  dummyEmployees,
}) => {
  const handleApprove = (requestId: number) => {
    const req = swapRequests.find((r) => r.id === requestId);
    if (!req || req.status !== "Pending Authorization") return;

    // Swap the assigned employees between the two shifts
    setShifts((prevShifts) =>
      prevShifts.map((shift) => {
        if (shift.id === req.ownShift.id) {
          return { ...shift, assignedEmployee: req.targetEmployee.id };
        } else if (shift.id === req.targetShift.id) {
          return { ...shift, assignedEmployee: req.employeeId || shift.assignedEmployee };
        }
        return shift;
      })
    );

    // Update the request status to "Approved"
    setSwapRequests(
      swapRequests.map((r) =>
        r.id === requestId ? { ...r, status: "Approved" } : r
      )
    );
  };

  const handleReject = (requestId: number) => {
    setSwapRequests(
      swapRequests.map((r) =>
        r.id === requestId ? { ...r, status: "Rejected" } : r
      )
    );
  };

  return (
    <div className="admin-container">
      <h2>Admin: Manage Shift Swap Requests</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Original Shift</th>
            <th>Target Employee</th>
            <th>Requested Shift</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {swapRequests.length > 0 ? (
            swapRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.employeeName}</td>
                <td>
                  {req.ownShift.title} ( {moment(req.ownShift.start).format("HH:mm")} - {moment(req.ownShift.end).format("HH:mm")} )
                </td>
                <td>{req.targetEmployee.name}</td>
                <td>
                  {req.targetShift.title} ( {moment(req.targetShift.start).format("HH:mm")} - {moment(req.targetShift.end).format("HH:mm")} )
                </td>
                <td>{req.message || "-"}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === "Pending Authorization" ? (
                    <>
                      <button onClick={() => handleApprove(req.id)}>Approve</button>
                      <button onClick={() => handleReject(req.id)}>Reject</button>
                    </>
                  ) : (
                    <span>{req.status}</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No swap requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftSwapAdmin;
