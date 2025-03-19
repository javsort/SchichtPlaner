// src/pages/employee/ShiftSwapRequests.tsx

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth, AuthUser } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import "./ShiftSwapRequests.css";
import {
  fetchAllSwapProposals, // API to get all swap proposals
  fetchShifts,           // API call that returns all shifts
  requestSwapProposal    // New API function to persist swap requests
} from "../../Services/api.ts";

/** 
 * Extend your AuthUser type to match how you store user data.
 */
interface ExtendedAuthUser extends AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string;
}

/**
 * Shift interface describing a single shift entity.
 */
export interface Shift {
  id: number;
  title: string;
  employeeId: number | null;
  shiftOwner: string;
  role: string;
  start: Date;
  end: Date;
}

/**
 * Minimal SwapRequest interface.
 * Note: We removed ownShift and targetShift properties and will use the minimal fields.
 */
export interface SwapRequest {
  id: number;
  employeeId: number;        // The user requesting the swap
  currentShiftId: number;    // The shift to swap out (own shift id)
  proposedTitle: string;     // The title of the own shift
  proposedStartTime: string; // ISO string of the target shift start time
  proposedEndTime: string;   // ISO string of the target shift end time
  status: "Pending" | "Approved" | "Rejected";
}

type CalendarView = "month" | "week" | "day" | "agenda";
const localizer = momentLocalizer(moment);

