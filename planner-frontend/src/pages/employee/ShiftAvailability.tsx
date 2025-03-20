import React, { useState, useEffect } from "react";
import "./ShiftAvailability.css";
import {
  proposeShift,
  fetchUserProposalShifts,
  updateShiftProposal,
  deleteShiftProposal,
} from "../../Services/api.ts";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function getDaysInMonth(year: number, month: number): Date[] {
  const dates: Date[] = [];
  let current = new Date(year, month, 1);
  while (current.getMonth() === month) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let half = 0; half < 2; half++) {
      const hh = hour.toString().padStart(2, "0");
      const mm = half === 0 ? "00" : "30";
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
}

// Simple info icon used for tooltips
const InfoIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    style={{ marginLeft: "6px" }}
  >
    <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#4da8d6" strokeWidth="1" />
    <path fill="#000000" d="M7.5 12h1V7h-1v5zm0-6h1V5h-1v1z" />
  </svg>
);

type Availability = {
  from: string;
  to: string;
};

type MyProposal = {
  id?: number;
  date: string;
  from: string;
  to: string;
};

const ShiftAvailability: React.FC = () => {
  const { t } = useTranslation();

  // Instead of a fixed English array, we call t(...) for each month.
  // The second argument is a fallback.
  const MONTH_NAMES = [
    t("January", "January"),
    t("February", "February"),
    t("March", "March"),
    t("April", "April"),
    t("May", "May"),
    t("June", "June"),
    t("July", "July"),
    t("August", "August"),
    t("September", "September"),
    t("October", "October"),
    t("November", "November"),
    t("December", "December"),
  ];

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [days, setDays] = useState<Date[]>(getDaysInMonth(selectedYear, selectedMonth));
  const timeOptions = generateTimeOptions();

  const [availability, setAvailability] = useState<{ [dateStr: string]: Availability }>(() => {
    const init: { [dateStr: string]: Availability } = {};
    getDaysInMonth(today.getFullYear(), today.getMonth()).forEach((date) => {
      const dateStr = date.toISOString().split("T")[0];
      init[dateStr] = { from: "", to: "" };
    });
    return init;
  });

  // Store user’s selected shift proposals for the sidebar
  const [myProposals, setMyProposals] = useState<MyProposal[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editFrom, setEditFrom] = useState<string>("");
  const [editTo, setEditTo] = useState<string>("");

  // Notification Toast
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getMyProposals = async () => {
    const empId = localStorage.getItem("userId");
    if (!empId) {
      console.error("Error: Employee ID not found.");
      return;
    }

    try {
      // Fetch the employee's shift proposals
      const proposals = await fetchUserProposalShifts(empId);
      const proposedOnly = proposals.filter((p: any) => p.status === "PROPOSED");

      const mappedProposals = proposedOnly.map((proposal: any) => {
        const startDate = new Date(proposal.proposedStartTime);
        const endDate = new Date(proposal.proposedEndTime);
        const dateStr = startDate.toISOString().split("T")[0];

        const fromStr = startDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const toStr = endDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        return {
          id: proposal.id,
          date: dateStr,
          from: fromStr,
          to: toStr,
        };
      });

      setMyProposals(mappedProposals);
    } catch (error) {
      console.error("Error fetching shift proposals:", error);
    }
  };

  useEffect(() => {
    getMyProposals();
  }, []);

  // Update days & availability when month/year changes
  useEffect(() => {
    const newDays = getDaysInMonth(selectedYear, selectedMonth);
    setDays(newDays);

    const init: { [dateStr: string]: Availability } = {};
    newDays.forEach((date) => {
      const dateStr = date.toISOString().split("T")[0];
      init[dateStr] = { from: "", to: "" };
    });
    setAvailability(init);
  }, [selectedMonth, selectedYear]);

  const handleChange = (dateStr: string, field: keyof Availability, value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], [field]: value }
    }));
  };

  const handleSave = async () => {
    const employee = localStorage.getItem("user");
    if (!employee) {
      showNotification(t("employeeNotFound") || "Error: Employee not found.", "error");
      return;
    }

    const employeeData = JSON.parse(employee);
    const employeeId = employeeData.userId;
    const empName = employeeData.username;
    const role = employeeData.role;
    if (!employeeId) {
      showNotification(t("employeeIdNotFound") || "Error: Employee ID not found.", "error");
      return;
    }

    const proposedTitle = `Shift for Employee ${employeeId} (${role})`;
    const status = "PROPOSED";
    let hasAtLeastOneShift = false;

    // Loop through each date in availability
    for (const dateStr in availability) {
      const { from, to } = availability[dateStr];
      if (from && to) {
        hasAtLeastOneShift = true;
        try {
          const startDate = new Date(`${dateStr}T${from}:00`);
          startDate.setDate(startDate.getDate() + 1);
          const start = new Date(
            startDate.getTime() - startDate.getTimezoneOffset() * 60000
          ).toISOString();

          const endDate = new Date(`${dateStr}T${to}:00`);
          endDate.setDate(endDate.getDate() + 1);
          const end = new Date(
            endDate.getTime() - endDate.getTimezoneOffset() * 60000
          ).toISOString();

          await proposeShift(employeeId, proposedTitle, start, end, status);

          // Create new proposal for optimistic update
          const newProposal: MyProposal = {
            id: Date.now(),
            date: dateStr,
            from,
            to,
          };
          setMyProposals((prev) => [...prev, newProposal]);
        } catch (error) {
          console.error("Error saving availability:", error);
          showNotification(
            t("errorSavingAvailability") || "Error saving availability.",
            "error"
          );
          return;
        }
      }
    }

    if (hasAtLeastOneShift) {
      showNotification(t("availabilitySaved") || "Availability saved!", "success");
      // Re-fetch to sync with backend (if necessary)
      getMyProposals();
    } else {
      showNotification(t("noShiftsSelected") || "No shifts selected.", "error");
    }
  };

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditFrom(myProposals[index].from);
    setEditTo(myProposals[index].to);
  };

  const handleDelete = async (index: number) => {
    const proposal = myProposals[index];
    if (!proposal) return;

    const empId = localStorage.getItem("userId");
    if (!empId) {
      showNotification("Error: Employee not found.", "error");
      return;
    }

    try {
      await deleteShiftProposal(proposal.id!, empId);
      showNotification("Shift proposal deleted!", "success");
      getMyProposals();
    } catch (error) {
      showNotification("Error deleting shift proposal.", "error");
      console.error(error);
    }
  };

  const handleSaveEdit = async () => {
    if (editIndex === null) return;
    const oldProposal = myProposals[editIndex];

    const empId = localStorage.getItem("userId");
    if (!empId) {
      showNotification("Error: Employee not found.", "error");
      return;
    }

    const dateStr = oldProposal.date;
    const startDate = new Date(`${dateStr}T${editFrom}:00`);
    const endDate = new Date(`${dateStr}T${editTo}:00`);

    startDate.setHours(startDate.getHours() + 1);
    endDate.setHours(endDate.getHours() + 1);

    const proposedStartTime = startDate.toISOString();
    const proposedEndTime = endDate.toISOString();

    const employee = localStorage.getItem("user");
    if (!employee) {
      showNotification(t("employeeNotFound") || "Error: Employee not found.", "error");
      return;
    }

    const employeeData = JSON.parse(employee);
    const role = employeeData.role;

    const proposedTitle = `Shift for Employee ${empId} (${role})`;
    const status = "PROPOSED";

    const updatedPayload = {
      proposedTitle,
      proposedStartTime,
      proposedEndTime,
      status
    };

    try {
      await updateShiftProposal(oldProposal.id!, empId, updatedPayload);
      showNotification("Shift proposal updated!", "success");
      getMyProposals();
    } catch (error) {
      showNotification("Error updating shift proposal.", "error");
      console.error(error);
    }

    setEditIndex(null);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  return (
    <div className="shift-availability-layout">
      {/* Left: Shift Availability Form */}
      <div className="shift-availability-container">
        {notification && (
          <div className={`notification-toast ${notification.type} show`}>
            {notification.message}
          </div>
        )}

        <h2>{t("shiftAvailability") || "Shift Availability"}</h2>
        <div className="month-year-selector">
          <label>
            {t("monthLabel") || "Month:"}{" "}
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="month-tooltip">
                  {t("monthTooltip", "Select your month.")}
                </Tooltip>
              }
            >
              <span style={{ cursor: "pointer" }}>
                <InfoIcon />
              </span>
            </OverlayTrigger>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.map((name, index) => (
                <option key={index} value={index}>
                  {t(name)}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t("yearLabel") || "Year:"}{" "}
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="year-tooltip">
                  {t("yearTooltip", "Select your year.")}
                </Tooltip>
              }
            >
              <span style={{ cursor: "pointer" }}>
                <InfoIcon />
              </span>
            </OverlayTrigger>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-container">
          <table className="shift-table">
            <thead>
              <tr>
                <th>{t("date") || "Date"}</th>
                <th>{t("from") || "From"}</th>
                <th>{t("to") || "To"}</th>
              </tr>
            </thead>
            <tbody>
              {days.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                const formatted = date.toLocaleDateString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                  year: "2-digit"
                });
                return (
                  <tr key={dateStr}>
                    <td>{formatted}</td>
                    <td>
                      <select
                        value={availability[dateStr]?.from || ""}
                        onChange={(e) => handleChange(dateStr, "from", e.target.value)}
                      >
                        <option value="">{t("selectOption") || "Select"}</option>
                        {timeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={availability[dateStr]?.to || ""}
                        onChange={(e) => handleChange(dateStr, "to", e.target.value)}
                      >
                        <option value="">{t("selectOption") || "Select"}</option>
                        {timeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="save-btn" onClick={handleSave}>
          {t("save") || "Save"}
        </button>
      </div>

      {/* Right: My Shift Proposals Sidebar */}
      <div className="shift-proposals-sidebar">
        <div className="shift-proposals-header">
          <h2>{t("myShiftProposals") || "My Shift Proposals"}</h2>
        </div>
        {myProposals.length > 0 ? (
          <div className="proposals-table-container">
            <table className="shift-proposals-table">
              <thead>
                <tr>
                  <th>{t("date") || "Date"}</th>
                  <th>{t("from") || "From"}</th>
                  <th>{t("to") || "To"}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myProposals.map((proposal, idx) => {
                  const dateObj = new Date(proposal.date);
                  const dateFormatted = dateObj.toLocaleDateString(undefined, {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit"
                  });

                  if (editIndex === idx) {
                    return (
                      <tr key={idx}>
                        <td>{dateFormatted}</td>
                        <td>
                          <select value={editFrom} onChange={(e) => setEditFrom(e.target.value)}>
                            {timeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select value={editTo} onChange={(e) => setEditTo(e.target.value)}>
                            {timeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button onClick={handleSaveEdit}>
                            {t("save") || "Save"}
                          </button>
                          <button onClick={handleCancelEdit} style={{ marginLeft: "5px" }}>
                            {t("cancel") || "Cancel"}
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={idx}>
                        <td>{dateFormatted}</td>
                        <td>{proposal.from}</td>
                        <td>{proposal.to}</td>
                        <td>
                          <button onClick={() => handleEditClick(idx)}>
                            {t("edit") || "Edit"}
                          </button>
                          <button onClick={() => handleDelete(idx)} style={{ marginLeft: "5px" }}>
                            {t("delete") || "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontStyle: "italic" }}>
            {t("noShiftProposalsYet") || "No shift proposals yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShiftAvailability;

