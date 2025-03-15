// src/pages/employee/ShiftSwapRequests.tsx

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth, AuthUser } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import "./ShiftSwapRequests.css";
import {
  fetchAllSwapProposals, // Example: if you have an API to get all swap proposals
  fetchShifts            // Example: your API call that returns all shifts
} from "../../Services/api.ts";

/** 
 * Extend your AuthUser type to match how you store user data.
 * If your user object already has an `id` or `name`, you may not need this.
 */
interface ExtendedAuthUser extends AuthUser {
  id: number;
  name: string;
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
 * Minimal SwapRequest interface (no message, no targetEmployee field).
 */
export interface SwapRequest {
  id: number;
  employeeId: number;        // The user requesting the swap
  employeeName: string;      // The user’s name
  ownShift: Shift;           // The user’s chosen shift
  targetShift: Shift;        // The shift they want to swap into
  status: "Pending" | "Approved" | "Rejected";
}

type CalendarView = "month" | "week" | "day" | "agenda";

const localizer = momentLocalizer(moment);

const ShiftSwapRequests: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  // Update: Extract current user id from either user.id or user.userId
  const currentUser: ExtendedAuthUser =
    user && (user as any).userId
      ? {
          id: Number((user as any).userId),
          name: (user as any).username || "John Doe",
          email: user.email,
          role: user.role,
        }
      : {
          id: 1,
          name: "John Doe",
          email: "",
          role: "",
        };

  // React-Big-Calendar i18n messages
  const messages = {
    today: t("calendarToday"),
    previous: t("calendarBack"),
    next: t("calendarNext"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda"),
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
      // Use only the shiftOwnerId—if it's null or undefined, then this shift is not owned.
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

  /**
   * Load all shifts from the backend on mount.
   */
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

  /**
   * Load all swap proposals from the backend (if you have a separate endpoint).
   * Filter only the proposals from the current user.
   */
  useEffect(() => {
    const loadUserSwapProposals = async () => {
      try {
        const proposals = await fetchAllSwapProposals(); // or your function name
        // Filter proposals for the current user
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

  /**
   * Filter out only the shifts belonging to the current user.
   */
  const userShifts = shifts.filter(
    (shift) => shift.employeeId === currentUser.id
  );  

  // Log the filtered user shifts for debugging
  useEffect(() => {
    console.log("User shifts:", userShifts);
  }, [userShifts]);

  /**
   * Among the user’s shifts, only show future shifts for the "ownShift" selection.
   */
  const ownShifts = userShifts.filter((shift) =>
    moment(shift.start).isAfter(moment(), "day")
  );

  /**
   * For the "targetShift" selection, we only show future shifts not assigned to the current user.
   */
  const targetShifts = shifts.filter(
    (shift) =>
      shift.employeeId !== currentUser.id &&
      moment(shift.start).isAfter(moment(), "day")
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

    // Build the new request object
    const newRequestData: Omit<SwapRequest, "id"> = {
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      ownShift,
      targetShift,
      status: "Pending",
    };

    const newRequest: SwapRequest = {
      id: Date.now(),
      ...newRequestData,
    };

    // Optionally POST this to your server here, e.g. await createSwapProposal(newRequest);
    setSwapRequests((prev) => [...prev, newRequest]);

    alert(t("swapRequestSubmitted") || "Swap request submitted!");

    // Reset form fields
    setSelectedOwnShift("");
    setSelectedTargetShift("");
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
            // Only display shifts for the current user:
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
                <option value="">
                  {t("selectYourShift") || "-- Select Your Shift --"}
                </option>
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
                <option value="">
                  {t("selectTargetShift") || "-- Select Target Shift --"}
                </option>
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

      {/* Display user’s pending swap requests */}
      <div className="mt-4 request-list">
        <h3>{t("myPendingSwapRequests") || "My Pending Swap Requests"}</h3>
        {swapRequests.filter((req) => req.employeeId === currentUser.id).length === 0 ? (
          <p>{t("noPendingRequests") || "No pending requests."}</p>
        ) : (
          <ul className="list-group">
            {swapRequests
              .filter((req) => req.employeeId === currentUser.id)
              .map((req) => (
                <li key={req.id} className="list-group-item">
                  <strong>
                    {t("requestNumber") || "Request #"}
                    {req.id}
                  </strong>
                  : {req.ownShift.title} {t("swapArrow") || "→"}{" "}
                  {req.targetShift.title} (
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