const ShiftSwapRequests: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  // Extract current user details using the proper property names
  const currentUser: ExtendedAuthUser =
  user && (user as any).userId
    ? {
        id: Number((user as any).userId),
        name: (user as any).username || "John Doe",
        email: user.email,
        role: user.role,
        permissions: (user as any).permissions || "",
      }
    : {
        id: 1,
        name: "John Doe",
        email: "",
        role: "",
        permissions: "",
      };

  // Debug logs
  useEffect(() => {
    console.log("Email:", currentUser.email);
    console.log("Role:", currentUser.role);
    console.log("Id:", currentUser.id);
    console.log("Token:", localStorage.getItem("token"));
  }, [currentUser]);

  const messages = {
    today: t("calendarToday"),
    previous: t("calendarBack"),
    next: t("calendarNext"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda")
  };

  // Form state for selecting shifts
  const [selectedOwnShift, setSelectedOwnShift] = useState("");
  const [selectedTargetShift, setSelectedTargetShift] = useState("");
  const [view, setView] = useState<CalendarView>(Views.WEEK as CalendarView);

  // All swap requests for the current user
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  // All shifts loaded from the backend
  const [shifts, setShifts] = useState<Shift[]>([]);

  /**
   * Map raw shift data from the API into our local Shift interface.
   */
  const mapShifts = (fetchedShifts: any[]): Shift[] => {
    return fetchedShifts.map((shift) => {
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
  };

  // Load all shifts on mount.
  useEffect(() => {
    const loadShifts = async () => {
      try {
        const fetchedShifts = await fetchShifts();
        if (!Array.isArray(fetchedShifts)) {
          console.error("Invalid API response for shifts:", fetchedShifts);
          return;
        }
        const formattedShifts = mapShifts(fetchedShifts);
        setShifts(formattedShifts);
        console.log("Formatted shifts:", formattedShifts);
      } catch (error) {
        console.error("Error loading shifts:", error);
      }
    };
    loadShifts();
  }, []);

  // Load swap proposals for the current user.
  useEffect(() => {
    const loadUserSwapProposals = async () => {
      try {
        const proposals = await fetchAllSwapProposals();
        const userProposals = proposals.filter(
          (req: SwapRequest) => req.employeeId === currentUser.id
        );
        setSwapRequests(userProposals);
      } catch (error) {
        console.error("Error loading swap proposals:", error);
      }
    };
    loadUserSwapProposals();
  }, [currentUser.id]);

  // Filter out only the shifts belonging to the current user.
  const userShifts = shifts.filter(
    (shift) => shift.employeeId === currentUser.id
  );
  useEffect(() => {
    console.log("User shifts:", userShifts);
  }, [userShifts]);

  // Among the user’s shifts, only show future shifts for "ownShift" selection.
  const ownShifts = userShifts.filter((shift) =>
    moment(shift.start).isAfter(moment(), "day")
  );

  // For the "targetShift" selection, show future shifts not assigned to the current user
  // and only those shifts that have the same role as the current user.
  const targetShifts = shifts.filter(
    (shift) =>
      shift.employeeId !== currentUser.id &&
      moment(shift.start).isAfter(moment(), "day") &&
      shift.role.toLowerCase() === currentUser.role.toLowerCase()
  );

  /**
   * Handle submitting a new swap request.
   */
  const handleSubmitSwapRequest = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const ownShift = shifts.find(
      (shift) => shift.id === Number(selectedOwnShift)
    );
    const targetShift = shifts.find(
      (shift) => shift.id === Number(selectedTargetShift)
    );

    if (!ownShift || !targetShift) {
      alert(
        t("selectRequiredFields") ||
          "Please select your shift and target shift."
      );
      return;
    }

    // Build the new request object with the expected fields.
    const newRequestData = {
      employeeId: currentUser.id,
      currentShiftId: ownShift.id,
      proposedTitle: targetShift.title,
      proposedStartTime: targetShift.start.toISOString(),
      proposedEndTime: targetShift.end.toISOString(),
    };

    try {
      const createdRequest: SwapRequest = await requestSwapProposal(newRequestData);
      setSwapRequests((prev) => [...prev, createdRequest]);
      alert(t("swapRequestSubmitted") || "Swap request submitted!");
      setSelectedOwnShift("");
      setSelectedTargetShift("");
    } catch (error) {
      console.error("Error creating swap proposal:", error);
      alert(
        t("errorSubmittingSwapRequest") ||
          "There was an error submitting your swap request. Please try again."
      );
    }
  };

  return (
    <div className="shift-swap-container">
      <h2>{t("requestShiftSwap") || "Request a Shift Swap"}</h2>

      <div className="row">
        {/* Left side: Calendar showing only user’s shifts */}
        <div className="col-md-8">
          <Calendar
            key={i18n.language}
            localizer={localizer}
            culture={i18n.language}
            messages={messages}
            events={userShifts}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(newView) => setView(newView as CalendarView)}
            style={{ height: 500, width: "100%" }}
          />
        </div>

        {/* Right side: Form to pick your shift & target shift */}
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
                    {shift.title} (
                    {moment(shift.start).format("HH:mm")} -{" "}
                    {moment(shift.end).format("HH:mm")})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t("targetShift") || "Target Shift:"}</label>
              <select
                className="form-select"
                value={selectedTargetShift}
                onChange={(e) => setSelectedTargetShift(e.target.value)}
              >
                <option value="">{t("selectTargetShift") || "-- Select Target Shift --"}</option>
                {targetShifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.title} (
                    {moment(shift.start).format("HH:mm")} -{" "}
                    {moment(shift.end).format("HH:mm")})
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

      {/* Display user’s pending swap requests with offset applied for display */}
      <div className="mt-4 request-list">
        <h3>{t("myPendingSwapRequests") || "My Pending Swap Requests"}</h3>
        {swapRequests.filter((req) => req.employeeId === currentUser.id).length === 0 ? (
          <p>{t("noPendingRequests") || "No pending requests."}</p>
        ) : (
          <ul className="list-group">
            {swapRequests
              .filter((req) => req.employeeId === currentUser.id)
              .map((req) => {
                // Apply one-hour offset only for display in this list
                const start = req.proposedStartTime ? new Date(req.proposedStartTime) : new Date();
                const end = req.proposedEndTime ? new Date(req.proposedEndTime) : new Date();
                start.setHours(start.getHours() + 1);
                end.setHours(end.getHours() + 1);
                return (
                  <li key={req.id} className="list-group-item">
                    <strong>
                      {t("requestNumber") || "Request #"}
                      {req.id}
                    </strong>
                    : {req.proposedTitle} {t("swapArrow") || "→"}{" "}
                    {moment(start).format("HH:mm")} - {moment(end).format("HH:mm")} (
                    {t("status") || "Status"}: {req.status})
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShiftSwapRequests;
